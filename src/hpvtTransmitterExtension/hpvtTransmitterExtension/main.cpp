#include "CISVCC/include/cisvcc.h"
#include "HpVT/HPVTControl.h"
#include "HpVT/HPVTFileRecord.h"
#include "Logger.h"
#include "Config.h"
#include "SocketSender.h"
#include "main.h"
/******************************************************************************/
/* hpvtTransmitterExtension                                                   */
/* Inoue Computer Service                                                     */
/******************************************************************************/
pthread_t   g_MainThread;
Logger      g_Logger;
Config      g_Config;
static bool g_Signal = false;
/******************************************************************************/
/* HPVTLoadPlugin                                                             */
/******************************************************************************/
void HPVTLoadPlugin(void)
{
  HPVTInitialize();
  pthread_create(&g_MainThread, NULL, hpvtTransmitterExtension, NULL);
}
/******************************************************************************/
/* HPVTUnloadPlugin                                                           */
/******************************************************************************/
void HPVTUnloadPlugin(void)
{
  g_Signal = true;
  pthread_join(g_MainThread, NULL);

  g_Logger.Write("Stop\n");

  HPVTDestroy();
}
/******************************************************************************/
/* hpvtTransmitterExtension (Entry Point)                                     */
/******************************************************************************/
void* hpvtTransmitterExtension(void *arg)
{
/*-----* load config *--------------------------------------------------------*/
  int   intResult;
  char  strFile[1024];
  char* strPtr;

  g_Logger.Write("Start Version: 2.3.0 -- Built at %s %s --\n", __DATE__, __TIME__);

  if ((intResult = HPVTGetConfigFilePath(strFile)) == HPVT_ERROR_NONE)
  {
    if ((strPtr = strrchr(strFile, '/')) != NULL)
    {
      strcpy(strPtr + 1, "hpvtTransmitterExtension.conf");

      if (g_Config.Load(strFile) == 0)
      {
        g_Logger.Write("Load Config ... <<%s>>\n", strFile);
        g_Logger.Write("+ Port                    = %d\n", g_Config.Port                );
        g_Logger.Write("+ Create Image Interval   = %d\n", g_Config.CreateImageInterval );
        g_Logger.Write("+ Create Image Quality    = %d\n", g_Config.CreateImageQuality  );
        g_Logger.Write("+ Create Image Time Stamp = %d\n", g_Config.CreateImageTimeStamp);
        g_Logger.Write("+ Save   Video Mode       = %d\n", g_Config.SaveVideo           );
        g_Logger.Write("+ Date Format             = %s\n", g_Config.DateFormat          );
        g_Logger.Write("+ Date Color              = %s\n", g_Config.DateColor           );
        g_Logger.Write("+ Date Font               = %d\n", g_Config.DateFont            );
        g_Logger.Write("+ Date Base Size          = %d\n", g_Config.DateBaseSize        );
        g_Logger.Write("+ SSC Url                 = %s\n", g_Config.SSCUrl              );
        g_Logger.Write("+ SSC Id                  = %s\n", g_Config.SSCId               );
        g_Logger.Write("+ SSC Receiver            = %s\n", g_Config.SSCReceiver         );
      }
      else
      {
        g_Logger.Write("Config File Open Error [%s]\n", strFile);
        return NULL;
      }
    }
    else
    {
      g_Logger.Write("Config File Path Error\n");
      return NULL;
    }
  }
  else
  {
    g_Logger.Write("HPVTGetConfigFilePath Error %d\n", intResult);
    return NULL;
  }

  intResult = HPVTGetCameraType();

       if (intResult == HPVT_CAMERA_TYPE_STANDARD) strcpy(g_Config.CameraType, "standard" );
  else if (intResult == HPVT_CAMERA_TYPE_IPCAMERA) strcpy(g_Config.CameraType, "ipcamera" );
  else                                             strcpy(g_Config.CameraType, "sdicamera");

  g_Logger.Write("Camera Type is \"%s\"\n", g_Config.CameraType);
/*-----* variable *-----------------------------------------------------------*/
  SSCClientManager* objSSCClientManager = new SSCClientManager();
  SocketConnecter*  objSocketConnecter  = new SocketConnecter();
  SocketSender*     objSocketSender     = new SocketSender();
  int               intCpuCount         = 0;
  int               intMaxCpu           = sysconf(_SC_NPROCESSORS_CONF);
  int               intMaxFd            = 0;
  fd_set            objFdSet, objFdSetOrigin;
  struct timeval    objWaitTime;
  char              strBuffer[256];
  int               intBufferSize       = sizeof(strBuffer);
  char*             strRecvData         = (char*)malloc(0);
  int               intRecvSize         = 0;
  char*             strSearch;
  bool              flgSuccess;
/*-----* socket open *--------------------------------------------------------*/
  objSocketConnecter->Open (g_Config.Port     , intCpuCount); intCpuCount = intCpuCount < intMaxCpu - 1 ? intCpuCount + 1 : 0;
  objSocketSender   ->Start(objSocketConnecter, intCpuCount);

  while (1)
  {
    if (g_Signal) break;

    if (objSocketConnecter->GetStatus())
    {
      FD_ZERO(&objFdSetOrigin);
      FD_SET (objSocketConnecter->GetSocket()->GetSocket(), &objFdSetOrigin);
      memcpy (&objFdSet, &objFdSetOrigin, sizeof(fd_set));

      intMaxFd            = objSocketConnecter->GetSocket()->GetSocket() + 1;
      objWaitTime.tv_sec  = 3;
      objWaitTime.tv_usec = 0;
      intResult           = objSocketConnecter->GetSocket()->Select(intMaxFd, &objFdSet, NULL, NULL, &objWaitTime);
/*-----* recv *---------------------------------------------------------------*/
      if (intResult > 0 && FD_ISSET(objSocketConnecter->GetSocket()->GetSocket(), &objFdSet))
      {
        intResult = objSocketConnecter->GetSocket()->Recv(strBuffer, intBufferSize);

        if (intResult > 0)
        {
          strRecvData = (char*)realloc(strRecvData, intRecvSize + intResult + 1);
          memcpy(strRecvData + intRecvSize, strBuffer, intResult);
          intRecvSize += intResult;
          memset(strRecvData + intRecvSize, '\0', 1);

          while ((strSearch = strstr(strRecvData, "\n")) != NULL)
          {
            memset(strSearch, '\0', 1);
            g_Logger.Write("Recv [%s]\n", strRecvData);

            if (objSSCClientManager->GetDeviceId  () == 0
            || (objSSCClientManager->GetProfileId () == 0 && strcmp("ipcamera", g_Config.CameraType ) == 0)
            || (objSSCClientManager->GetReceiverId() == 0 && strlen(            g_Config.SSCReceiver) >  0))
            {
              objSSCClientManager->Close();
              objSSCClientManager->Open (g_Config.SSCUrl, g_Config.SSCId, g_Config.SSCReceiver);
              g_Logger.Write("SSCClient ReOpen(DeviceId:%d, ProfileId:%d, ReceiverId:%d)\n", objSSCClientManager->GetDeviceId(), objSSCClientManager->GetProfileId(), objSSCClientManager->GetReceiverId());
            }
/*-----* change parameters *--------------------------------------------------*/
            if (strncmp("setStatus", strRecvData, 9) == 0)
            {
              char*  strJson = (char*)malloc(strlen(strRecvData));
              cJSON* objJson;

              strcpy(strJson, strRecvData + 10);
              memset(strJson + strlen(strJson) - 1, '\0', 1);
              objJson = cJSON_Parse(strJson);

              if (cJSON_IsObject(objJson))
              {
                flgSuccess = true;

                     if (strcmp("standard" , g_Config.CameraType) == 0) { if (!ChangeParametersStandard (objJson                     )) flgSuccess = false; }
                else if (strcmp("ipcamera" , g_Config.CameraType) == 0) { if (!ChangeParametersIPCamera (objJson, objSSCClientManager)) flgSuccess = false; }
                else                                                    { if (!ChangeParametersSDICamera(objJson                     )) flgSuccess = false; }
                                                                          if (!ChangeParameters         (objJson, objSSCClientManager)) flgSuccess = false;
              }
              else
                flgSuccess = false;

              objSocketSender->AddTask(flgSuccess ? "success=change_parameter" : "error=change_parameter");
              objSocketSender->AddTask("getStatus");
              cJSON_Delete(objJson);
              free        (strJson);
            }
/*-----* connect session *----------------------------------------------------*/
            else if (strcmp("select", strRecvData) == 0)
            {
              flgSuccess = true;

              if (objSSCClientManager->IsSessionConnect() != 0)
              {
                if (objSSCClientManager->ConnectSession() == 0)   g_Logger.Write("SSCClient ConnectSession\n");
                else                                            { g_Logger.Write("SSCClient ConnectSession Error(%s)\n", objSSCClientManager->GetErrorMessage()); flgSuccess = false; }
              }

              objSocketSender->AddTask(flgSuccess ? "success=open_connection" : "error=open_connection");
              objSocketSender->AddTask("getStatus");
            }
/*-----* disconnect session *-------------------------------------------------*/
            else if (strcmp("unselect", strRecvData) == 0)
            {
              flgSuccess = true;

              if (objSSCClientManager->IsSessionConnect() == 0)
              {
                if (objSSCClientManager->DisconnectSession() == 0)   g_Logger.Write("SSCClient DisconnectSession\n");
                else                                               { g_Logger.Write("SSCClient DisconnectSession Error(%s)\n", objSSCClientManager->GetErrorMessage()); flgSuccess = false; }
              }

              objSocketSender->AddTask(flgSuccess ? "success=close_connection" : "error=close_connection");
              objSocketSender->AddTask("getStatus");
            }
/*-----* send *---------------------------------------------------------------*/
            else if (strcmp("getStatus", strRecvData) == 0) objSocketSender->AddTask("getStatus");
            else if (strcmp("getImage" , strRecvData) == 0) objSocketSender->AddTask("getImage" );

            intRecvSize = intRecvSize - (strSearch - strRecvData + 1);
            if (intRecvSize > 0) memcpy(strRecvData, strSearch + 1, intRecvSize);
            strRecvData = (char*)realloc(strRecvData, intRecvSize);
            if (intRecvSize < 1) break;
          }
        }
        else
        {
          g_Logger.Write("Recv End(%d)\n", objSocketConnecter->GetSocket()->GetError());
          intRecvSize = 0;
          objSocketConnecter->ReOpen();
          sleep(1);
        }
      }
    }
    else
      sleep(1);
  }

  free(strRecvData);

  objSocketSender    ->Stop ();
  objSocketConnecter ->Close();
  objSSCClientManager->Close();

  delete objSocketSender;
  delete objSocketConnecter;
  delete objSSCClientManager;

  return NULL;
}
/******************************************************************************/
/* ChangeParameters                                                           */
/******************************************************************************/
bool ChangeParameters(cJSON* pJson, SSCClientManager* pSSCClientManager)
{
/*-----* variable *-----------------------------------------------------------*/
  int    intAdaptiveControl     , intAdaptiveControlOrigin;
  int    intFECLevel            , intFECLevelOrigin;
  int    intFeedbackInterval    , intFeedbackIntervalOrigin;
  int    intCreateImageInterval , intCreateImageIntervalOrigin;
  int    intCreateImageQuality  , intCreateImageQualityOrigin;
  int    intCreateImageTimeStamp, intCreateImageTimeStampOrigin;
  int    intSaveVideo           , intSaveVideoOrigin;
  int    intSaveVideoInterval   , intSaveVideoIntervalOrigin;
  int    intSaveVideoDuration   , intSaveVideoDurationOrigin;
  int    intResult;
  bool   flgSuccess = true;
  cJSON* objElement;
/*-----* get parameters *-----------------------------------------------------*/
  intAdaptiveControl      = intAdaptiveControlOrigin      = HPVTAdaptiveControlIsEnabled();
  intFECLevel             = intFECLevelOrigin             = HPVTVideoGetFECLevel        ();
  intFeedbackInterval     = intFeedbackIntervalOrigin     = HPVTVideoGetFeedbackInterval();
  intSaveVideoInterval    = intSaveVideoIntervalOrigin    = HPVTSSCVideoGetInterval     ();
  intSaveVideoDuration    = intSaveVideoDurationOrigin    = HPVTSSCVideoGetDuration     ();
  intSaveVideo            = intSaveVideoOrigin            = g_Config.SaveVideo;
  intCreateImageInterval  = intCreateImageIntervalOrigin  = g_Config.CreateImageInterval;
  intCreateImageQuality   = intCreateImageQualityOrigin   = g_Config.CreateImageQuality;
  intCreateImageTimeStamp = intCreateImageTimeStampOrigin = g_Config.CreateImageTimeStamp;

  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "adaptiveControl"     ); if (cJSON_IsNumber(objElement)) intAdaptiveControl      = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "fecLevel"            ); if (cJSON_IsNumber(objElement)) intFECLevel             = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "heartBeat"           ); if (cJSON_IsNumber(objElement)) intFeedbackInterval     = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "createImageInterval" ); if (cJSON_IsNumber(objElement)) intCreateImageInterval  = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "createImageQuality"  ); if (cJSON_IsNumber(objElement)) intCreateImageQuality   = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "createImageTimeStamp"); if (cJSON_IsNumber(objElement)) intCreateImageTimeStamp = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "saveVideo"           ); if (cJSON_IsNumber(objElement)) intSaveVideo            = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "saveVideoInterval"   ); if (cJSON_IsNumber(objElement)) intSaveVideoInterval    = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "saveVideoDuration"   ); if (cJSON_IsNumber(objElement)) intSaveVideoDuration    = objElement->valueint;
