#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include "Socket.h"
#define INVALID_SOCKET -1
/******************************************************************************/
/* Socket                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
Socket::Socket() :
  m_socket (0)
{
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
Socket::~Socket()
{
}
/******************************************************************************/
/* CreateSocket                                                               */
/******************************************************************************/
bool Socket::CreateSocket()
{
  int intReuseAddr = 1;

  m_socket = socket(AF_INET, SOCK_STREAM, 0);

  if (setsockopt(m_socket, SOL_SOCKET, SO_REUSEADDR, (const char*)&intReuseAddr, sizeof(intReuseAddr)) == -1) return INVALID_SOCKET;

  return m_socket != INVALID_SOCKET;
}
/******************************************************************************/
/* CloseSocket                                                                */
/******************************************************************************/
int Socket::CloseSocket()
{
  return close(m_socket);
}
/******************************************************************************/
/* Bind                                                                       */
/******************************************************************************/
int Socket::Bind(const int pPort)
{
  struct sockaddr_in objSockAddr;

  memset(&objSockAddr, 0, sizeof(objSockAddr));

  objSockAddr.sin_family      = AF_INET;
  objSockAddr.sin_addr.s_addr = htonl(INADDR_ANY);
  objSockAddr.sin_port        = htons(pPort);

  return bind(m_socket, (struct sockaddr*)&objSockAddr, sizeof(objSockAddr));
}
/******************************************************************************/
/* Listen                                                                     */
/******************************************************************************/
int Socket::Listen()
{
  return listen(m_socket, 1);
}
/******************************************************************************/
/* Accept                                                                     */
/******************************************************************************/
Socket* Socket::Accept()
{
  struct sockaddr_in objSockAddr;
  int                intSize     = sizeof(objSockAddr);
  Socket*            objSocket   = new Socket();

  memset(&objSockAddr, 0, intSize);

  objSocket->m_socket = accept(m_socket, (struct sockaddr*)&objSockAddr, (socklen_t *)&intSize);

  return objSocket;
}
/******************************************************************************/
/* Recv                                                                       */
/******************************************************************************/
int Socket::Recv(char* pValue, int pSize)
{
  return recv(m_socket, pValue, pSize, 0);
}
/******************************************************************************/
/* Send                                                                       */
/******************************************************************************/
int Socket::Send(const char* pValue, const int pSize)
{
  int intSendSize = 0;
  int intResult;

  while (1)
  {
    intResult = send(m_socket, pValue + intSendSize, pSize - intSendSize, 0);

    if (intResult >= 0)
    {
      intSendSize += intResult;
      if (intSendSize >= pSize) break;
    }
    else
      return intResult;
  }

  return intSendSize;
}
/******************************************************************************/
/* Shutdown                                                                   */
/******************************************************************************/
int Socket::Shutdown(int pHow)
{
  return shutdown(m_socket, pHow);
}
/******************************************************************************/
/* IsInvalidSocket                                                            */
/******************************************************************************/
bool Socket::IsInvalidSocket()
{
  return m_socket == INVALID_SOCKET;
}
/******************************************************************************/
/* GetError                                                                   */
/******************************************************************************/
int Socket::GetError()
{
  return errno;
}
/******************************************************************************/
/* GetSocket                                                                  */
/******************************************************************************/
SOCKET Socket::GetSocket()
{
  return m_socket;
}
/******************************************************************************/
/* Select                                                                     */
/******************************************************************************/
int Socket::Select(int nfds, fd_set* readfds, fd_set* writefds, fd_set* exceptfds, struct timeval* timeout)
{
  return select(nfds, readfds, writefds, exceptfds, timeout);
}
