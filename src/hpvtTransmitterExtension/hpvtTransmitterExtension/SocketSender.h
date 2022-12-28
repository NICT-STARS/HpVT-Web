#pragma once
#include <deque>
#include "SocketConnecter.h"
#include "SSCClientManager.h"
/******************************************************************************/
/* SocketSender                                                               */
/* Inoue Computer Service                                                     */
/******************************************************************************/
class SocketSender
{
public:
      SocketSender();
     ~SocketSender();
  int Start       (SocketConnecter* pSocketConnecter, int pCpu);
  int Stop        ();
  int AddTask     (const char* pTask);

private:
  SocketConnecter*        m_socketConnecter;
  std::deque<const char*> m_tasks;
  pthread_t               m_handle;
  pthread_mutex_t         m_mutex;
  bool                    m_start;

  bool IsAdaptiveControl     (SSCClientManager* pSSCClientManager, int& pFramerate, int& pBitrate);
  int  GetParametersStandard (cJSON* pParam);
  int  GetParametersSDICamera(cJSON* pParam);

  static void* Execute(void* pThis);
};
