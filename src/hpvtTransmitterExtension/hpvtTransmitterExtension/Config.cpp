#include <fstream>
#include <string.h>
#include "Config.h"
/******************************************************************************/
/* Config                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
Config::Config() :
  ConfFile             (NULL),
  ConfigurationDefaults(NULL),
  Port                 (0),
  CreateImageInterval  (0),
  CreateImageQuality   (0),
  CreateImageTimeStamp (0),
  SaveVideo            (0),
  DateFont             (0),
  DateBaseSize         (0)
{
  memset(CameraType , 0, sizeof(CameraType ));
  memset(DateFormat , 0, sizeof(DateFormat ));
  memset(DateColor  , 0, sizeof(DateColor  ));
  memset(SSCUrl     , 0, sizeof(SSCUrl     ));
  memset(SSCId      , 0, sizeof(SSCId      ));
  memset(SSCReceiver, 0, sizeof(SSCReceiver));
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
Config::~Config()
{
  if (ConfFile              != NULL) cJSON_Delete(ConfFile             );
  if (ConfigurationDefaults != NULL) cJSON_Delete(ConfigurationDefaults);
}
/******************************************************************************/
/* Load                                                                       */
/******************************************************************************/
int Config::Load(const char* pFile)
{
/*-----* variable *-----------------------------------------------------------*/
  std::ifstream objStream(pFile);
  int           intBegin;
  int           intEnd;
  int           intSize;
  char*         strBuffer;
/*-----* read file *----------------------------------------------------------*/
  if (objStream.fail()) return -1;

  intBegin = static_cast<int>(objStream.tellg());

  objStream.seekg(0, objStream.end);

  intEnd    = static_cast<int>(objStream.tellg());
  intSize   = intEnd - intBegin;
  strBuffer = (char*)malloc(intSize + 1);

  memset(strBuffer + intSize, '\0', 1);

  objStream.clear();
  objStream.seekg(0        , objStream.beg);
  objStream.read (strBuffer, intSize      );
/*-----* parse json *---------------------------------------------------------*/
  if (ConfFile              != NULL) cJSON_Delete(ConfFile             );
  if (ConfigurationDefaults != NULL) cJSON_Delete(ConfigurationDefaults);

  ConfFile = cJSON_Parse(strBuffer);
  free(strBuffer);

  if (cJSON_IsObject(ConfFile))
  {
    cJSON* objPort                  = cJSON_GetObjectItemCaseSensitive(ConfFile, "Port"                 );
    cJSON* objConfigurationDefaults = cJSON_GetObjectItemCaseSensitive(ConfFile, "ConfigurationDefaults");
    cJSON* objCreateImage           = cJSON_GetObjectItemCaseSensitive(ConfFile, "CreateImage"          );
    cJSON* objSaveVideo             = cJSON_GetObjectItemCaseSensitive(ConfFile, "SaveVideo"            );
    cJSON* objDateInfo              = cJSON_GetObjectItemCaseSensitive(ConfFile, "DateInfo"             );
    cJSON* objSSC                   = cJSON_GetObjectItemCaseSensitive(ConfFile, "SSC"                  );

    if (cJSON_IsNumber(objPort                 )) Port                  = objPort     ->valueint;
    if (cJSON_IsNumber(objSaveVideo            )) SaveVideo             = objSaveVideo->valueint;
    if (cJSON_IsObject(objConfigurationDefaults)) ConfigurationDefaults = cJSON_Parse(cJSON_PrintUnformatted(objConfigurationDefaults));

    if (cJSON_IsObject(objCreateImage))
    {
      cJSON* objInterval  = cJSON_GetObjectItemCaseSensitive(objCreateImage, "Interval" );
      cJSON* objQuality   = cJSON_GetObjectItemCaseSensitive(objCreateImage, "Quality"  );
      cJSON* objTimeStamp = cJSON_GetObjectItemCaseSensitive(objCreateImage, "TimeStamp");

      if (cJSON_IsNumber(objInterval )) CreateImageInterval  = objInterval ->valueint;
      if (cJSON_IsNumber(objQuality  )) CreateImageQuality   = objQuality  ->valueint;
      if (cJSON_IsNumber(objTimeStamp)) CreateImageTimeStamp = objTimeStamp->valueint;
    }

    if (cJSON_IsObject(objDateInfo))
    {
      cJSON* objFormat   = cJSON_GetObjectItemCaseSensitive(objDateInfo, "Format"  );
      cJSON* objColor    = cJSON_GetObjectItemCaseSensitive(objDateInfo, "Color"   );
      cJSON* objFont     = cJSON_GetObjectItemCaseSensitive(objDateInfo, "Font"    );
      cJSON* objBaseSize = cJSON_GetObjectItemCaseSensitive(objDateInfo, "BaseSize");

      if (cJSON_IsString(objFormat  ) && strlen(objFormat->valuestring) < sizeof(DateFormat)) strcpy(DateFormat   , objFormat  ->valuestring);
      if (cJSON_IsString(objColor   ) && strlen(objColor ->valuestring) < sizeof(DateColor )) strcpy(DateColor    , objColor   ->valuestring);
      if (cJSON_IsNumber(objFont    )                                                       )        DateFont     = objFont    ->valueint;
      if (cJSON_IsNumber(objBaseSize)                                                       )        DateBaseSize = objBaseSize->valueint;
    }

    if (cJSON_IsObject(objSSC))
    {
      cJSON* objUrl      = cJSON_GetObjectItemCaseSensitive(objSSC, "Url"     );
      cJSON* objId       = cJSON_GetObjectItemCaseSensitive(objSSC, "Id"      );
      cJSON* objReceiver = cJSON_GetObjectItemCaseSensitive(objSSC, "Receiver");

      if (cJSON_IsString(objUrl     ) && strlen(objUrl     ->valuestring) < sizeof(SSCUrl     )) strcpy(SSCUrl     , objUrl     ->valuestring);
      if (cJSON_IsString(objId      ) && strlen(objId      ->valuestring) < sizeof(SSCId      )) strcpy(SSCId      , objId      ->valuestring);
      if (cJSON_IsString(objReceiver) && strlen(objReceiver->valuestring) < sizeof(SSCReceiver)) strcpy(SSCReceiver, objReceiver->valuestring);
    }
  }
  else
    return -1;

  return 0;
}