/*-----* change fec level *---------------------------------------------------*/
  if (intFECLevelOrigin != intFECLevel)
  {
    if ((intResult = HPVTVideoSetFECLevel(intFECLevel)) == HPVT_ERROR_NONE)
      g_Logger.Write("HPVTVideoSetFECLevel [%d -> %d]\n", intFECLevelOrigin, intFECLevel);
    else
    {
      g_Logger.Write("HPVTVideoSetFECLevel Error %d\n", intResult);
      flgSuccess = false;
    }
  }
/*-----* change adaptive control *--------------------------------------------*/
  if (intAdaptiveControlOrigin != intAdaptiveControl)
  {
    if (intAdaptiveControl == 1)
    {
      if ((intResult = HPVTAdaptiveControlEnable()) == HPVT_ERROR_NONE)
        g_Logger.Write("HPVTAdaptiveControl [Disable -> Enable]\n");
      else
      {
        g_Logger.Write("HPVTAdaptiveControlEnable Error %d\n", intResult);
        flgSuccess = false;
      }
    }
    else
    {
      if ((intResult = HPVTAdaptiveControlDisable()) == HPVT_ERROR_NONE)
        g_Logger.Write("HPVTAdaptiveControl [Enable -> Disable]\n");
      else
      {
        g_Logger.Write("HPVTAdaptiveControlDisable Error %d\n", intResult);
        flgSuccess = false;
      }
    }
  }
