#include <string.h>
#include <sys/socket.h>
#include "SocketConnecter.h"
#include "Logger.h"
/******************************************************************************/
/* SocketConnecter                                                            */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
SocketConnecter::SocketConnecter() :
  m_socket(NULL),
  m_port  (0),
  m_handle(0),
  m_start (false),
  m_status(false)
{
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
SocketConnecter::~SocketConnecter()
{
  int intResult;

  if (m_socket != NULL)
  {
    if (!(intResult = m_socket->Shutdown   (SHUT_RDWR))) g_Logger.Write("Listen Shutdown\n"); else g_Logger.Write("Listen Shutdown Error(%d)\n", m_socket->GetError());
    if (!(intResult = m_socket->CloseSocket()         )) g_Logger.Write("Listen Close\n"   ); else g_Logger.Write("Listen Close Error(%d)\n"   , m_socket->GetError());
    delete m_socket;
  }
}
/******************************************************************************/
/* Open                                                                       */
/******************************************************************************/
int SocketConnecter::Open(const int pPort, int pCpu)
{
  if (m_start) return -1; else m_start = true;

  m_port = pPort;

  pthread_cond_init (&m_condition, NULL);
  pthread_mutex_init(&m_mutex    , NULL);

  if (pthread_create(&m_handle, NULL, Execute, (void*)this)) return -1;

  cpu_set_t objCpuSet;

  CPU_ZERO(&objCpuSet);
  CPU_SET (pCpu, &objCpuSet);

  if (pthread_setaffinity_np(m_handle, sizeof(cpu_set_t), &objCpuSet)) return -1; else return 0;
}
/******************************************************************************/
/* Close                                                                      */
/******************************************************************************/
int SocketConnecter::Close()
{
  if (!m_start) return -1; else m_start = false;

  pthread_mutex_lock    (&m_mutex);
  pthread_cond_broadcast(&m_condition);
  pthread_mutex_unlock  (&m_mutex);

  pthread_join(m_handle, NULL);

  pthread_cond_destroy (&m_condition);
  pthread_mutex_destroy(&m_mutex);

  return 0;
}
/******************************************************************************/
/* ReOpen                                                                     */
/******************************************************************************/
void SocketConnecter::ReOpen()
{
  if (m_start)
  {
    pthread_mutex_lock    (&m_mutex);
    pthread_cond_broadcast(&m_condition);
    pthread_mutex_unlock  (&m_mutex);
  }
}
/******************************************************************************/
/* GetSocket                                                                  */
/******************************************************************************/
Socket* SocketConnecter::GetSocket()
{
  return m_socket;
}
/******************************************************************************/
/* GetStatus                                                                  */
/******************************************************************************/
bool SocketConnecter::GetStatus()
{
  return m_status;
}
/******************************************************************************/
/* Execute                                                                    */
/******************************************************************************/
void* SocketConnecter::Execute(void* pThis)
{
  SocketConnecter* _this     = reinterpret_cast<SocketConnecter*>(pThis);
  Socket*          objSocket = new Socket();
  int              intResult;
  int              intMaxFd  = 0;
  fd_set           objFdSet, objFdSetOrigin;
  struct timeval   objWaitTime;

  if (              objSocket->CreateSocket()              ) g_Logger.Write("Listen Create\n");           else { g_Logger.Write("Listen Create Error(%d)\n", objSocket->GetError()); goto EXIT;  }
  if (!(intResult = objSocket->Bind        (_this->m_port))) g_Logger.Write("Bind(%d)\n", _this->m_port); else { g_Logger.Write("Bind Error(%d)\n"         , objSocket->GetError()); goto CLOSE; }
  if (!(intResult = objSocket->Listen      ()             )) g_Logger.Write("Listen...\n");               else { g_Logger.Write("Listen Error(%d)\n"       , objSocket->GetError()); goto CLOSE; }

  FD_ZERO(&objFdSetOrigin);
  FD_SET (objSocket->GetSocket(), &objFdSetOrigin);
  intMaxFd = objSocket->GetSocket() + 1;

  while (1)
  {
    _this->m_status = false;

    if (_this->m_socket != NULL)
    {
      if (!(intResult = _this->m_socket->Shutdown   (SHUT_RDWR))) g_Logger.Write("Accept Shutdown\n"); else g_Logger.Write("Accept Shutdown Error(%d)\n", _this->m_socket->GetError());
      if (!(intResult = _this->m_socket->CloseSocket()         )) g_Logger.Write("Accept Close\n"   ); else g_Logger.Write("Accept Close Error(%d)\n"   , _this->m_socket->GetError());
      delete _this->m_socket;
      _this->m_socket = NULL;
    }

    if (!_this->m_start) break;

    memcpy(&objFdSet, &objFdSetOrigin, sizeof(fd_set));

    objWaitTime.tv_sec  = 3;
    objWaitTime.tv_usec = 0;
    intResult           = objSocket->Select(intMaxFd, &objFdSet, NULL, NULL, &objWaitTime);

    if (intResult > 0 && FD_ISSET(objSocket->GetSocket(), &objFdSet))
    {
      _this->m_socket = objSocket->Accept();

      if (_this->m_socket->IsInvalidSocket())
        g_Logger.Write("Accept Error(%d)\n", _this->m_socket->GetError());
      else
      {
        g_Logger.Write("Accept\n");
        _this->m_status = true;
        pthread_mutex_lock  (&_this->m_mutex);
        pthread_cond_wait   (&_this->m_condition, &_this->m_mutex);
        pthread_mutex_unlock(&_this->m_mutex);
      }
    }
  }

CLOSE:
  if (!(intResult = objSocket->CloseSocket())) g_Logger.Write("Listen Close\n");
  else                                         g_Logger.Write("Listen Close Error(%d)\n", objSocket->GetError());

EXIT:
  delete objSocket;
  return 0;
}
