/**
 * @file SSCTaskQuery.h
 * @brief
 * @author CLEALINK TECHNOLOGY
 * @date 2019-1-28
 */

#ifndef SSCTASKQUERY_H_
#define SSCTASKQUERY_H_

#include "SSCResponse.h"
#include "SSCConstant.h"

//#include "SSCClient.h"
class SSCClient;


#define SSC_COMMAND_PARAMETER_INITIAL_VALUE           (-255)


/**
 *
 */
class TaskQueryBase {

private:
	SSCClient* client;

public:
	TaskQueryBase(SSCClient*);
	virtual ~TaskQueryBase();

	SSCClient* getClient();

	virtual SSCResponseBase* exec() = 0;
};

/**
 *
 */
class SSCDeviceTaskQuery: public TaskQueryBase {

private:
	int deviceId;
public:
	SSCDeviceTaskQuery(SSCClient* client);
	virtual ~SSCDeviceTaskQuery();

	int getDeviceId();
	void setDeviceId(int deviceId);

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCDeviceListTaskQuery: public TaskQueryBase {

private:

public:
	SSCDeviceListTaskQuery(SSCClient* client);
	virtual ~SSCDeviceListTaskQuery();

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCSessionTaskQuery: public TaskQueryBase {

private:
	std::string sessionId;
public:
	SSCSessionTaskQuery(SSCClient* client);
	virtual ~SSCSessionTaskQuery();

	std::string& getSessionId();
	void setSessionId(std::string& sessionId);

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCSessionListTaskQuery: public TaskQueryBase {

private:
	int deviceId;
public:
	SSCSessionListTaskQuery(SSCClient* client);
	virtual ~SSCSessionListTaskQuery();

	int getDeviceId();
	void setDeviceId(int deviceId);

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCSessionConnectTaskQuery: public TaskQueryBase {

private:
	int clientId;
	int serverId;
	//
public:
	SSCSessionConnectTaskQuery(SSCClient* client);
	virtual ~SSCSessionConnectTaskQuery();

	int getClientId();
	void setClientId(int clientId);
	int getServerId();
	void setServerId(int serverId);

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCSessionDisconnectTaskQuery: public TaskQueryBase {

private:
	std::string sessionId;
	//
public:
	SSCSessionDisconnectTaskQuery(SSCClient* client);
	virtual ~SSCSessionDisconnectTaskQuery();

	std::string& getSessionId();
	void setSessionId(std::string& sessionId);

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCCameraProfileTaskQuery: public TaskQueryBase {

private:
	int deviceId;
	int cameraProfileId;
	PROFILE_FILTER profileFilter;
public:
	SSCCameraProfileTaskQuery(SSCClient* client);
	virtual ~SSCCameraProfileTaskQuery();

	int getDeviceId();
	void setDeviceId(int deviceId);
	int getCameraProfileId();
	void setCameraProfileId(int cameraProfileId);

	void setFilter(PROFILE_FILTER filter);
	void unsetFilter();

	SSCResponseBase *exec();

};

/**
 *
 */
class SSCCameraProfileListTaskQuery: public TaskQueryBase {

private:
	int deviceId;
public:
	SSCCameraProfileListTaskQuery(SSCClient* client);
	virtual ~SSCCameraProfileListTaskQuery();

	int getDeviceId();
	void setDeviceId(int deviceId);

	SSCResponseBase *exec();

};

class SSCCommandTaskQuery: public TaskQueryBase {

private:
	int deviceId;
	int cameraProfileId;

public:
	SSCCommandTaskQuery(SSCClient* client);
	virtual ~SSCCommandTaskQuery();
	int getDeviceId();
	void setDeviceId(int deviceId);
	int getCameraProfileId();
	void setCameraProfileId(int cameraProfileId);

	virtual SSCResponseBase* exec() = 0;
};

/**
 *
 */
class SSCOnvifImagingTaskQuery: public SSCCommandTaskQuery {

private:
	bool isSetBacklightCompensation;
	bool isSetBrightness;
	bool isSetColorSaturation;
	bool isSetContrast;
	bool isSetExposure;
	bool isSetFocus;
	bool isSetIrCutFilterMode;
	bool isSetSharpness;
	bool isSetWideDynamicRrange;
	bool isSetWhiteBalance;
	bool isSetImageStabization;
	bool isSetIrCutFilterAutoAdjustment;
	bool isSetToneCompensation;
	bool isSetDefogging;
	bool isSetNoiseReduction;

	std::string backlightCompensationMode;
	float backlightCompensationLevel;
	float brightness;
	float colorSaturation;
	float contrast;
	std::string exposureMode;
	std::string exposurePriority;
	float exposureWindowX;
	float exposureWindowY;
	float exposureWindowWidth;
	float exposureWindowHeight;
	float exposureTimeFixed;
	float exposureTimeMin;
	float exposureTimeMax;
	float exposureGainFixed;
	float exposureGainMin;
	float exposureGainMax;
	float exposureIrisFixed;
	float exposureIrisMin;
	float exposureIrisMax;
	std::string focusMode;
	float focusDefaultSpeed;
	float focusLimitNear;
	float focusLimitFar;
	std::string irCutFilterMode;
	float sharpness;
	std::string wideDynamicRangeMode;
	float wideDynamicRangeLevel;
	std::string whiteBalanceMode;
	float whiteBalanceCrGain;
	float whiteBalanceCbGain;

	std::string imageStabizationMode;
	float imageStabizationLevel;

	std::string irCutFilterAutoAdjustmentBoundaryType;
	float irCutFilterAutoAdjustmentBoundaryOffset;
	int irCutFilterAutoAdjustmentResponseTime;

	std::string toneCompensationMode;
	float toneCompensationLevel;
	std::string defoggingMode;
	float defoggingLevel;
	float noiseReductionLevel;

public:
	SSCOnvifImagingTaskQuery(SSCClient* client);
	virtual ~SSCOnvifImagingTaskQuery();

	SSCOnvifImagingTaskQuery* setBacklightCompensationMode(char* mode);
	SSCOnvifImagingTaskQuery* setBacklightCompensationLevel(float level);
	SSCOnvifImagingTaskQuery* setBrightness(float brightness);
	SSCOnvifImagingTaskQuery* setColorSaturation(float colorSaturation);
	SSCOnvifImagingTaskQuery* setContrast(float contrast);
	SSCOnvifImagingTaskQuery* setExposureMode(char* exposureMode);
	SSCOnvifImagingTaskQuery* setExposurePriority(char* priority);
	SSCOnvifImagingTaskQuery* setExposureWindow(float x, float y, float width, float height);
	SSCOnvifImagingTaskQuery* setExposureTimeFixed(float exposureTime);
	SSCOnvifImagingTaskQuery* setExposureTimeRange(float minExposureTime, float maxExposureTime);
	SSCOnvifImagingTaskQuery* setExposureGainFixed(float gain);
	SSCOnvifImagingTaskQuery* setExposureGainRange(float minGain, float maxGain);
	SSCOnvifImagingTaskQuery* setExposureIrisFixed(float iris);
	SSCOnvifImagingTaskQuery* setExposureIrisRange(float minIris, float maxIris);
	SSCOnvifImagingTaskQuery* setFocusMode(char* mode);
	SSCOnvifImagingTaskQuery* setFocusDefaultSpeed(float speed);
	SSCOnvifImagingTaskQuery* setFocusLimit(float nearLimit, float farLimit);
	SSCOnvifImagingTaskQuery* setIrCutFilterMode(char* mode);
	SSCOnvifImagingTaskQuery* setSharpness(float sharpness);
	SSCOnvifImagingTaskQuery* setWideDynamicRangeMode(char* mode);
	SSCOnvifImagingTaskQuery* setWideDynamicRangeLevel(float level);
	SSCOnvifImagingTaskQuery* setWhiteBalanceMode(char* mode);
	SSCOnvifImagingTaskQuery* setWhiteBalanceGain(float crGain, float cbGain);
	SSCOnvifImagingTaskQuery* setImageStabizationMode(char* mode);
	SSCOnvifImagingTaskQuery* setImageStabizationLevel(float level);
	SSCOnvifImagingTaskQuery* setIrCutFilterAutoAdjustmentBoundaryType(std::string& boundaryType);
	SSCOnvifImagingTaskQuery* setIrCutFilterAutoAdjustmentBoundaryOffset(float boundaryOffset);
	SSCOnvifImagingTaskQuery* setIrCutFilterAutoAdjustmentResponseTime(int responseTime);
	SSCOnvifImagingTaskQuery* setToneCompensationMode(char* mode);
	SSCOnvifImagingTaskQuery* setToneCompensationLevel(float level);
	SSCOnvifImagingTaskQuery* setDefoggingMode(char* mode);
	SSCOnvifImagingTaskQuery* setDefoggingLevel(float level);
	SSCOnvifImagingTaskQuery* setNoiseReductionLevel(float level);
	SSCOnvifImagingTaskQuery* unsetTask();

	SSCResponseBase *exec();
};

/**
 *
 */
class SSCOnvifEncoderTaskQuery: public SSCCommandTaskQuery {

private:
	bool isSetResolution;
	bool isSetQuality;
	bool isSetBitrateLimit;
	bool isSetFramerateLimit;
	bool isSetEncodingInterval;
	bool isSetGovLength;
	bool isSetH264Profile;

	int resolutionWidth;
	int resolutionHeight;
	int quality;
	int bitrateLimit;
	int framerateLimit;
	int encodingInterval;
	int govLength;
	std::string h264Profile;

public:
	SSCOnvifEncoderTaskQuery(SSCClient* client);
	virtual ~SSCOnvifEncoderTaskQuery();

	SSCOnvifEncoderTaskQuery* setResolution(int width, int height);
	SSCOnvifEncoderTaskQuery* setQuality(int quality);
	SSCOnvifEncoderTaskQuery* setFramerateLimit(int framerate);
	SSCOnvifEncoderTaskQuery* setEncodingInterval(int encodingInterval);
	SSCOnvifEncoderTaskQuery* setBitrateLimit(int bitrate);
	SSCOnvifEncoderTaskQuery* setGovLength(int govLength);
	SSCOnvifEncoderTaskQuery* setH264Profile(std::string& h264Profile);
	SSCOnvifEncoderTaskQuery* unsetTask();

	SSCResponseBase* exec();
};

/**
 *
 */
class SSCOnvifPtzTaskQuery: public SSCCommandTaskQuery {

private:
	bool isSetPanTiltZoom;
	bool isSetStop;
	bool isSetSetPreset;
	bool isSetRemovePreset;
	bool isSetGotoPreset;

	int panDirection;
	int tiltDirection;
	int zoomDirection;
	float panSpeed;
	float tiltSpeed;
	float zoomSpeed;
	int continuousTime;

	int presetNumber;
	std::string presetName;

public:
	SSCOnvifPtzTaskQuery(SSCClient* client);
	virtual ~SSCOnvifPtzTaskQuery();

	SSCOnvifPtzTaskQuery* setPanLeft(float speed);
	SSCOnvifPtzTaskQuery* setPanRight(float speed);
	SSCOnvifPtzTaskQuery* setTiltUp(float speed);
	SSCOnvifPtzTaskQuery* setTiltDown(float speed);
	SSCOnvifPtzTaskQuery* setZoomIn(float speed);
	SSCOnvifPtzTaskQuery* setZoomout(float speed);
	SSCOnvifPtzTaskQuery* setContinuousTime(int continuousTime);
	SSCOnvifPtzTaskQuery* setStop();
	SSCOnvifPtzTaskQuery* setSetPreset(int number, char* name);
	SSCOnvifPtzTaskQuery* setRemovePreset(int number);
	SSCOnvifPtzTaskQuery* setGotoPreset(int number);
	SSCOnvifPtzTaskQuery* unsetTask();

	SSCResponseBase* exec();
};

/**
 *
 */
class SSCOnvifSystemTaskQuery: public SSCCommandTaskQuery {

private:
	bool isSetReboot;


public:
	SSCOnvifSystemTaskQuery(SSCClient* client);
	virtual ~SSCOnvifSystemTaskQuery();

	SSCOnvifSystemTaskQuery* setReboot();

	SSCResponseBase* exec();
};


/**
 *
 */
class SSCCommandResultTaskQuery: public TaskQueryBase {

private:
	int deviceId;
	std::string commandId;
public:
	SSCCommandResultTaskQuery(SSCClient* client);
	virtual ~SSCCommandResultTaskQuery();

	int getDeviceId();
	void setDeviceId(int deviceId);
	std::string& getCommandId();
	void setCommandId(std::string& commandId);

	SSCResponseBase *exec();
};

#endif /* SSCTASKQUERY_H_ */