/*-----* change feedback interval *-------------------------------------------*/
  if (intFeedbackIntervalOrigin != intFeedbackInterval)
  {
    if ((intResult = HPVTVideoSetFeedbackInterval(intFeedbackInterval)) == HPVT_ERROR_NONE)
    {
      g_Logger.Write("HPVTVideoSetFeedbackInterval [%d -> %d]\n", intFeedbackIntervalOrigin, intFeedbackInterval);

      if (pSSCClientManager->IsSessionConnect() == 0)
      {
        if (pSSCClientManager->DisconnectSession() == 0)
        {
          g_Logger.Write("SSCClient DisconnectSession\n");
          sleep(1);

          if (pSSCClientManager->ConnectSession() == 0)   g_Logger.Write("SSCClient ConnectSession\n");
          else                                          { g_Logger.Write("SSCClient ConnectSession Error(%s)\n", pSSCClientManager->GetErrorMessage()); flgSuccess = false; }
        }
        else
        {
          g_Logger.Write("SSCClient DisconnectSession Error(%s)\n", pSSCClientManager->GetErrorMessage());
          flgSuccess = false;
        }
      }
    }
    else
    {
      g_Logger.Write("HPVTVideoSetFeedbackInterval Error %d\n", intResult);
      flgSuccess = false;
    }
  }
/*-----* change create image *------------------------------------------------*/
  if (intCreateImageIntervalOrigin != intCreateImageInterval)
  {
    if ((g_Config.CreateImageInterval = intCreateImageInterval) > 0)
      g_Logger.Write("ChangeCreateImageInterval [%d -> %d]\n", intCreateImageIntervalOrigin, intCreateImageInterval);
    else
    {
      g_Logger.Write("ChangeCreateImageInterval Error %d\n", intCreateImageInterval);
      g_Config.CreateImageInterval = intCreateImageIntervalOrigin;
      flgSuccess = false;
    }
  }

  if (intCreateImageQualityOrigin != intCreateImageQuality)
  {
    if (0 <= intCreateImageQuality && intCreateImageQuality <= 100)
    {
      g_Config.CreateImageQuality = intCreateImageQuality;
      g_Logger.Write("ChangeCreateImageQuality [%d -> %d]\n", intCreateImageQualityOrigin, intCreateImageQuality);
    }
    else
    {
      g_Logger.Write("ChangeCreateImageQuality Error %d\n", intCreateImageQuality);
      flgSuccess = false;
    }
  }

  if (intCreateImageTimeStampOrigin != intCreateImageTimeStamp)
  {
    if (0 <= intCreateImageTimeStamp && intCreateImageTimeStamp <= 1)
    {
      g_Config.CreateImageTimeStamp = intCreateImageTimeStamp;
      g_Logger.Write("ChangeCreateImageTimeStamp [%d -> %d]\n", intCreateImageTimeStampOrigin, intCreateImageTimeStamp);
    }
    else
    {
      g_Logger.Write("ChangeCreateImageTimeStamp Error %d\n", intCreateImageTimeStamp);
      flgSuccess = false;
    }
  }
