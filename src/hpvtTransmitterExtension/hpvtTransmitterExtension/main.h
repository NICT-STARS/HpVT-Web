#include "SSCClientManager.h"
/******************************************************************************/
/* hpvtTransmitterExtension                                                   */
/* Inoue Computer Service                                                     */
/******************************************************************************/
void  HPVTLoadPlugin           (void);
void  HPVTUnloadPlugin         (void);
void* hpvtTransmitterExtension (void *arg);
bool  ChangeParameters         (cJSON* pJson, SSCClientManager* pSSCClientManager);
bool  ChangeParametersIPCamera (cJSON* pJson, SSCClientManager* pSSCClientManager);
bool  ChangeParametersStandard (cJSON* pJson);
bool  ChangeParametersSDICamera(cJSON* pJson);
