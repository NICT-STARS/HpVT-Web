#pragma once
#include <pthread.h>
#include "Socket.h"
/******************************************************************************/
/* SocketConnecter                                                            */
/* Inoue Computer Service                                                     */
/******************************************************************************/
class SocketConnecter
{
public:
          SocketConnecter();
         ~SocketConnecter();
  int     Open           (const int pPort, int pCpu);
  int     Close          ();
  void    ReOpen         ();
  Socket* GetSocket      ();
  bool    GetStatus      ();

private:
  Socket*         m_socket;
  int             m_port;
  pthread_t       m_handle;
  pthread_cond_t  m_condition;
  pthread_mutex_t m_mutex;
  bool            m_start;
  bool            m_status;

  static void* Execute(void* pThis);
};