/*-----* change save video *--------------------------------------------------*/
  if (intSaveVideoIntervalOrigin != intSaveVideoInterval)
  {
    if ((intResult = HPVTSSCVideoSetInterval(intSaveVideoInterval)) == HPVT_ERROR_NONE)
      g_Logger.Write("HPVTSSCVideoSetInterval [%d -> %d]\n", intSaveVideoIntervalOrigin, intSaveVideoInterval);
    else
    {
      g_Logger.Write("HPVTSSCVideoSetInterval Error %d\n", intResult);
      flgSuccess = false;
    }
  }

  if (intSaveVideoDurationOrigin != intSaveVideoDuration)
  {
    if ((intResult = HPVTSSCVideoSetDuration(intSaveVideoDuration)) == HPVT_ERROR_NONE)
      g_Logger.Write("HPVTSSCVideoSetDuration [%d -> %d]\n", intSaveVideoDurationOrigin, intSaveVideoDuration);
    else
    {
      g_Logger.Write("HPVTSSCVideoSetDuration Error %d\n", intResult);
      flgSuccess = false;
    }
  }

  if (intSaveVideoOrigin != intSaveVideo)
  {
    g_Config.SaveVideo = intSaveVideo;

    if (g_Config.SaveVideo > 0)
    {
      if (HPVTSSCVideoWritingIsEnabled() < 1)
      {
        if ((intResult = HPVTSSCVideoWritingEnable()) == HPVT_ERROR_NONE) g_Logger.Write("HPVTSSCVideoWritingEnable\n");
        else                                                              g_Logger.Write("HPVTSSCVideoWritingEnable Error %d\n", intResult);
      }
    }
    else
    {
      if (HPVTSSCVideoWritingIsEnabled() == 1)
      {
        if ((intResult = HPVTSSCVideoWritingDisable()) == HPVT_ERROR_NONE) g_Logger.Write("HPVTSSCVideoWritingDisable\n");
        else                                                               g_Logger.Write("HPVTSSCVideoWritingDisable Error %d\n", intResult);
      }
    }
  }

  return flgSuccess;
}
/******************************************************************************/
/* ChangeParametersStandard                                                   */
/******************************************************************************/
bool ChangeParametersStandard(cJSON* pJson)
{
/*-----* variable *-----------------------------------------------------------*/
  HPVT_CAMERA_PARAMETERS objHpvtCameraParameters, objHpvtCameraParametersOrigin;
  int                    intBitrate             , intBitrateOrigin;
  int                    intResult;
  bool                   flgSuccess = true;
  cJSON*                 objElement;
/*-----* get parameters *-----------------------------------------------------*/
  if ((intResult = HPVTCameraGetAllParameters(HPVT_CAMERA_ID_0, &objHpvtCameraParametersOrigin)) != HPVT_ERROR_NONE)
  {
    g_Logger.Write("HPVTCameraGetAllParameters Error %d\n", intResult);
    return false;
  }

  memcpy(&objHpvtCameraParameters, &objHpvtCameraParametersOrigin, sizeof(objHpvtCameraParameters));
  intBitrate = intBitrateOrigin = HPVTVideoEncodeGetBitrate();

  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "bps"         ); if (cJSON_IsNumber(objElement))                      intBitrate       = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "fps"         ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.framerate     = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "width"       ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.width         = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "height"      ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.height        = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "sharpness"   ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.sharpness     = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "contrast"    ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.contrast      = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "brightness"  ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.brightness    = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "saturation"  ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.saturation    = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "iso"         ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.iso           = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "exposureMode"); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.exposure_mode = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "whiteBalance"); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.awb_mode      = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "meteringMode"); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.metering_mode = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "rotation"    ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.rotation      = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "flip"        ); if (cJSON_IsNumber(objElement)) objHpvtCameraParameters.flip          = objElement->valueint;
/*-----* change framerate *---------------------------------------------------*/
  if (objHpvtCameraParametersOrigin.framerate != objHpvtCameraParameters.framerate)
  {
    if ((intResult = HPVTVideoEncodeChangeFramerate(objHpvtCameraParameters.framerate)) == HPVT_ERROR_NONE)
      g_Logger.Write("HPVTVideoEncodeChangeFramerate [%d -> %d]\n", objHpvtCameraParametersOrigin.framerate, objHpvtCameraParameters.framerate);
    else
    {
      g_Logger.Write("HPVTVideoEncodeChangeFramerate Error %d\n", intResult);
      flgSuccess = false;
    }
  }
/*-----* change bitrate *-----------------------------------------------------*/
  if (intBitrateOrigin != intBitrate)
  {
    if ((intResult = HPVTVideoEncodeChangeBitrate(intBitrate)) == HPVT_ERROR_NONE)
      g_Logger.Write("HPVTVideoEncodeChangeBitrate [%d -> %d]\n", intBitrateOrigin, intBitrate);
    else
    {
      g_Logger.Write("HPVTVideoEncodeChangeBitrate Error %d\n", intResult);
      flgSuccess = false;
    }
  }
