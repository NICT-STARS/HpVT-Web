#pragma once
#include "cJSON/include/cJSON.h"
#include "SSCClient/include/SSCClient.h"
/******************************************************************************/
/* SSCClientManager                                                           */
/* Inoue Computer Service                                                     */
/******************************************************************************/
class SSCClientManager
{
public:
                            SSCClientManager    ();
                           ~SSCClientManager    ();
  int                       Open                (const char* pUrl, const char* pId, const char* pReceiver);
  int                       Close               ();
  int                       IsSessionConnect    ();
  int                       ConnectSession      ();
  int                       DisconnectSession   ();
  int                       GetParameters       (cJSON* pParam);
  int                       GetDeviceId         ();
  int                       GetReceiverId       ();
  int                       GetProfileId        ();
  SSCOnvifEncoderTaskQuery* GetEncoderTaskQuery ();
  SSCOnvifImagingTaskQuery* GetImagingTaskQuery ();
  SSCOnvifPtzTaskQuery*     GetPtzTaskQuery     ();
  SSCOnvifSystemTaskQuery*  GetSystemTaskQuery  ();
  int                       ExecEncoderTaskQuery();
  int                       ExecImagingTaskQuery();
  int                       ExecPtzTaskQuery    ();
  int                       ExecSystemTaskQuery ();
  char*                     GetErrorMessage     ();

private:
  SSCClient*                m_client;
  SSCOnvifEncoderTaskQuery* m_encoderTaskQuery;
  SSCOnvifImagingTaskQuery* m_imagingTaskQuery;
  SSCOnvifPtzTaskQuery*     m_ptzTaskQuery;
  SSCOnvifSystemTaskQuery*  m_systemTaskQuery;
  int                       m_deviceId;
  int                       m_receiverId;
  int                       m_profileId;
  char*                     m_errorMessage;

  int                       ExecTaskQuery  (TaskQueryBase* pTaskQuery);
  void                      SetErrorMessage(const char*    pMessage);
};
