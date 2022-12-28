#include "CISVCC/include/cisvcc.h"
#include <unistd.h>
#include <sys/time.h>
#include <opencv2/opencv.hpp>
#include <vector>
#include "HpVT/HPVTControl.h"
#include "HpVT/HPVTUtility.h"
#include "HpVT/HPVTFileRecord.h"
#include "Logger.h"
#include "Config.h"
#include "SocketSender.h"
/******************************************************************************/
/* SocketSender                                                               */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
SocketSender::SocketSender() :
  m_socketConnecter(NULL),
  m_handle         (0),
  m_start          (false)
{
  m_tasks.clear();
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
SocketSender::~SocketSender()
{
}
/******************************************************************************/
/* Start                                                                      */
/******************************************************************************/
int SocketSender::Start(SocketConnecter* pSocketConnecter, int pCpu)
{
  if (m_start) return -1; else m_start = true;

  m_socketConnecter = pSocketConnecter;

  pthread_mutex_init(&m_mutex, NULL);

  if (pthread_create(&m_handle, NULL, Execute, (void*)this)) return -1;

  cpu_set_t objCpuSet;

  CPU_ZERO(&objCpuSet);
  CPU_SET (pCpu, &objCpuSet);

  if (pthread_setaffinity_np(m_handle, sizeof(cpu_set_t), &objCpuSet)) return -1; else return 0;
}
/******************************************************************************/
/* Stop                                                                       */
/******************************************************************************/
int SocketSender::Stop()
{
  if (!m_start) return -1; else m_start = false;

  pthread_join(m_handle, NULL);

  m_tasks.clear        ();
  m_tasks.shrink_to_fit();

  pthread_mutex_destroy(&m_mutex);
  return 0;
}
/******************************************************************************/
/* AddTask                                                                    */
/******************************************************************************/
int SocketSender::AddTask(const char* pTask)
{
  if (!m_start) return -1;

  pthread_mutex_lock  (&m_mutex);
  m_tasks.push_back   (pTask);
  pthread_mutex_unlock(&m_mutex);

  return 0;
}
/******************************************************************************/
/* Execute                                                                    */
/******************************************************************************/
void* SocketSender::Execute(void* pThis)
{
/*-----* variable *-----------------------------------------------------------*/
  SocketSender*          _this               = reinterpret_cast<SocketSender*>(pThis);
  SSCClientManager*      objSSCClientManager = new SSCClientManager();

  struct timeval         objTimeBefore, objTimeAfter, objTimeDiff;
  struct tm*             objTime;
  char                   strTime[64];
  int                    intYear, intMonth, intDay, intHour, intMinute, intSec;

  int                    intFramerate = 0;
  int                    intBitrate   = 0;
  HPVT_ERROR_CODE        intResult;

  cv::Mat                objImage;
  std::vector<uchar>     objImageBuffer;
  std::vector<int>       objImageParam    = std::vector<int>(2);

  int                    intTextThickness = 2;
  int                    intTextBaseLine  = 0;
  int                    intTextRed;
  int                    intTextGreen;
  int                    intTextBlue;
  cv::Size               objTextSize;
  cv::Point              objTextPoint;
/*-----* initialize *---------------------------------------------------------*/
  objSSCClientManager->Open             (g_Config.SSCUrl    , g_Config.SSCId, g_Config.SSCReceiver);
  _this              ->IsAdaptiveControl(objSSCClientManager, intFramerate  , intBitrate          );

  sscanf(g_Config.DateColor, "%d,%d,%d", &intTextRed, &intTextGreen, &intTextBlue);

  timerclear  (&objTimeBefore);
  timerclear  (&objTimeAfter );
  gettimeofday(&objTimeBefore, NULL);
/*-----* check task *---------------------------------------------------------*/
  while (1)
  {
    if (!_this->m_start) break;

    gettimeofday(&objTimeAfter, NULL);
    timersub    (&objTimeAfter, &objTimeBefore, &objTimeDiff);

    if (objTimeDiff.tv_sec >= g_Config.CreateImageInterval)
    {
      _this->AddTask("getImage");
      gettimeofday(&objTimeBefore, NULL);
    }

    if (HPVTAdaptiveControlIsEnabled() == 1)
    {
      if (_this->IsAdaptiveControl(objSSCClientManager, intFramerate, intBitrate)) _this->AddTask("getStatus");
    }

    if (!_this->m_socketConnecter->GetStatus()) _this->m_tasks.clear();

    if (!_this->m_tasks.empty())
    {
      pthread_mutex_lock(&_this->m_mutex);
      std::deque<const char*>::iterator objTask = _this->m_tasks.begin();
      pthread_mutex_unlock(&_this->m_mutex);

      if (objSSCClientManager->GetDeviceId  () == 0
      || (objSSCClientManager->GetProfileId () == 0 && strcmp("ipcamera", g_Config.CameraType ) == 0)
      || (objSSCClientManager->GetReceiverId() == 0 && strlen(            g_Config.SSCReceiver) >  0))
      {
        objSSCClientManager->Close();
        objSSCClientManager->Open (g_Config.SSCUrl, g_Config.SSCId, g_Config.SSCReceiver);
        g_Logger.Write("SSCClient ReOpen(DeviceId:%d, ProfileId:%d, ReceiverId:%d)\n", objSSCClientManager->GetDeviceId(), objSSCClientManager->GetProfileId(), objSSCClientManager->GetReceiverId());
      }
/*-----* send status *--------------------------------------------------------*/
      if (strcmp("getStatus", *objTask) == 0)
      {
        cJSON* objHpvtCameraParameters = cJSON_CreateObject();

             if (strcmp("ipcamera", g_Config.CameraType) == 0) { if ((intResult = objSSCClientManager->GetParameters         (objHpvtCameraParameters)) != 0) g_Logger.Write("SSCClient GetParameters Error(%s)\n", objSSCClientManager->GetErrorMessage()); }
        else if (strcmp("standard", g_Config.CameraType) == 0) { if ((intResult = _this              ->GetParametersStandard (objHpvtCameraParameters)) != 0) g_Logger.Write("SocketSender GetParametersStandard Error\n"                                 ); }
        else                                                   { if ((intResult = _this              ->GetParametersSDICamera(objHpvtCameraParameters)) != 0) g_Logger.Write("SocketSender GetParametersSDICamera Error\n"                                ); }

        if (intResult == 0)
        {
          if (cJSON_IsObject(g_Config.ConfigurationDefaults)) cJSON_AddItemToObject(objHpvtCameraParameters, "ConfigurationDefaults", cJSON_Parse(cJSON_PrintUnformatted(g_Config.ConfigurationDefaults)));

          cJSON* objConfiguration = cJSON_GetObjectItemCaseSensitive(objHpvtCameraParameters, "Configuration");

          if (cJSON_IsObject(objConfiguration))
          {
                 if (g_Config.SaveVideo >  0 && HPVTSSCVideoWritingIsEnabled() <  1) g_Config.SaveVideo = 0;
            else if (g_Config.SaveVideo == 0 && HPVTSSCVideoWritingIsEnabled() == 1) g_Config.SaveVideo = 1;

            cJSON_AddNumberToObject(objConfiguration, "adaptiveControl"     , HPVTAdaptiveControlIsEnabled());
            cJSON_AddNumberToObject(objConfiguration, "fecLevel"            , HPVTVideoGetFECLevel        ());
            cJSON_AddNumberToObject(objConfiguration, "heartBeat"           , HPVTVideoGetFeedbackInterval());
            cJSON_AddNumberToObject(objConfiguration, "saveVideoInterval"   , HPVTSSCVideoGetInterval     ());
            cJSON_AddNumberToObject(objConfiguration, "saveVideoDuration"   , HPVTSSCVideoGetDuration     ());
            cJSON_AddNumberToObject(objConfiguration, "saveVideo"           , g_Config.SaveVideo            );
            cJSON_AddNumberToObject(objConfiguration, "createImageInterval" , g_Config.CreateImageInterval  );
            cJSON_AddNumberToObject(objConfiguration, "createImageQuality"  , g_Config.CreateImageQuality   );
            cJSON_AddNumberToObject(objConfiguration, "createImageTimeStamp", g_Config.CreateImageTimeStamp );
            cJSON_AddStringToObject(objConfiguration, "cameraType"          , g_Config.CameraType           );
            cJSON_AddNumberToObject(objConfiguration, "connect"             , objSSCClientManager->IsSessionConnect() == 0 ? 1 : 0);

            if (_this->m_socketConnecter->GetStatus())
            {
              _this->m_socketConnecter->GetSocket()->Send("HpVT.status("                                 ,                                                      12);
              _this->m_socketConnecter->GetSocket()->Send(cJSON_PrintUnformatted(objHpvtCameraParameters), strlen(cJSON_PrintUnformatted(objHpvtCameraParameters)));
              _this->m_socketConnecter->GetSocket()->Send(")HpVT.end\n"                                  ,                                                      10);
              g_Logger.Write("Send [HpVT.status(%s)HpVT.end]\n", cJSON_PrintUnformatted(objHpvtCameraParameters));
            }
          }
          else
            g_Logger.Write("SocketSender Parameters Error(Configuration Not Found)\n");
        }

        cJSON_Delete(objHpvtCameraParameters);
      }
/*-----* send image *---------------------------------------------------------*/
      else if (strcmp("getImage", *objTask) == 0)
      {
        cJSON* objHpvtCameraParameters = cJSON_CreateObject();

             if (strcmp("ipcamera", g_Config.CameraType) == 0) { if ((intResult = objSSCClientManager->GetParameters         (objHpvtCameraParameters)) != 0) g_Logger.Write("SSCClient GetParameters Error(%s)\n", objSSCClientManager->GetErrorMessage()); }
        else if (strcmp("standard", g_Config.CameraType) == 0) { if ((intResult = _this              ->GetParametersStandard (objHpvtCameraParameters)) != 0) g_Logger.Write("SocketSender GetParametersStandard Error\n"                                 ); }
        else                                                   { if ((intResult = _this              ->GetParametersSDICamera(objHpvtCameraParameters)) != 0) g_Logger.Write("SocketSender GetParametersSDICamera Error\n"                                ); }

        if (intResult == 0)
        {
          cJSON* objConfiguration = cJSON_GetObjectItemCaseSensitive(objHpvtCameraParameters, "Configuration");

          if (cJSON_IsObject(objConfiguration))
          {
            cJSON* objWidth  = cJSON_GetObjectItemCaseSensitive(objConfiguration, "width" );
            cJSON* objHeight = cJSON_GetObjectItemCaseSensitive(objConfiguration, "height");
            int    intWidth  = 0;
            int    intHeight = 0;

            if (cJSON_IsNumber(objWidth )) intWidth  = objWidth ->valueint;
            if (cJSON_IsNumber(objHeight)) intHeight = objHeight->valueint;

            if ((intResult = HPVTCreateCVImageFromVideo(intWidth, intHeight, &objImage)) == HPVT_ERROR_NONE)
            {
              objTime   = localtime(&objTimeAfter.tv_sec);
              intYear   = objTime->tm_year + 1900;
              intMonth  = objTime->tm_mon  + 1;
              intDay    = objTime->tm_mday;
              intHour   = objTime->tm_hour;
              intMinute = objTime->tm_min;
              intSec    = objTime->tm_sec;

              if (g_Config.CreateImageTimeStamp == 1)
              {
                sprintf(strTime, g_Config.DateFormat, intYear, intMonth, intDay, " ", intHour, intMinute, intSec);

                objTextSize  = cv::getTextSize(strTime, g_Config.DateFont, (double)objImage.cols / (double)g_Config.DateBaseSize, intTextThickness, &intTextBaseLine);
                objTextPoint = cv::Point      (objImage.cols - objTextSize.width - 10, objImage.rows - objTextSize.height);

                cv::putText(objImage, strTime, objTextPoint, g_Config.DateFont, (double)objImage.cols / (double)g_Config.DateBaseSize, cv::Scalar(intTextBlue, intTextGreen, intTextRed), intTextThickness, CV_AA);
              }

              objImageParam[0] = CV_IMWRITE_JPEG_QUALITY;
              objImageParam[1] = g_Config.CreateImageQuality;

              imencode(".jpg", objImage, objImageBuffer, objImageParam);
              sprintf(strTime, "%04d%02d%02d%02d%02d%02d", intYear, intMonth, intDay, intHour, intMinute, intSec);

              if (_this->m_socketConnecter->GetStatus())
              {
                _this->m_socketConnecter->GetSocket()->Send("HpVT.image("                 , 11);
                _this->m_socketConnecter->GetSocket()->Send(strTime                       , 14);
                _this->m_socketConnecter->GetSocket()->Send((char*)&objImageBuffer.front(), objImageBuffer.size());
                _this->m_socketConnecter->GetSocket()->Send(")HpVT.end\n"                 , 10);
                g_Logger.Write("Send [HpVT.image(date=%s,size=%d)HpVT.end]\n", strTime, objImageBuffer.size());
              }
            }
            else
              g_Logger.Write("HPVTCreateCVImageFromVideo Error %d(%dx%d)\n", intResult, intWidth, intHeight);

            objImageBuffer.clear();
            objImageBuffer.shrink_to_fit();
            objImage      .release();
          }
          else
            g_Logger.Write("SocketSender Parameters Error(Configuration Not Found)\n");
        }

        cJSON_Delete(objHpvtCameraParameters);
      }
/*-----* send result *--------------------------------------------------------*/
      else if (strncmp("success", *objTask, 7) == 0 || strncmp("error", *objTask, 5) == 0)
      {
        if (_this->m_socketConnecter->GetStatus())
        {
          _this->m_socketConnecter->GetSocket()->Send("HpVT.result(", 12);
          _this->m_socketConnecter->GetSocket()->Send(*objTask      , strlen(*objTask));
          _this->m_socketConnecter->GetSocket()->Send(")HpVT.end\n" , 10);
          g_Logger.Write("Send [HpVT.result(%s)HpVT.end]\n", *objTask);
        }
      }

      pthread_mutex_lock(&_this->m_mutex);
      _this->m_tasks.erase(_this->m_tasks.begin());
      pthread_mutex_unlock(&_this->m_mutex);
    }

    sleep(1);
  }

  objSSCClientManager->Close();
  delete objSSCClientManager;

  return 0;
}
/******************************************************************************/
/* IsAdaptiveControl                                                          */
/******************************************************************************/
bool SocketSender::IsAdaptiveControl(SSCClientManager* pSSCClientManager, int& pFramerate, int& pBitrate)
{
  int  intFramerate = pFramerate;
  int  intBitrate   = pBitrate;
  bool flgResult;
/*-----* standard *-----------------------------------------------------------*/
  if (strcmp("standard", g_Config.CameraType) == 0)
  {
    intFramerate = HPVTVideoEncodeGetFramerate();
    intBitrate   = HPVTVideoEncodeGetBitrate  ();
  }
/*-----* ipcamera *-----------------------------------------------------------*/
  else if (strcmp("ipcamera", g_Config.CameraType) == 0)
  {
    cJSON* objHpvtCameraParameters = cJSON_CreateObject();

    if (pSSCClientManager->GetParameters(objHpvtCameraParameters) == 0)
    {
      cJSON* objConfiguration = cJSON_GetObjectItemCaseSensitive(objHpvtCameraParameters, "Configuration");

      if (cJSON_IsObject(objConfiguration))
      {
        cJSON* objFps = cJSON_GetObjectItemCaseSensitive(objConfiguration, "fps");
        cJSON* objBps = cJSON_GetObjectItemCaseSensitive(objConfiguration, "bps");

        if (cJSON_IsNumber(objFps)) intFramerate = objFps->valueint;
        if (cJSON_IsNumber(objBps)) intBitrate   = objBps->valueint;
      }
    }
    else
      g_Logger.Write("SSCClient GetParameters Error(%s)\n", pSSCClientManager->GetErrorMessage());

    cJSON_Delete(objHpvtCameraParameters);
  }
/*-----* sdicamera *----------------------------------------------------------*/
  else
  {
    int               intFormat;
    struct CISVCC_ctx objCisvccCtx;

    if (CISVCC_getVideoFormat(&intFormat, &objCisvccCtx))
    {
           if (intFormat == VIDEOFORMAT_1080p60fpsA) intFramerate = 60;
      else if (intFormat == VIDEOFORMAT_1080p59fpsA) intFramerate = 59;
      else if (intFormat == VIDEOFORMAT_1080p50fpsA) intFramerate = 50;
      else if (intFormat == VIDEOFORMAT_1080p60fpsB) intFramerate = 60;
      else if (intFormat == VIDEOFORMAT_1080p59fpsB) intFramerate = 59;
      else if (intFormat == VIDEOFORMAT_1080p50fpsB) intFramerate = 50;
      else if (intFormat == VIDEOFORMAT_1080i60fps ) intFramerate = 60;
      else if (intFormat == VIDEOFORMAT_1080i59fps ) intFramerate = 59;
      else if (intFormat == VIDEOFORMAT_1080i50fps ) intFramerate = 50;
      else if (intFormat == VIDEOFORMAT_1080p30fps ) intFramerate = 30;
      else if (intFormat == VIDEOFORMAT_1080p29fps ) intFramerate = 29;
      else if (intFormat == VIDEOFORMAT_1080p25fps ) intFramerate = 25;
      else if (intFormat == VIDEOFORMAT_1080p24fps ) intFramerate = 24;
      else if (intFormat == VIDEOFORMAT_1080p23fps ) intFramerate = 23;
      else if (intFormat == VIDEOFORMAT_720p60fps  ) intFramerate = 60;
      else if (intFormat == VIDEOFORMAT_720p59fps  ) intFramerate = 59;
      else if (intFormat == VIDEOFORMAT_720p50fps  ) intFramerate = 50;
    }
    else
      g_Logger.Write("CISVCC_getVideoFormat Error %d\n", getErrno(&objCisvccCtx));
  }

  flgResult  = pFramerate != intFramerate || pBitrate != intBitrate;
  pFramerate = intFramerate;
  pBitrate   = intBitrate;

  return flgResult;
}
/******************************************************************************/
/* GetParametersStandard                                                      */
/******************************************************************************/
int SocketSender::GetParametersStandard(cJSON* pParam)
{
  HPVT_CAMERA_PARAMETERS objHpvtCameraParameters;
  HPVT_ERROR_CODE        intResult;
  cJSON*                 objConfiguration = cJSON_CreateObject();

  cJSON_AddItemToObject(pParam, "Configuration", objConfiguration);

  if ((intResult = HPVTCameraGetAllParameters(HPVT_CAMERA_ID_0, &objHpvtCameraParameters)) == HPVT_ERROR_NONE)
  {
    cJSON_AddNumberToObject(objConfiguration, "bps"         , HPVTVideoEncodeGetBitrate  ()        );
    cJSON_AddNumberToObject(objConfiguration, "fps"         , HPVTVideoEncodeGetFramerate()        );
    cJSON_AddNumberToObject(objConfiguration, "width"       , objHpvtCameraParameters.width        );
    cJSON_AddNumberToObject(objConfiguration, "height"      , objHpvtCameraParameters.height       );
    cJSON_AddNumberToObject(objConfiguration, "sharpness"   , objHpvtCameraParameters.sharpness    );
    cJSON_AddNumberToObject(objConfiguration, "contrast"    , objHpvtCameraParameters.contrast     );
    cJSON_AddNumberToObject(objConfiguration, "brightness"  , objHpvtCameraParameters.brightness   );
    cJSON_AddNumberToObject(objConfiguration, "saturation"  , objHpvtCameraParameters.saturation   );
    cJSON_AddNumberToObject(objConfiguration, "iso"         , objHpvtCameraParameters.iso          );
    cJSON_AddNumberToObject(objConfiguration, "exposureMode", objHpvtCameraParameters.exposure_mode);
    cJSON_AddNumberToObject(objConfiguration, "whiteBalance", objHpvtCameraParameters.awb_mode     );
    cJSON_AddNumberToObject(objConfiguration, "meteringMode", objHpvtCameraParameters.metering_mode);
    cJSON_AddNumberToObject(objConfiguration, "rotation"    , objHpvtCameraParameters.rotation     );
    cJSON_AddNumberToObject(objConfiguration, "flip"        , objHpvtCameraParameters.flip         );

    return 0;
  }
  else
  {
    g_Logger.Write("HPVTCameraGetAllParameters Error %d\n", intResult);
    return -1;
  }
}
/******************************************************************************/
/* GetParametersSDICamera                                                     */
/******************************************************************************/
int SocketSender::GetParametersSDICamera(cJSON* pParam)
{
  int               intFormat;
  int               intZoom;
  int               intSpeed;
  int               intResult;
  struct CISVCC_ctx objCisvccCtx;
  cJSON*            objConfiguration = cJSON_CreateObject();

  cJSON_AddItemToObject(pParam, "Configuration", objConfiguration);

  if (CISVCC_getVideoFormat(&intFormat, &objCisvccCtx))
  {
    struct _setVideoFormat
    {
      static void exec(cJSON* pConfiguration, int pHeight, int pFps)
      {
        cJSON_AddNumberToObject(pConfiguration, "width" , pHeight / 9 * 16);
        cJSON_AddNumberToObject(pConfiguration, "height", pHeight         );
        cJSON_AddNumberToObject(pConfiguration, "fps"   , pFps            );
      }
    };
         if (intFormat == VIDEOFORMAT_1080p60fpsA) _setVideoFormat::exec(objConfiguration, 1080, 60);
    else if (intFormat == VIDEOFORMAT_1080p59fpsA) _setVideoFormat::exec(objConfiguration, 1080, 59);
    else if (intFormat == VIDEOFORMAT_1080p50fpsA) _setVideoFormat::exec(objConfiguration, 1080, 50);
    else if (intFormat == VIDEOFORMAT_1080p60fpsB) _setVideoFormat::exec(objConfiguration, 1080, 60);
    else if (intFormat == VIDEOFORMAT_1080p59fpsB) _setVideoFormat::exec(objConfiguration, 1080, 59);
    else if (intFormat == VIDEOFORMAT_1080p50fpsB) _setVideoFormat::exec(objConfiguration, 1080, 50);
    else if (intFormat == VIDEOFORMAT_1080i60fps ) _setVideoFormat::exec(objConfiguration, 1080, 60);
    else if (intFormat == VIDEOFORMAT_1080i59fps ) _setVideoFormat::exec(objConfiguration, 1080, 59);
    else if (intFormat == VIDEOFORMAT_1080i50fps ) _setVideoFormat::exec(objConfiguration, 1080, 50);
    else if (intFormat == VIDEOFORMAT_1080p30fps ) _setVideoFormat::exec(objConfiguration, 1080, 30);
    else if (intFormat == VIDEOFORMAT_1080p29fps ) _setVideoFormat::exec(objConfiguration, 1080, 29);
    else if (intFormat == VIDEOFORMAT_1080p25fps ) _setVideoFormat::exec(objConfiguration, 1080, 25);
    else if (intFormat == VIDEOFORMAT_1080p24fps ) _setVideoFormat::exec(objConfiguration, 1080, 24);
    else if (intFormat == VIDEOFORMAT_1080p23fps ) _setVideoFormat::exec(objConfiguration, 1080, 23);
    else if (intFormat == VIDEOFORMAT_720p60fps  ) _setVideoFormat::exec(objConfiguration,  720, 60);
    else if (intFormat == VIDEOFORMAT_720p59fps  ) _setVideoFormat::exec(objConfiguration,  720, 59);
    else if (intFormat == VIDEOFORMAT_720p50fps  ) _setVideoFormat::exec(objConfiguration,  720, 50);
  }
  else
  {
    g_Logger.Write("CISVCC_getVideoFormat Error %d\n", getErrno(&objCisvccCtx));
    return -1;
  }

  if (CISVCC_getZoomDrive(0, &intResult, &intZoom, &intSpeed, &objCisvccCtx))
  {
    cJSON_AddNumberToObject(objConfiguration, "zoom", intZoom);
  }
  else
  {
    g_Logger.Write("CISVCC_getZoomDrive Error %d\n", getErrno(&objCisvccCtx));
  }

  return 0;
}