/*-----* set all parameters *-------------------------------------------------*/
  if (objHpvtCameraParametersOrigin.width    != objHpvtCameraParameters.width
  ||  objHpvtCameraParametersOrigin.height   != objHpvtCameraParameters.height
  ||  objHpvtCameraParametersOrigin.rotation != objHpvtCameraParameters.rotation
  ||  objHpvtCameraParametersOrigin.flip     != objHpvtCameraParameters.flip)
  {
    if ((intResult = HPVTCameraCaptureDisable(HPVT_CAMERA_ID_0)) == HPVT_ERROR_NONE)
    {
      g_Logger.Write("HPVTCameraCaptureDisable\n");

      if ((intResult = HPVTCameraInactivate(HPVT_CAMERA_ID_0)) == HPVT_ERROR_NONE)
      {
        g_Logger.Write("HPVTCameraInactivate\n");

        if ((intResult = HPVTCameraSetAllParameters(HPVT_CAMERA_ID_0, &objHpvtCameraParameters)) == HPVT_ERROR_NONE)   g_Logger.Write("HPVTCameraSetAllParameters\n");
        else                                                                                                         { g_Logger.Write("HPVTCameraSetAllParameters Error %d\n", intResult); flgSuccess = false; }

        if ((intResult = HPVTCameraActivate        (HPVT_CAMERA_ID_0                          )) == HPVT_ERROR_NONE)   g_Logger.Write("HPVTCameraActivate\n");
        else                                                                                                         { g_Logger.Write("HPVTCameraActivate Error %d\n"        , intResult); flgSuccess = false; }
      }
      else
      {
        g_Logger.Write("HPVTCameraInactivate Error %d\n", intResult);
        flgSuccess = false;
      }

      if ((intResult = HPVTCameraCaptureEnable(HPVT_CAMERA_ID_0)) == HPVT_ERROR_NONE)   g_Logger.Write("HPVTCameraCaptureEnable\n");
      else                                                                            { g_Logger.Write("HPVTCameraCaptureEnable Error %d\n", intResult); flgSuccess = false; }
    }
    else
    {
      g_Logger.Write("HPVTCameraCaptureDisable Error %d\n", intResult);
      flgSuccess = false;
    }
  }
