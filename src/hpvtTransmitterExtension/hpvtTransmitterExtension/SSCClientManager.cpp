#include <string.h>
#include <unistd.h>
#include "SSCClientManager.h"
/******************************************************************************/
/* SSCClientManager                                                           */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
SSCClientManager::SSCClientManager() :
  m_client          (NULL),
  m_encoderTaskQuery(NULL),
  m_imagingTaskQuery(NULL),
  m_ptzTaskQuery    (NULL),
  m_systemTaskQuery (NULL),
  m_deviceId        (0),
  m_receiverId      (0),
  m_profileId       (0),
  m_errorMessage    (NULL)
{
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
SSCClientManager::~SSCClientManager()
{
  Close();
}
/******************************************************************************/
/* Open                                                                       */
/******************************************************************************/
int SSCClientManager::Open(const char* pUrl, const char* pId, const char* pReceiver)
{
/*-----* initialize *---------------------------------------------------------*/
  if (pUrl      == NULL) { SetErrorMessage("URL is NULL"     ); return -1; }
  if (pId       == NULL) { SetErrorMessage("Id is NULL"      ); return -1; }
  if (pReceiver == NULL) { SetErrorMessage("Receiver is NULL"); return -1; }
  if (m_client  != NULL) { SetErrorMessage("Already Open"    ); return -1; }

  m_client = new SSCClient(pUrl);

  SSCDeviceListTaskQuery* objQuery    =                         m_client->createDeviceListTaskQuery();
  SSCDeviceListResponse*  objResponse = (SSCDeviceListResponse*)objQuery->exec                     ();
  SSCDeviceInfo*          objInfo;
  int                     intResult;

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }
/*-----* get device id *------------------------------------------------------*/
  else
  {
    for (int i01 = 0; i01 < objResponse->getDeviceInfoCount(); i01++)
    {
      objInfo = objResponse->getDeviceInfoByIndex(i01);

      if (strcmp(objInfo->getUdId().c_str(), pId) == 0)
      {
        m_deviceId = objInfo->getDeviceId();
/*-----* get profile id *-----------------------------------------------------*/
        SSCCameraProfileListTaskQuery* objQuery2    =                                m_client ->createCameraProfileListTaskQuery(m_deviceId);
        SSCCameraProfileListResponse*  objResponse2 = (SSCCameraProfileListResponse*)objQuery2->exec                            ();
        SSCCameraProfileInfo*          objInfo2;

        if (objResponse2->isError())
        {
          SetErrorMessage(objResponse2->getErrorMessage().c_str());
          intResult = -1;
        }
        else
        {
          for (int i02 = 0; i02 < objResponse2->getCameraProfileInfoCount(); i02++)
          {
            objInfo2 = objResponse2->getCameraProfileInfoByIndex(i02);

            if (objInfo2->getStreamId() == 0)
            {
              m_profileId = objInfo2->getCameraProfileId();
              break;
            }
          }
        }

        delete objResponse2;
        delete objQuery2;
      }
/*-----* get receiver id *----------------------------------------------------*/
      else if (strcmp(objInfo->getUdId().c_str(), pReceiver) == 0)
      {
        m_receiverId = objInfo->getDeviceId();
      }

      if (m_deviceId != 0 && m_receiverId != 0) break;
    }
/*-----* create task query *--------------------------------------------------*/
    if (m_deviceId != 0 && m_profileId != 0)
    {
      m_encoderTaskQuery = m_client->createOnvifEncoderTaskQuery(m_deviceId, m_profileId);
      m_imagingTaskQuery = m_client->createOnvifImagingTaskQuery(m_deviceId, m_profileId);
      m_ptzTaskQuery     = m_client->createOnvifPtzTaskQuery    (m_deviceId, m_profileId);
      m_systemTaskQuery  = m_client->createOnvifSystemTaskQuery (m_deviceId, m_profileId);
    }
/*-----* result *-------------------------------------------------------------*/
    if (m_deviceId == 0)
    {
      SetErrorMessage("Device Id Not Found");
      intResult = -1;
    }
    else if (m_profileId == 0)
    {
      SetErrorMessage("Profile Id Not Found");
      intResult = -1;
    }
    else if (m_receiverId == 0 && strlen(pReceiver) > 0)
    {
      SetErrorMessage("Receiver Id Not Found");
      intResult = -1;
    }
    else
      intResult = 0;
  }

  delete objResponse;
  delete objQuery;
  return intResult;
}
/******************************************************************************/
/* Close                                                                      */
/******************************************************************************/
int SSCClientManager::Close()
{
  if (m_client           != NULL) { delete m_client;           m_client           = NULL; }
  if (m_encoderTaskQuery != NULL) { delete m_encoderTaskQuery; m_encoderTaskQuery = NULL; }
  if (m_imagingTaskQuery != NULL) { delete m_imagingTaskQuery; m_imagingTaskQuery = NULL; }
  if (m_ptzTaskQuery     != NULL) { delete m_ptzTaskQuery;     m_ptzTaskQuery     = NULL; }
  if (m_systemTaskQuery  != NULL) { delete m_systemTaskQuery;  m_systemTaskQuery  = NULL; }
  if (m_errorMessage     != NULL) { free  (m_errorMessage);    m_errorMessage     = NULL; }

  m_deviceId   = 0;
  m_receiverId = 0;
  m_profileId  = 0;

  return 0;
}
/******************************************************************************/
/* IsSessionConnect                                                           */
/******************************************************************************/
int SSCClientManager::IsSessionConnect()
{
  if (m_client     == NULL) { SetErrorMessage("Not Open"             ); return -1; }
  if (m_deviceId   == 0   ) { SetErrorMessage("Device Id Not Found"  ); return -1; }
  if (m_receiverId == 0   ) { SetErrorMessage("Receiver Id Not Found"); return -1; }

  SSCSessionListTaskQuery* objQuery    =                          m_client->createSessionListTaskQuery();
  SSCSessionListResponse*  objResponse = (SSCSessionListResponse*)objQuery->exec                      ();
  SSCSessionInfo*          objInfo;
  int                      intResult;

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }
  else
  {
    for (int i01 = 0; i01 < objResponse->getSessionInfoCount(); i01++)
    {
      objInfo = objResponse->getSessionInfoByIndex(i01);

      if ((objInfo->getServerId() == m_deviceId   && objInfo->getClientId() == m_receiverId)
      ||  (objInfo->getServerId() == m_receiverId && objInfo->getClientId() == m_deviceId  ))
      {
        intResult = 0;
        break;
      }
      else
      {
        SetErrorMessage("Session Not Found");
        intResult = -1;
      }
    }
  }

  delete objResponse;
  delete objQuery;

  return intResult;
}
/******************************************************************************/
/* ConnectSession                                                             */
/******************************************************************************/
int SSCClientManager::ConnectSession()
{
  if (m_client     == NULL) { SetErrorMessage("Not Open"             ); return -1; }
  if (m_deviceId   == 0   ) { SetErrorMessage("Device Id Not Found"  ); return -1; }
  if (m_receiverId == 0   ) { SetErrorMessage("Receiver Id Not Found"); return -1; }

  SSCSessionConnectTaskQuery* objQuery    =                             m_client->createSessionConnectTaskQuery(m_receiverId, m_deviceId);
  SSCSessionConnectResponse*  objResponse = (SSCSessionConnectResponse*)objQuery->exec                         ();
  int                         intResult   = 0;

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }

  delete objResponse;
  delete objQuery;
  return intResult;
}
/******************************************************************************/
/* DisconnectSession                                                          */
/******************************************************************************/
int SSCClientManager::DisconnectSession()
{
  if (m_client     == NULL) { SetErrorMessage("Not Open"             ); return -1; }
  if (m_deviceId   == 0   ) { SetErrorMessage("Device Id Not Found"  ); return -1; }
  if (m_receiverId == 0   ) { SetErrorMessage("Receiver Id Not Found"); return -1; }

  SSCSessionListTaskQuery* objQuery    =                          m_client->createSessionListTaskQuery();
  SSCSessionListResponse*  objResponse = (SSCSessionListResponse*)objQuery->exec                      ();
  SSCSessionInfo*          objInfo;
  int                      intResult   = 0;

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }
  else
  {
    for (int i01 = 0; i01 < objResponse->getSessionInfoCount(); i01++)
    {
      objInfo = objResponse->getSessionInfoByIndex(i01);

      if ((objInfo->getServerId() == m_deviceId   && objInfo->getClientId() == m_receiverId)
      ||  (objInfo->getServerId() == m_receiverId && objInfo->getClientId() == m_deviceId  ))
      {
        SSCSessionDisconnectTaskQuery* objQuery2    =                                m_client ->createSessionDisconnectTaskQuery(objInfo->getSessionId());
        SSCSessionDisconnectResponse*  objResponse2 = (SSCSessionDisconnectResponse*)objQuery2->exec                            ();

        if (objResponse2->isError())
        {
          SetErrorMessage(objResponse2->getErrorMessage().c_str());
          intResult = -1;
        }
        else
          intResult = 0;

        delete objResponse2;
        delete objQuery2;
        break;
      }
      else
      {
        SetErrorMessage("Session Not Found");
        intResult = -1;
      }
    }
  }

  delete objResponse;
  delete objQuery;
  return intResult;
}
/******************************************************************************/
/* GetParameters                                                              */
/******************************************************************************/
int SSCClientManager::GetParameters(cJSON* pParam)
{
  if (m_client    == NULL    ) { SetErrorMessage("Not Open"            ); return -1; }
  if (m_deviceId  == 0       ) { SetErrorMessage("Device Id Not Found" ); return -1; }
  if (m_profileId == 0       ) { SetErrorMessage("Profile Id Not Found"); return -1; }
  if (!cJSON_IsObject(pParam)) { SetErrorMessage("Param Not JSON"      ); return -1; }

  SSCCameraProfileTaskQuery* objQuery    = m_client->createCameraProfileTaskQuery(m_deviceId, m_profileId);
  SSCCameraProfileResponse*  objResponse;
  PROFILE_FILTER             objFilter;
  int                        intResult   = 0;

  objFilter   = PROFILE_Imaging_GetImagingSettings | PROFILE_Imaging_GetOptions | PROFILE_Media_GetVideoEncoderConfiguration | PROFILE_Media_GetVideoEncoderConfigurationOptions | PROFILE_PTZ_GetConfiguration | PROFILE_PTZ_GetConfigurationOptions;
  objQuery->setFilter(objFilter);
  objResponse = (SSCCameraProfileResponse*)objQuery->exec();

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }
/*-----* initialize *---------------------------------------------------------*/
  else
  {
    cJSON* objResultConfigurationOptions = cJSON_CreateObject();
    cJSON* objResultConfiguration        = cJSON_CreateObject();
    cJSON* objProfileInfo                = cJSON_Parse       (objResponse->getProfileInfoText());

    cJSON_AddItemToObject(pParam, "ConfigurationOptions", objResultConfigurationOptions);
    cJSON_AddItemToObject(pParam, "Configuration"       , objResultConfiguration);

    if (cJSON_IsObject(objProfileInfo))
    {
/*-----* video encoder configuration options *--------------------------------*/
      cJSON* objVideoEncoderConfigurationOptions = cJSON_GetObjectItemCaseSensitive(objProfileInfo, "Media_GetVideoEncoderConfigurationOptions");

      if (cJSON_IsObject(objVideoEncoderConfigurationOptions))
      {
        cJSON* objH264 = cJSON_GetObjectItemCaseSensitive(objVideoEncoderConfigurationOptions, "H264");

        if (cJSON_IsObject(objH264))
        {
          cJSON* objResolutionsAvailable = cJSON_GetObjectItemCaseSensitive(objH264, "ResolutionsAvailable");
          cJSON* objFrameRateRange       = cJSON_GetObjectItemCaseSensitive(objH264, "FrameRateRange"      );

          if (cJSON_IsArray (objResolutionsAvailable)) cJSON_AddItemToObject(objResultConfigurationOptions, "ResolutionsAvailable", cJSON_Parse(cJSON_PrintUnformatted(objResolutionsAvailable)));
          if (cJSON_IsObject(objFrameRateRange      )) cJSON_AddItemToObject(objResultConfigurationOptions, "FrameRateRange"      , cJSON_Parse(cJSON_PrintUnformatted(objFrameRateRange      )));
        }

        cJSON* objQualityRange = cJSON_GetObjectItemCaseSensitive(objVideoEncoderConfigurationOptions, "QualityRange");
        if (cJSON_IsObject(objQualityRange)) cJSON_AddItemToObject(objResultConfigurationOptions, "QualityRange", cJSON_Parse(cJSON_PrintUnformatted(objQualityRange)));
      }
/*-----* video encoder configuration *----------------------------------------*/
      cJSON* objVideoEncoderConfiguration = cJSON_GetObjectItemCaseSensitive(objProfileInfo, "Media_GetVideoEncoderConfiguration");

      if (cJSON_IsObject(objVideoEncoderConfiguration))
      {
        cJSON* objResolution = cJSON_GetObjectItemCaseSensitive(objVideoEncoderConfiguration, "Resolution");

        if (cJSON_IsObject(objResolution))
        {
          cJSON* objWidth  = cJSON_GetObjectItemCaseSensitive(objResolution, "Width" );
          cJSON* objHeight = cJSON_GetObjectItemCaseSensitive(objResolution, "Height");

          if (cJSON_IsNumber(objWidth )) cJSON_AddNumberToObject(objResultConfiguration, "width" , objWidth ->valueint);
          if (cJSON_IsNumber(objHeight)) cJSON_AddNumberToObject(objResultConfiguration, "height", objHeight->valueint);
        }

        cJSON* objRateControl = cJSON_GetObjectItemCaseSensitive(objVideoEncoderConfiguration, "RateControl");

        if (cJSON_IsObject(objRateControl))
        {
          cJSON* objFrameRateLimit = cJSON_GetObjectItemCaseSensitive(objRateControl, "FrameRateLimit");
          cJSON* objBitrateLimit   = cJSON_GetObjectItemCaseSensitive(objRateControl, "BitrateLimit"  );

          if (cJSON_IsNumber(objFrameRateLimit)) cJSON_AddNumberToObject(objResultConfiguration, "fps", objFrameRateLimit->valueint);
          if (cJSON_IsNumber(objBitrateLimit  )) cJSON_AddNumberToObject(objResultConfiguration, "bps", objBitrateLimit  ->valueint);
        }

        cJSON* objQuality = cJSON_GetObjectItemCaseSensitive(objVideoEncoderConfiguration, "Quality");
        if (cJSON_IsNumber(objQuality)) cJSON_AddNumberToObject(objResultConfiguration, "quality", objQuality->valuedouble);
      }
/*-----* imaging options *----------------------------------------------------*/
      cJSON* objImagingOptions = cJSON_GetObjectItemCaseSensitive(objProfileInfo, "Imaging_GetOptions");

      if (cJSON_IsObject(objImagingOptions))
      {
        cJSON* objBrightness      = cJSON_GetObjectItemCaseSensitive(objImagingOptions, "Brightness"     );
        cJSON* objContrast        = cJSON_GetObjectItemCaseSensitive(objImagingOptions, "Contrast"       );
        cJSON* objColorSaturation = cJSON_GetObjectItemCaseSensitive(objImagingOptions, "ColorSaturation");
        cJSON* objSharpness       = cJSON_GetObjectItemCaseSensitive(objImagingOptions, "Sharpness"      );
        cJSON* objFocus           = cJSON_GetObjectItemCaseSensitive(objImagingOptions, "Focus"          );

        if (cJSON_IsObject(objBrightness     )) cJSON_AddItemToObject(objResultConfigurationOptions, "Brightness"     , cJSON_Parse(cJSON_PrintUnformatted(objBrightness     )));
        if (cJSON_IsObject(objContrast       )) cJSON_AddItemToObject(objResultConfigurationOptions, "Contrast"       , cJSON_Parse(cJSON_PrintUnformatted(objContrast       )));
        if (cJSON_IsObject(objColorSaturation)) cJSON_AddItemToObject(objResultConfigurationOptions, "ColorSaturation", cJSON_Parse(cJSON_PrintUnformatted(objColorSaturation)));
        if (cJSON_IsObject(objSharpness      )) cJSON_AddItemToObject(objResultConfigurationOptions, "Sharpness"      , cJSON_Parse(cJSON_PrintUnformatted(objSharpness      )));
        if (cJSON_IsObject(objFocus          )) cJSON_AddItemToObject(objResultConfigurationOptions, "Focus"          , cJSON_Parse(cJSON_PrintUnformatted(objFocus          )));
      }
/*-----* imaging settings *---------------------------------------------------*/
      cJSON* objImagingSettings = cJSON_GetObjectItemCaseSensitive(objProfileInfo, "Imaging_GetImagingSettings");

      if (cJSON_IsObject(objImagingSettings))
      {
        cJSON* objBrightness      = cJSON_GetObjectItemCaseSensitive(objImagingSettings, "Brightness"     );
        cJSON* objContrast        = cJSON_GetObjectItemCaseSensitive(objImagingSettings, "Contrast"       );
        cJSON* objColorSaturation = cJSON_GetObjectItemCaseSensitive(objImagingSettings, "ColorSaturation");
        cJSON* objSharpness       = cJSON_GetObjectItemCaseSensitive(objImagingSettings, "Sharpness"      );
        cJSON* objFocus           = cJSON_GetObjectItemCaseSensitive(objImagingSettings, "Focus"          );

        if (cJSON_IsNumber(objBrightness     )) cJSON_AddNumberToObject(objResultConfiguration, "brightness", objBrightness     ->valuedouble);
        if (cJSON_IsNumber(objContrast       )) cJSON_AddNumberToObject(objResultConfiguration, "contrast"  , objContrast       ->valuedouble);
        if (cJSON_IsNumber(objColorSaturation)) cJSON_AddNumberToObject(objResultConfiguration, "saturation", objColorSaturation->valuedouble);
        if (cJSON_IsNumber(objSharpness      )) cJSON_AddNumberToObject(objResultConfiguration, "sharpness" , objSharpness      ->valuedouble);

        if (cJSON_IsObject(objFocus))
        {
          cJSON* objFocusMode      = cJSON_GetObjectItemCaseSensitive(objFocus, "AutoFocusMode");
          cJSON* objFocusSpeed     = cJSON_GetObjectItemCaseSensitive(objFocus, "DefaultSpeed" );
          cJSON* objFocusNearLimit = cJSON_GetObjectItemCaseSensitive(objFocus, "NearLimit"    );
          cJSON* objFocusFarLimit  = cJSON_GetObjectItemCaseSensitive(objFocus, "FarLimit"     );

          if (cJSON_IsString(objFocusMode     )) cJSON_AddStringToObject(objResultConfiguration, "focusMode"     , objFocusMode     ->valuestring);
          if (cJSON_IsNumber(objFocusSpeed    )) cJSON_AddNumberToObject(objResultConfiguration, "focusSpeed"    , objFocusSpeed    ->valuedouble);
          if (cJSON_IsNumber(objFocusNearLimit)) cJSON_AddNumberToObject(objResultConfiguration, "focusNearLimit", objFocusNearLimit->valuedouble);
          if (cJSON_IsNumber(objFocusFarLimit )) cJSON_AddNumberToObject(objResultConfiguration, "focusFarLimit" , objFocusFarLimit ->valuedouble);
        }
      }
/*-----* ptz configuration options *------------------------------------------*/
      cJSON* objPtzConfigurationOptions = cJSON_GetObjectItemCaseSensitive(objProfileInfo, "PTZ_GetConfigurationOptions");

      if (cJSON_IsObject(objPtzConfigurationOptions))
      {
        cJSON* objSpaces = cJSON_GetObjectItemCaseSensitive(objPtzConfigurationOptions, "Spaces");

        if (cJSON_IsObject(objSpaces))
        {
          cJSON* objPanTiltSpeedSpace = cJSON_GetObjectItemCaseSensitive(objSpaces, "PanTiltSpeedSpace");
          cJSON* objZoomSpeedSpace    = cJSON_GetObjectItemCaseSensitive(objSpaces, "ZoomSpeedSpace"   );

          if (cJSON_IsArray(objPanTiltSpeedSpace) && cJSON_GetArraySize(objPanTiltSpeedSpace) > 0) cJSON_AddItemToObject(objResultConfigurationOptions, "PanTiltSpeedSpace", cJSON_Parse(cJSON_PrintUnformatted(cJSON_GetArrayItem(objPanTiltSpeedSpace, 0))));
          if (cJSON_IsArray(objZoomSpeedSpace   ) && cJSON_GetArraySize(objZoomSpeedSpace   ) > 0) cJSON_AddItemToObject(objResultConfigurationOptions, "ZoomSpeedSpace"   , cJSON_Parse(cJSON_PrintUnformatted(cJSON_GetArrayItem(objZoomSpeedSpace   , 0))));
        }
      }
    }
    else
    {
      SetErrorMessage(cJSON_GetErrorPtr());
      intResult = -1;
    }

    cJSON_Delete(objProfileInfo);
  }

  delete objResponse;
  delete objQuery;
  return intResult;
}
/******************************************************************************/
/* GetXXXXXId                                                                 */
/******************************************************************************/
int SSCClientManager::GetDeviceId  () { return m_deviceId;   }
int SSCClientManager::GetReceiverId() { return m_receiverId; }
int SSCClientManager::GetProfileId () { return m_profileId;  }
/******************************************************************************/
/* GetXXXTaskQuery                                                            */
/******************************************************************************/
SSCOnvifEncoderTaskQuery* SSCClientManager::GetEncoderTaskQuery() { return m_encoderTaskQuery; }
SSCOnvifImagingTaskQuery* SSCClientManager::GetImagingTaskQuery() { return m_imagingTaskQuery; }
SSCOnvifPtzTaskQuery*     SSCClientManager::GetPtzTaskQuery    () { return m_ptzTaskQuery;     }
SSCOnvifSystemTaskQuery*  SSCClientManager::GetSystemTaskQuery () { return m_systemTaskQuery;  }
/******************************************************************************/
/* ExecXXXTaskQuery                                                           */
/******************************************************************************/
int SSCClientManager::ExecEncoderTaskQuery() { return ExecTaskQuery(m_encoderTaskQuery); }
int SSCClientManager::ExecImagingTaskQuery() { return ExecTaskQuery(m_imagingTaskQuery); }
int SSCClientManager::ExecPtzTaskQuery    () { return ExecTaskQuery(m_ptzTaskQuery    ); }
int SSCClientManager::ExecSystemTaskQuery () { return ExecTaskQuery(m_systemTaskQuery ); }
/******************************************************************************/
/* ExecTaskQuery                                                              */
/******************************************************************************/
int SSCClientManager::ExecTaskQuery(TaskQueryBase* pTaskQuery)
{
  if (m_client   == NULL) { SetErrorMessage("Not Open"            ); return -1; }
  if (m_deviceId == 0   ) { SetErrorMessage("Device Id Not Found" ); return -1; }
  if (pTaskQuery == NULL) { SetErrorMessage("TaskQuery Not Create"); return -1; }

  SSCCommandResponse* objResponse = (SSCCommandResponse*)pTaskQuery->exec();
  int                 intResult   = 0;

  if (objResponse->isError())
  {
    SetErrorMessage(objResponse->getErrorMessage().c_str());
    intResult = -1;
  }
  else
  {
    SSCCommandResultTaskQuery* objQuery2    = m_client->createCommandResultTaskQuery(m_deviceId, objResponse->getCommandId());
    SSCCommandResultResponse*  objResponse2;

    while (true)
    {
      objResponse2 = (SSCCommandResultResponse*)objQuery2->exec();

      if (objResponse2->isCompleted()) break;
      if (objResponse2->isError    ())
      {
        SetErrorMessage(objResponse2->getErrorMessage().c_str());
        intResult = -1;
        break;
      }

      delete objResponse2;
      sleep(1);
    }

    delete objResponse2;
    delete objQuery2;
  }

  delete objResponse;
  return intResult;
}
/******************************************************************************/
/* SetErrorMessage                                                            */
/******************************************************************************/
void SSCClientManager::SetErrorMessage(const char* pMessage)
{
  if (m_errorMessage != NULL) free(m_errorMessage);

  m_errorMessage = (char*)malloc(strlen(pMessage) + 1);
  strcpy(m_errorMessage, pMessage);
}
/******************************************************************************/
/* GetErrorMessage                                                            */
/******************************************************************************/
char* SSCClientManager::GetErrorMessage()
{
  return m_errorMessage;
}
