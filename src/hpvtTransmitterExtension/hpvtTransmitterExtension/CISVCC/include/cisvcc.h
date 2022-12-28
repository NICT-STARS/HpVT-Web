/*
 ============================================================================
 Name        : CSIVCC.h
 Author      : Clealink
 Version     :
 Copyright   : Your copyright notice
 Description : VCC-HD10ZM Camera API: header file
 ============================================================================
 */

#ifndef CSICVV_H_
#define CSICVV_H_


#ifdef	__cplusplus
extern "C" {
#endif

#include "base.h"
#include "utility.h"

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: SETUP SERIAL PORT >>>>>>>>>>>>>>>>>>>>>>>>>>>> */

void init_api_msg(struct CISVCC_ctx * ctx);
void show_api_msg(struct CISVCC_ctx * ctx);
int getErrno(struct CISVCC_ctx * ctx);
char * getErrMsg(struct CISVCC_ctx * ctx);
bool openAndSetupSerialPort(struct CISVCC_ctx * ctx);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: SERIAL PORT >>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* serial port */

bool CISVCC_openSerialPort(struct CISVCC_ctx * ctx);
bool CISVCC_closeSerialPort(struct CISVCC_ctx * ctx);
bool CISVCC_setupSerialPort(struct CISVCC_ctx * ctx);

/* init, save */

bool CISVCC_init(struct CISVCC_ctx * ctx);
bool CISVCC_save(struct CISVCC_ctx * ctx);

/* GVI, SSDW */

bool CISVCC_GVI(int index, struct CISVCC_ctx * ctx);
bool CISVCC_SDDW(int value, struct CISVCC_ctx * ctx);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: VIDEO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* video format */
bool CISVCC_setVideoFormat(int format, struct CISVCC_ctx * ctx);
bool CISVCC_getVideoFormat(int * format, struct CISVCC_ctx * out);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: AE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* gain mode */
bool CISVCC_setGainMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getGainMode(int * mode, struct CISVCC_ctx * out);

/* gain value */

bool CISVCC_setGainValue(int value, struct CISVCC_ctx * ctx);
bool CISVCC_setGainValue_Ratio(float ratio, struct CISVCC_ctx * ctx);
bool CISVCC_setGainValue_dB(float db, struct CISVCC_ctx * ctx);
bool CISVCC_getGainValue(int * value, struct CISVCC_ctx * out);

/* gain max value */

bool CISVCC_setGainMaxValue(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getGainMaxValue(int * value, struct CISVCC_ctx * out);

/* shutter mode */

bool CISVCC_setShutterMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getShutterMode(int * mode, struct CISVCC_ctx * out);

/* shutter value */

bool CISVCC_setShutterValue(int value, struct CISVCC_ctx * ctx);
bool CISVCC_setShutterValue_Sec(float sec, struct CISVCC_ctx * ctx);
bool CISVCC_getShutterValue(int * value, struct CISVCC_ctx * out);

/* shutter limit */

bool CISVCC_setShutterLimit(int max, int min, struct CISVCC_ctx * ctx);
bool CISVCC_setShutterLimit_Sec(float max, float min, struct CISVCC_ctx * ctx);
bool CISVCC_getShutterLimit(int * max, int * min, struct CISVCC_ctx * out);

/* metering mode */

bool CISVCC_setMeteringMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getMeteringMode(int * mode, struct CISVCC_ctx * out);

/* spot block */

bool CISVCC_setSpotBlock(int x, int y, int w, int h, struct CISVCC_ctx * ctx);
bool CISVCC_getSpotBlock(int * x, int * y, int * w, int * h, struct CISVCC_ctx * out);

/* AE Speed */

bool CISVCC_setAESpeed(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getAESpeed(int * value, struct CISVCC_ctx * out);

/* Exposure compensation value */

bool CISVCC_setExposureCompensationValue(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getExposureCompensationValue(int * value, struct CISVCC_ctx * out);

/* Flicker cancel */

bool CISVCC_setFlickerCancel(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getFlickerCancel(int * mode, struct CISVCC_ctx * out);

/* Gain value (plus / minus) */

bool CISVCC_changeGainValuePlusMinus(int value, struct CISVCC_ctx * ctx);

/* Shutter speed (plus / minus) */

bool CISVCC_changeShutterSpeedPlusMinus(int value, struct CISVCC_ctx * ctx);

/* Iris (plus / minus) */

bool CISVCC_changeIrisPlusMinus(int value, struct CISVCC_ctx * ctx);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: WB >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* WB mode  */

bool CISVCC_setWBMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getWBMode(int * value, struct CISVCC_ctx * out);

/* Preset */

bool CISVCC_setPreset(int value, struct CISVCC_ctx * ctx);

/* Blue gain */

bool CISVCC_setBlueGain(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getBlueGain(int * value, struct CISVCC_ctx * out);

/* Red gain */

bool CISVCC_setRedGain(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getRedGain(int * value, struct CISVCC_ctx * out);

/* One push trigger */

bool CISVCC_setOnePushTrigger(int value, struct CISVCC_ctx * ctx);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: IMAGE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* Edge level */

bool CISVCC_setEdgeLevel(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getEdgeLevel(int * value, struct CISVCC_ctx * out);

/* HDR mode */

bool CISVCC_setHDRMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getHDRMode(int * mode, struct CISVCC_ctx * out);

/* HDR ratio value */

bool CISVCC_setHDRRatioValue(int value1, int value2, struct CISVCC_ctx * ctx);
bool CISVCC_getHDRRatioValue(int * value, struct CISVCC_ctx * out);

/* HDR MBC mode */

bool CISVCC_setHDRMBCMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getHDRMBCMode(int * mode, struct CISVCC_ctx * out);

/* contrast */

bool CISVCC_setContrast(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getContrast(int * value, struct CISVCC_ctx * out);

/* master pedestal */

bool CISVCC_setMasterPedestal(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getMasterPedestal(int * value, struct CISVCC_ctx * out);

/* red pedestal */

bool CISVCC_setRedPedestal(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getRedPedestal(int * value, struct CISVCC_ctx * ctx);

/* green pedestal */

bool CISVCC_setGreenPedestal(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getGreenPedestal(int * value, struct CISVCC_ctx * out);

/* blue pedestal */

bool CISVCC_setBluePedestal(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getBluePedestal(int * value, struct CISVCC_ctx * out);

/* red pedestal */

bool CISVCC_setRedBalance(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getRedBalance(int * value, struct CISVCC_ctx * out);

/* green pedestal */

bool CISVCC_setGreenBalance(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getGreenBalance(int * value, struct CISVCC_ctx * out);

/* blue pedestal */

bool CISVCC_setBlueBalance(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getBlueBalance(int * value, struct CISVCC_ctx * out);

/* color saturation  */

bool CISVCC_setColorSaturation(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getColorSaturation(int * value, struct CISVCC_ctx * out);

/* shading correction */

bool CISVCC_setShadingCorrection(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getShadingCorrection(int * value, struct CISVCC_ctx * out);

/* shading correction level */

bool CISVCC_setShadingCorrectionLevel(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getShadingCorrectionLevel(int * value, struct CISVCC_ctx * out);

/* noise reduction */

bool CISVCC_setNoiseReduction(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getNoiseReduction(int * value, struct CISVCC_ctx * out);

/* shading correction */

bool CISVCC_setColorCorrection(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getColorCorrection(int * mode, struct CISVCC_ctx * out);

/* color suppression */

bool CISVCC_setColorSuppression(int level, struct CISVCC_ctx * ctx);
bool CISVCC_getColorSuppression(int * value, struct CISVCC_ctx * out);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: LENS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* Iris mode */

bool CISVCC_setIrisMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getIrisMode(int * value, struct CISVCC_ctx * out);

/* Aperture value */

bool CISVCC_setApertureValue(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getApertureValue(int * value, struct CISVCC_ctx * out);

/* Aperture limit */

bool CISVCC_setApertureLimit(int max, int min, struct CISVCC_ctx * ctx);
bool CISVCC_getApertureLimit(int * max, int * min, struct CISVCC_ctx * out);

/* Zoom drive */

bool CISVCC_setZoomDrive(int mode, int value, int speed, struct CISVCC_ctx * ctx);
bool CISVCC_getZoomDrive(int get_mode, int * param1, int * zoom, int * speed, struct CISVCC_ctx * out);

/* Focus drive */

bool CISVCC_setFocusDrive(int mode, int value, int speed, struct CISVCC_ctx * ctx);
bool CISVCC_getFocusDrive(int get_mode, int * param1, int * zoom, int * speed, struct CISVCC_ctx * out);

/* Focus mode */

bool CISVCC_setFocusMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getFocusMode(int * mode, struct CISVCC_ctx * out);

/* Focus one push trigger */

bool CISVCC_setFocusOnePushTrigger(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getFocusOnePushTrigger(int * value, struct CISVCC_ctx * out);

/* IRCut filter mode */

bool CISVCC_setIRCutFilterMode(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getIRCutFilterMode(int * mode, struct CISVCC_ctx * out);

/* Auto ICF threshold */

bool CISVCC_setAutoICFThreshold(int out_threshold, int in_threshold, struct CISVCC_ctx * ctx);
bool CISVCC_getAutoICFThreshold(int * out_threshold, int * in_threshold, struct CISVCC_ctx * out);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: OSD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* OSD up button */

bool CISVCC_setOSDUpButton(int value, struct CISVCC_ctx * ctx);

/* OSD up button */

bool CISVCC_setOSDDownButton(int value, struct CISVCC_ctx * ctx);

/* OSD R  button */

bool CISVCC_setOSDRButton(int value, struct CISVCC_ctx * ctx);

/* OSD L button */

bool CISVCC_setOSDLButton(int value, struct CISVCC_ctx * ctx);

/* OSD center button : is used to
 * 1. select an menu item in OSD panel
 * 2. pop up OSD panel
 * */

bool CISVCC_setOSDCenterButton(int value, struct CISVCC_ctx * ctx);

/* menu color */

bool CISVCC_setMenuColor(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getMenuColor(int * value, struct CISVCC_ctx * out);

/* highlight color */

bool CISVCC_setHighlightColor(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getHighlightColor(int * value, struct CISVCC_ctx * out);

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  API: Others >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* camera setting store */

bool CISVCC_setCameraSettingStore(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getCameraSettingStore(int * value, struct CISVCC_ctx * out);

/* camera setting load */

bool CISVCC_setCameraSettingLoad(int value, struct CISVCC_ctx * ctx);
bool CISVCC_getCameraSettingLoad(int * value, struct CISVCC_ctx * out);

/* LTC OFF/ON */

bool CISVCC_setLTCOffOn(int mode, struct CISVCC_ctx * ctx);
bool CISVCC_getLTCOffOn(int * value, struct CISVCC_ctx * out);

/* LTC reset */

bool CISVCC_LTCReset(struct CISVCC_ctx * ctx);



#ifdef	__cplusplus
}
#endif


#endif /* CSICVV_H_ */