/*-----* change parameters *--------------------------------------------------*/
  else
  {
    if (objHpvtCameraParametersOrigin.framerate     != objHpvtCameraParameters.framerate    ) { if ((intResult = HPVTCameraChangeCaptureFramerate(HPVT_CAMERA_ID_0, objHpvtCameraParameters.framerate    )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeCaptureFramerate [%d -> %d]\n", objHpvtCameraParametersOrigin.framerate    , objHpvtCameraParameters.framerate    ); else { g_Logger.Write("HPVTCameraChangeCaptureFramerate Error %d\n", intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.sharpness     != objHpvtCameraParameters.sharpness    ) { if ((intResult = HPVTCameraChangeSharpness       (HPVT_CAMERA_ID_0, objHpvtCameraParameters.sharpness    )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeSharpness [%d -> %d]\n"       , objHpvtCameraParametersOrigin.sharpness    , objHpvtCameraParameters.sharpness    ); else { g_Logger.Write("HPVTCameraChangeSharpness Error %d\n"       , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.contrast      != objHpvtCameraParameters.contrast     ) { if ((intResult = HPVTCameraChangeContrast        (HPVT_CAMERA_ID_0, objHpvtCameraParameters.contrast     )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeContrast [%d -> %d]\n"        , objHpvtCameraParametersOrigin.contrast     , objHpvtCameraParameters.contrast     ); else { g_Logger.Write("HPVTCameraChangeContrast Error %d\n"        , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.brightness    != objHpvtCameraParameters.brightness   ) { if ((intResult = HPVTCameraChangeBrightness      (HPVT_CAMERA_ID_0, objHpvtCameraParameters.brightness   )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeBrightness [%d -> %d]\n"      , objHpvtCameraParametersOrigin.brightness   , objHpvtCameraParameters.brightness   ); else { g_Logger.Write("HPVTCameraChangeBrightness Error %d\n"      , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.saturation    != objHpvtCameraParameters.saturation   ) { if ((intResult = HPVTCameraChangeSaturation      (HPVT_CAMERA_ID_0, objHpvtCameraParameters.saturation   )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeSaturation [%d -> %d]\n"      , objHpvtCameraParametersOrigin.saturation   , objHpvtCameraParameters.saturation   ); else { g_Logger.Write("HPVTCameraChangeSaturation Error %d\n"      , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.iso           != objHpvtCameraParameters.iso          ) { if ((intResult = HPVTCameraChangeISO             (HPVT_CAMERA_ID_0, objHpvtCameraParameters.iso          )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeISO [%d -> %d]\n"             , objHpvtCameraParametersOrigin.iso          , objHpvtCameraParameters.iso          ); else { g_Logger.Write("HPVTCameraChangeISO Error %d\n"             , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.exposure_mode != objHpvtCameraParameters.exposure_mode) { if ((intResult = HPVTCameraChangeExposureMode    (HPVT_CAMERA_ID_0, objHpvtCameraParameters.exposure_mode)) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeExposureMode [%d -> %d]\n"    , objHpvtCameraParametersOrigin.exposure_mode, objHpvtCameraParameters.exposure_mode); else { g_Logger.Write("HPVTCameraChangeExposureMode Error %d\n"    , intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.awb_mode      != objHpvtCameraParameters.awb_mode     ) { if ((intResult = HPVTCameraChangeWhiteBalanceMode(HPVT_CAMERA_ID_0, objHpvtCameraParameters.awb_mode     )) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeWhiteBalanceMode [%d -> %d]\n", objHpvtCameraParametersOrigin.awb_mode     , objHpvtCameraParameters.awb_mode     ); else { g_Logger.Write("HPVTCameraChangeWhiteBalanceMode Error %d\n", intResult); flgSuccess = false; } }
    if (objHpvtCameraParametersOrigin.metering_mode != objHpvtCameraParameters.metering_mode) { if ((intResult = HPVTCameraChangeMeteringMode    (HPVT_CAMERA_ID_0, objHpvtCameraParameters.metering_mode)) == HPVT_ERROR_NONE) g_Logger.Write("HPVTCameraChangeMeteringMode [%d -> %d]\n"    , objHpvtCameraParametersOrigin.metering_mode, objHpvtCameraParameters.metering_mode); else { g_Logger.Write("HPVTCameraChangeMeteringMode Error %d\n"    , intResult); flgSuccess = false; } }
  }

  return flgSuccess;
}
/******************************************************************************/
/* ChangeParametersSDICamera                                                  */
/******************************************************************************/
bool ChangeParametersSDICamera(cJSON* pJson)
{
/*-----* variable *-----------------------------------------------------------*/
  int               intZoom , intZoomOrigin;
  int               intSpeed, intSpeedOrigin;
  int               intResult;
  bool              flgSuccess = true;
  struct CISVCC_ctx objCisvccCtx;
  cJSON*            objElement;

  if (CISVCC_getZoomDrive(0, &intResult, &intZoomOrigin, &intSpeedOrigin, &objCisvccCtx))
  {
    intZoom  = intZoomOrigin;
    intSpeed = intSpeedOrigin = 88;

    objElement = cJSON_GetObjectItemCaseSensitive(pJson, "zoom"); if (cJSON_IsNumber(objElement)) intZoom = objElement->valueint;

    if (intZoomOrigin != intZoom)
    {
      if (CISVCC_setZoomDrive(0, intZoom, intSpeed, &objCisvccCtx))   g_Logger.Write("CISVCC_setZoomDrive [%d -> %d]\n", intZoomOrigin, intZoom);
      else                                                          { g_Logger.Write("CISVCC_setZoomDrive Error %d\n"  , getErrno(&objCisvccCtx)); flgSuccess = false; }
    }
  }
  else
  {
    g_Logger.Write("CISVCC_getZoomDrive Error %d\n", getErrno(&objCisvccCtx));
    flgSuccess = false;
  }

  return flgSuccess;
}
/******************************************************************************/
/* ChangeParametersIPCamera                                                   */
/******************************************************************************/
bool ChangeParametersIPCamera(cJSON* pJson, SSCClientManager* pSSCClientManager)
{
/*-----* variable *-----------------------------------------------------------*/
  int   intWidth          , intWidthOrigin           = 0;
  int   intHeight         , intHeightOrigin          = 0;
  int   intFrameRateLimit , intFrameRateLimitOrigin  = 0;
  int   intBitrateLimit   , intBitrateLimitOrigin    = 0;
  float intQuality        , intQualityOrigin         = 0;
  float intBrightness     , intBrightnessOrigin      = 0;
  float intContrast       , intContrastOrigin        = 0;
  float intColorSaturation, intColorSaturationOrigin = 0;
  float intSharpness      , intSharpnessOrigin       = 0;
  char  strFocusMode[16]  , strFocusModeOrigin[16];
  float intFocusSpeed     , intFocusSpeedOrigin      = 0;
  float intFocusNearLimit , intFocusNearLimitOrigin  = 0;
  float intFocusFarLimit  , intFocusFarLimitOrigin   = 0;
  float intPanLeft        , intPanRight;
  float intTiltUp         , intTiltDown;
  float intZoomIn         , intZoomOut;
  int   intPtzTime;
  int   intReboot;

  cJSON*   objHpvtCameraParameters = cJSON_CreateObject();
  cJSON*   objElement;

  bool     flgSuccess = true;

  memset(strFocusMode      , 0, sizeof(strFocusMode      ));
  memset(strFocusModeOrigin, 0, sizeof(strFocusModeOrigin));
/*-----* get parameters *-----------------------------------------------------*/
  if (pSSCClientManager->GetParameters(objHpvtCameraParameters) != 0)
  {
    g_Logger.Write("SSCClient GetParameters Error(%s)\n", pSSCClientManager->GetErrorMessage());
    cJSON_Delete(objHpvtCameraParameters);
    return false;
  }

  cJSON* objConfiguration = cJSON_GetObjectItemCaseSensitive(objHpvtCameraParameters, "Configuration");

  if (cJSON_IsObject(objConfiguration))
  {
    cJSON* objWidth          = cJSON_GetObjectItemCaseSensitive(objConfiguration, "width"         );
    cJSON* objHeight         = cJSON_GetObjectItemCaseSensitive(objConfiguration, "height"        );
    cJSON* objFps            = cJSON_GetObjectItemCaseSensitive(objConfiguration, "fps"           );
    cJSON* objBps            = cJSON_GetObjectItemCaseSensitive(objConfiguration, "bps"           );
    cJSON* objQuality        = cJSON_GetObjectItemCaseSensitive(objConfiguration, "quality"       );
    cJSON* objBrightness     = cJSON_GetObjectItemCaseSensitive(objConfiguration, "brightness"    );
    cJSON* objContrast       = cJSON_GetObjectItemCaseSensitive(objConfiguration, "contrast"      );
    cJSON* objSaturation     = cJSON_GetObjectItemCaseSensitive(objConfiguration, "saturation"    );
    cJSON* objSharpness      = cJSON_GetObjectItemCaseSensitive(objConfiguration, "sharpness"     );
    cJSON* objFocusMode      = cJSON_GetObjectItemCaseSensitive(objConfiguration, "focusMode"     );
    cJSON* objFocusSpeed     = cJSON_GetObjectItemCaseSensitive(objConfiguration, "focusSpeed"    );
    cJSON* objFocusNearLimit = cJSON_GetObjectItemCaseSensitive(objConfiguration, "focusNearLimit");
    cJSON* objFocusFarLimit  = cJSON_GetObjectItemCaseSensitive(objConfiguration, "focusFarLimit" );

    if (cJSON_IsNumber(objWidth         ))        intWidthOrigin           = objWidth         ->valueint;
    if (cJSON_IsNumber(objHeight        ))        intHeightOrigin          = objHeight        ->valueint;
    if (cJSON_IsNumber(objFps           ))        intFrameRateLimitOrigin  = objFps           ->valueint;
    if (cJSON_IsNumber(objBps           ))        intBitrateLimitOrigin    = objBps           ->valueint;
    if (cJSON_IsNumber(objQuality       ))        intQualityOrigin         = objQuality       ->valuedouble;
    if (cJSON_IsNumber(objBrightness    ))        intBrightnessOrigin      = objBrightness    ->valuedouble;
    if (cJSON_IsNumber(objContrast      ))        intContrastOrigin        = objContrast      ->valuedouble;
    if (cJSON_IsNumber(objSaturation    ))        intColorSaturationOrigin = objSaturation    ->valuedouble;
    if (cJSON_IsNumber(objSharpness     ))        intSharpnessOrigin       = objSharpness     ->valuedouble;
    if (cJSON_IsString(objFocusMode     )) strcpy(strFocusModeOrigin       , objFocusMode     ->valuestring);
    if (cJSON_IsNumber(objFocusSpeed    ))        intFocusSpeedOrigin      = objFocusSpeed    ->valuedouble;
    if (cJSON_IsNumber(objFocusNearLimit))        intFocusNearLimitOrigin  = objFocusNearLimit->valuedouble;
    if (cJSON_IsNumber(objFocusFarLimit ))        intFocusFarLimitOrigin   = objFocusFarLimit ->valuedouble;
  }

  cJSON_Delete(objHpvtCameraParameters);

         intWidth           = intWidthOrigin;
         intHeight          = intHeightOrigin;
         intFrameRateLimit  = intFrameRateLimitOrigin;
         intBitrateLimit    = intBitrateLimitOrigin;
         intQuality         = intQualityOrigin;
         intBrightness      = intBrightnessOrigin;
         intContrast        = intContrastOrigin;
         intColorSaturation = intColorSaturationOrigin;
         intSharpness       = intSharpnessOrigin;
  strcpy(strFocusMode       , strFocusModeOrigin);
         intFocusSpeed      = intFocusSpeedOrigin;
         intFocusNearLimit  = intFocusNearLimitOrigin;
         intFocusFarLimit   = intFocusFarLimitOrigin;
         intPanLeft         = intPanRight = 0;
         intTiltUp          = intTiltDown = 0;
         intZoomIn          = intZoomOut  = 0;
         intPtzTime                       = 0;
         intReboot                        = 0;

  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "width"         ); if (cJSON_IsNumber(objElement))        intWidth           = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "height"        ); if (cJSON_IsNumber(objElement))        intHeight          = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "fps"           ); if (cJSON_IsNumber(objElement))        intFrameRateLimit  = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "bps"           ); if (cJSON_IsNumber(objElement))        intBitrateLimit    = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "quality"       ); if (cJSON_IsNumber(objElement))        intQuality         = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "brightness"    ); if (cJSON_IsNumber(objElement))        intBrightness      = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "contrast"      ); if (cJSON_IsNumber(objElement))        intContrast        = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "saturation"    ); if (cJSON_IsNumber(objElement))        intColorSaturation = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "sharpness"     ); if (cJSON_IsNumber(objElement))        intSharpness       = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "focusMode"     ); if (cJSON_IsString(objElement)) strcpy(strFocusMode       , objElement->valuestring);
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "focusSpeed"    ); if (cJSON_IsNumber(objElement))        intFocusSpeed      = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "focusNearLimit"); if (cJSON_IsNumber(objElement))        intFocusNearLimit  = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "focusFarLimit" ); if (cJSON_IsNumber(objElement))        intFocusFarLimit   = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "panLeft"       ); if (cJSON_IsNumber(objElement))        intPanLeft         = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "panRight"      ); if (cJSON_IsNumber(objElement))        intPanRight        = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "tiltUp"        ); if (cJSON_IsNumber(objElement))        intTiltUp          = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "tiltDown"      ); if (cJSON_IsNumber(objElement))        intTiltDown        = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "zoomIn"        ); if (cJSON_IsNumber(objElement))        intZoomIn          = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "zoomOut"       ); if (cJSON_IsNumber(objElement))        intZoomOut         = objElement->valuedouble;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "ptzTime"       ); if (cJSON_IsNumber(objElement))        intPtzTime         = objElement->valueint;
  objElement = cJSON_GetObjectItemCaseSensitive(pJson, "reboot"        ); if (cJSON_IsNumber(objElement))        intReboot          = objElement->valueint;
