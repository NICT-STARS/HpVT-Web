/**
 * @file SSCInfo.h
 * @brief
 * @author CLEALINK TECHNOLOGY
 * @date 2019-1-28
 */

#ifndef SSCINFO_H_
#define SSCINFO_H_

#include <string>

/**
 *
 */
class SSCDeviceInfo {

private:
	int deviceId;
	std::string name;
	std::string udId;
	std::string domain;
	std::string startedTime;

public:
	SSCDeviceInfo();
	virtual ~SSCDeviceInfo();

	int getDeviceId();
	std::string& getName();
	std::string& getUdId();
	std::string& getDomain();
	std::string& getStartedTime();

	void setDeviceId(int deviceId);
	void setDomain(std::string& domain);
	void setName(std::string& name);
	void setStartedTime(std::string& startedTime);
	void setUdId(std::string& udId);
};

/**
 *
 */
class SSCCameraProfileInfo {

private:
	int cameraProfileId;
	std::string streamName;
	int deviceId;
	std::string cameraId;
	int streamId;
	std::string createdTime;
	std::string updatedTime;
	std::string deviceSerialNumber;
	std::string deviceManufacturer;
	std::string deviceModel;
	std::string deviceHardwareId;
	std::string deviceFirmwareVersion;

	std::string profileInfoText;

public:
	SSCCameraProfileInfo();
	virtual ~SSCCameraProfileInfo();

	int getCameraProfileId();
	void setCameraProfileId(int cameraProfileId);
	std::string getStreamName();
	void setStreamName(std::string& streamName);

	void setDeviceId(int deviceId);
	int getDeviceId();
	std::string getCameraId();
	void setCameraId(std::string& cameraId);
	int getStreamId();
	void setStreamId(int streamId);
	std::string getCreatedTime();
	void setCreatedTime(std::string& createdTime);
	std::string getUpdatedTime();
	void setUpdatedTime(std::string& updatedTime);
	std::string& getDeviceFirmwareVersion();
	void setDeviceFirmwareVersion(std::string& deviceFirmwareVersion);
	std::string& getDeviceHardwareId();
	void setDeviceHardwareId(std::string& deviceHardwareId);
	std::string& getDeviceManufacturer();
	void setDeviceManufacturer(std::string& deviceManufacturer);
	std::string& getDeviceModel();
	void setDeviceModel(std::string& deviceModel);
	std::string& getDeviceSerialNumber();
	void setDeviceSerialNumber(std::string& deviceSerialNumber);

	const char* getProfileInfoText();
	void setProfileInfoText(char* profileInfoText);

};

/**
 *
 */
class SSCSessionInfo {

private:
	std::string sessionId;
	int clientId;
	int serverId;
	std::string service;
	std::string protocol;
	std::string createdTime;
	std::string clientStatus;
	std::string serverStatus;
	std::string clientUpdatedTime;
	std::string serverUpdatedTime;


public:
	SSCSessionInfo();
	virtual ~SSCSessionInfo();

	std::string& getSessionId();
	void setSessionId(std::string& sessionId);
	int getClientId();
	void setClientId(int clientId);
	int getServerId();
	void setServerId(int serverId);
	std::string& getService();
	void setService(std::string& service);
	std::string& getProtocol();
	void setProtocol(std::string& protocol);
	std::string& getCreatedTime();
	void setCreatedTime(std::string& createdTime);
	std::string& getClientStatus();
	void setClientStatus(std::string& clientStatus);
	std::string& getServerStatus();
	void setServerStatus(std::string& serverStatus);
	std::string& getClientUpdatedTime();
	void setClientUpdatedTime(std::string& clientUpdatedTime);
	std::string& getServerUpdatedTime();
	void setServerUpdatedTime(std::string& serverUpdatedTime);

};

/**
 *
 */
class SSCRequestResult {

private:
	int curlCode;
	long httpStatusCode;
	std::string payload;

public:
	SSCRequestResult();
	virtual ~SSCRequestResult();

	int getCurlCode();
	void setCurlCode(int curlCode);
	int getHttpStatusCode();
	void setHttpStatusCode(long httpStatusCode);
	std::string& getPayload();
	void setPayload(std::string&);
};

#endif /* SSCINFO_H_ */
