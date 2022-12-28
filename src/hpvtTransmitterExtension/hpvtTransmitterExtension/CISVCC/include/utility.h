/*
 ============================================================================
 Name        : utilityC.h
 Author      : Clealink
 Version     :
 Copyright   : Your copyright notice
 Description : VCC-HD10ZM Camera API: header file
 ============================================================================
 */
//#define _POSIX_C_SOURCE >= 199309L

#include<stdio.h>

#ifndef UTILITY_H_
#define UTILITY_H_


#ifdef	__cplusplus
extern "C" {
#endif


#include <stdbool.h>

#include "base.h"

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  MACRO: Miscellaneous >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

#define INITIAL_VALUE -11111.11   // This value must be out of the range of values that camera parameters can take on
#define BUFFER_SIZE 200
#define MAX_RETURNED_PARAMS 4     // maximum number of parameters that could be returned from camera

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Structs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

struct CISVCC_ctx {
	char msg[BUFFER_SIZE];              // holds messages returned from API
	float params[MAX_RETURNED_PARAMS];	// holds parameters returned from API (4 return parameters at max).
	int error_code;                     // holds error code returned from API
};

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  METHODS: utility >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* ---------------------------- check range -------------- */

bool _check_range(float index, int min, int max, struct CISVCC_ctx * ctx);
bool _check_gainRange(int value, struct CISVCC_ctx * ctx);
bool _check_gainRange_ratio(float value, struct CISVCC_ctx * ctx);
bool _check_gainRange_dB(float value, struct CISVCC_ctx * ctx);
bool _check_shutterRange(int value, struct CISVCC_ctx * ctx);
bool _check_shutterRange_sec(float value, struct CISVCC_ctx * ctx);
bool _check_shutterLimit(float value, struct CISVCC_ctx * ctx);
bool _check_HDRRatioRange(float value, struct CISVCC_ctx * ctx);
bool _check_apertureRange(int value, struct CISVCC_ctx * ctx);

/* ---------------------------- convert ---
 * Converts macro values to their corresponding strings.
 * Are used in logging messages.
 */
void _CISVCC_convertCmdIdToString(int id, char * str);
void _CISVCC_convertVideoFormatToString(int id, char * str);
void _CISVCC_convertGainModeToString(int id, char * str);
void _CISVCC_convertShutterModeToString(int id, char * str);
void _CISVCC_convertMeteringModeToString(int id, char * str);
void _CISVCC_convertFlickerCancelToString(int id, char * str);
void _CISVCC_convertWBModeToString(int id, char * str);
void _CISVCC_convertPresetToString(int id, char * str);
void _CISVCC_convertOnePushTriggerToString(int id, char * str);
void _CISVCC_convertHDRModeToString(int id, char * str);
void _CISVCC_convertHDRRatioValueToString(int id, char * str);
void _CISVCC_convertHDRMBCModeToString(int id, char * str);
void _CISVCC_convertContrastToString(int id, char * str);
void _CISVCC_convertShadingCorrectionToString(int id, char * str);
void _CISVCC_convertColorCorrectionToString(int id, char * str);
void _CISVCC_convertIrisModeToString(int id, char * str);
void _CISVCC_convertFocusModeToString(int id, char * str);
void _CISVCC_convertFocusOnePushTriggerStatusToString(int id, char * str);
void _CISVCC_convertIRCutFilterModeToString(int id, char * str);
void _CISVCC_convertMenuColorToString(int id, char * str);
void _CISVCC_convertHighLightColorToString(int id, char * str);
void _CISVCC_convertLTCOffOnToString(int id, char * str);

/* ---------------------------- set ---
 * 1. _CISVCC_set*()												// SU 1 0
 *    Write a set command to serial port
 *    Number of set command parameters: 0,1,2,3,4
 * 2. _CISVCC_confirm_set*()										// SU 1 0 >
 *    Confirms expected return string from camera
 *    Expected return string is the set command followed by '>'
 *    @ value*: command parameter values
 *    @ format*: format specifier that is used in call to sprintf()
 */

bool _CISVCC_set0(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_set1(int cmdId, float value1, char format, struct CISVCC_ctx * ctx);
bool _CISVCC_set2(int cmdId, float value1, float value2, char format1, char format2, struct CISVCC_ctx * ctx);
bool _CISVCC_set3(int cmdId, float value1, float value2, float value3, char format1, char format2, char format3, struct CISVCC_ctx * ctx);
bool _CISVCC_set4(int cmdId, float value1, float value2, float value3, float value4, char format1, char format2, char format3, char format4, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_set0(int cmdId, struct CISVCC_ctx * out);
bool _CISVCC_confirm_set1(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_set1_ex(int cmdId, struct CISVCC_ctx * out);
bool _CISVCC_confirm_set2(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_set3(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_set4(int cmdId, struct CISVCC_ctx * ctx);

/* ---------------------------- get ---
 * 1. _CISVCC_get*()												// GU 1
 *    Write a get command to serial port
 *    Number of get command parameters: 0,1
 * 2. _CISVCC_confirm_get*()										// GU 1 0 >
 *    Confirms expected return string from camera
 *    Expected number of returned parameters: 0,1,2,3,4
 */

/* _CISVCC_get1() is used when camera return value depends on the specified mode */
bool _CISVCC_get1(int cmdId, int mode, struct CISVCC_ctx * ctx);
/* _CISVCC_get() is used in pair with any of _CISVCC_confirm_get*() */
bool _CISVCC_get(int cmdId, struct CISVCC_ctx * ctx);
/* 0,1,2,3,4 refer to the number of values expected to be returned by camera in response to _CISVCC_get or _CISVCC_get1 */
bool _CISVCC_confirm_get0(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_get1(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_get2(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_get3(int cmdId, struct CISVCC_ctx * ctx);
bool _CISVCC_confirm_get4(int cmdId, struct CISVCC_ctx * ctx);


#ifdef	__cplusplus
}
#endif


#endif /* UTILITY_H_ */