/*-----* exec encoder task query *--------------------------------------------*/
  if (intWidth          != intWidthOrigin
  ||  intHeight         != intHeightOrigin
  ||  intFrameRateLimit != intFrameRateLimitOrigin
  ||  intBitrateLimit   != intBitrateLimitOrigin
  ||  intQuality        != intQualityOrigin)
  {
    if (pSSCClientManager->GetEncoderTaskQuery() != NULL)
    {
                                                                                 pSSCClientManager->GetEncoderTaskQuery()->unsetTask        ();
      if (intWidth          != intWidthOrigin || intHeight != intHeightOrigin) { pSSCClientManager->GetEncoderTaskQuery()->setResolution    (intWidth, intHeight); g_Logger.Write("SSCClient setResolution [%dx%d -> %dx%d]\n", intWidthOrigin         , intHeightOrigin, intWidth, intHeight); }
      if (intFrameRateLimit != intFrameRateLimitOrigin                       ) { pSSCClientManager->GetEncoderTaskQuery()->setFramerateLimit(intFrameRateLimit  ); g_Logger.Write("SSCClient setFramerateLimit [%d -> %d]\n"  , intFrameRateLimitOrigin, intFrameRateLimit                   ); }
      if (intBitrateLimit   != intBitrateLimitOrigin                         ) { pSSCClientManager->GetEncoderTaskQuery()->setBitrateLimit  (intBitrateLimit    ); g_Logger.Write("SSCClient setBitrateLimit [%d -> %d]\n"    , intBitrateLimitOrigin  , intBitrateLimit                     ); }
      if (intQuality        != intQualityOrigin                              ) { pSSCClientManager->GetEncoderTaskQuery()->setQuality       (intQuality         ); g_Logger.Write("SSCClient setQuality [%f -> %f]\n"         , intQualityOrigin       , intQuality                          ); }

      if (HPVTVideoRTSPStreamIsEnabled()) HPVTVideoRTSPStreamDisable();

      if (pSSCClientManager->ExecEncoderTaskQuery() != 0)
      {
        g_Logger.Write("SSCClient ExecEncoderTaskQuery Error(%s)\n", pSSCClientManager->GetErrorMessage());
        flgSuccess = false;
      }

      sleep(1);
      if (!HPVTVideoRTSPStreamIsEnabled()) HPVTVideoRTSPStreamEnable();
    }
  }
