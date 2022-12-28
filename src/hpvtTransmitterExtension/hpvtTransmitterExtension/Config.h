#pragma once
#include "cJSON/include/cJSON.h"
/******************************************************************************/
/* Config                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
struct Config
{
         Config();
        ~Config();
  int    Load  (const char* pFile);

  cJSON* ConfFile;
  cJSON* ConfigurationDefaults;
  int    Port;
  int    CreateImageInterval;
  int    CreateImageQuality;
  int    CreateImageTimeStamp;
  int    SaveVideo;
  char   CameraType[64];
  char   DateFormat[64];
  char   DateColor [64];
  int    DateFont;
  int    DateBaseSize;
  char   SSCUrl     [64];
  char   SSCId      [64];
  char   SSCReceiver[64];
};

extern Config g_Config;