/*-----* exec imaging task query *--------------------------------------------*/
  if (       intBrightness      != intBrightnessOrigin
  ||         intContrast        != intContrastOrigin
  ||         intColorSaturation != intColorSaturationOrigin
  ||         intSharpness       != intSharpnessOrigin
  ||  strcmp(strFocusMode       ,  strFocusModeOrigin) != 0
  ||         intFocusSpeed      != intFocusSpeedOrigin
  ||         intFocusNearLimit  != intFocusNearLimitOrigin
  ||         intFocusFarLimit   != intFocusFarLimitOrigin)
  {
    if (pSSCClientManager->GetImagingTaskQuery() != NULL)
    {
                                                                   pSSCClientManager->GetImagingTaskQuery()->unsetTask           ();
      if (       intBrightness      != intBrightnessOrigin     ) { pSSCClientManager->GetImagingTaskQuery()->setBrightness       (intBrightness                      ); g_Logger.Write("SSCClient setBrightness [%f -> %f]\n"       , intBrightnessOrigin                            , intBrightness                      ); }
      if (       intContrast        != intContrastOrigin       ) { pSSCClientManager->GetImagingTaskQuery()->setContrast         (intContrast                        ); g_Logger.Write("SSCClient setContrast [%f -> %f]\n"         , intContrastOrigin                              , intContrast                        ); }
      if (       intColorSaturation != intColorSaturationOrigin) { pSSCClientManager->GetImagingTaskQuery()->setColorSaturation  (intColorSaturation                 ); g_Logger.Write("SSCClient setColorSaturation [%f -> %f]\n"  , intColorSaturationOrigin                       , intColorSaturation                 ); }
      if (       intSharpness       != intSharpnessOrigin      ) { pSSCClientManager->GetImagingTaskQuery()->setSharpness        (intSharpness                       ); g_Logger.Write("SSCClient setSharpness [%f -> %f]\n"        , intSharpnessOrigin                             , intSharpness                       ); }
      if (strcmp(strFocusMode       ,  strFocusModeOrigin) != 0) { pSSCClientManager->GetImagingTaskQuery()->setFocusMode        (strFocusMode                       ); g_Logger.Write("SSCClient setFocusMode [%s -> %s]\n"        , strFocusModeOrigin                             , strFocusMode                       ); }
      if (       intFocusSpeed      != intFocusSpeedOrigin     ) { pSSCClientManager->GetImagingTaskQuery()->setFocusDefaultSpeed(intFocusSpeed                      ); g_Logger.Write("SSCClient setFocusDefaultSpeed [%f -> %f]\n", intFocusSpeedOrigin                            , intFocusSpeed                      ); }
      if (       intFocusNearLimit  != intFocusNearLimitOrigin
      ||         intFocusFarLimit   != intFocusFarLimitOrigin  ) { pSSCClientManager->GetImagingTaskQuery()->setFocusLimit       (intFocusNearLimit, intFocusFarLimit); g_Logger.Write("SSCClient setFocusLimit [%f,%f -> %f,%f]\n" , intFocusNearLimitOrigin, intFocusFarLimitOrigin, intFocusNearLimit, intFocusFarLimit); }

      if (pSSCClientManager->ExecImagingTaskQuery() != 0)
      {
        g_Logger.Write("SSCClient ExecImagingTaskQuery Error(%s)\n", pSSCClientManager->GetErrorMessage());
        flgSuccess = false;
      }
    }
  }
/*-----* exec ptz task query *------------------------------------------------*/
  if (intPtzTime > 0
  && (intPanLeft > 0 || intPanRight > 0
  ||  intTiltUp  > 0 || intTiltDown > 0
  ||  intZoomIn  > 0 || intZoomOut  > 0))
  {
    if (pSSCClientManager->GetPtzTaskQuery() != NULL)
    {
                             pSSCClientManager->GetPtzTaskQuery()->unsetTask        ();
                             pSSCClientManager->GetPtzTaskQuery()->setContinuousTime(intPtzTime );
      if (intPanLeft  > 0) { pSSCClientManager->GetPtzTaskQuery()->setPanLeft       (intPanLeft ); g_Logger.Write("SSCClient setPanLeft [%f]\n" , intPanLeft ); }
      if (intPanRight > 0) { pSSCClientManager->GetPtzTaskQuery()->setPanRight      (intPanRight); g_Logger.Write("SSCClient setPanRight [%f]\n", intPanRight); }
      if (intTiltUp   > 0) { pSSCClientManager->GetPtzTaskQuery()->setTiltUp        (intTiltUp  ); g_Logger.Write("SSCClient setTiltUp [%f]\n"  , intTiltUp  ); }
      if (intTiltDown > 0) { pSSCClientManager->GetPtzTaskQuery()->setTiltDown      (intTiltDown); g_Logger.Write("SSCClient setTiltDown [%f]\n", intTiltDown); }
      if (intZoomIn   > 0) { pSSCClientManager->GetPtzTaskQuery()->setZoomIn        (intZoomIn  ); g_Logger.Write("SSCClient setZoomIn [%f]\n"  , intZoomIn  ); }
      if (intZoomOut  > 0) { pSSCClientManager->GetPtzTaskQuery()->setZoomout       (intZoomOut ); g_Logger.Write("SSCClient setZoomOut [%f]\n" , intZoomOut ); }

      if (pSSCClientManager->ExecPtzTaskQuery() != 0)
      {
        g_Logger.Write("SSCClient ExecPtzTaskQuery Error(%s)\n", pSSCClientManager->GetErrorMessage());
        flgSuccess = false;
      }
    }
  }
/*-----* exec system task query *---------------------------------------------*/
  if (intReboot > 0)
  {
    if (pSSCClientManager->GetSystemTaskQuery() != NULL)
    {
      pSSCClientManager->GetSystemTaskQuery()->setReboot();
      g_Logger.Write("SSCClient setReboot\n");

      if (pSSCClientManager->ExecSystemTaskQuery() != 0)
      {
        g_Logger.Write("SSCClient ExecSystemTaskQuery Error(%s)\n", pSSCClientManager->GetErrorMessage());
        flgSuccess = false;
      }
    }
  }

  return flgSuccess;
}
