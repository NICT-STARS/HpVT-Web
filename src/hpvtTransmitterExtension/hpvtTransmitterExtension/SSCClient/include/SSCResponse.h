/**
 * @file SSCResponse.h
 * @brief
 * @author CLEALINK TECHNOLOGY
 * @date 2019-1-28
 */

#ifndef SSCRESPONSE_H_
#define SSCRESPONSE_H_

#include <string>
#include <vector>

#include "SSCInfo.h"

/**
 *
 */
class SSCResponseBase {

private:
	int errorCode;
	std::string errorMessage;

public:
	SSCResponseBase();
	virtual ~SSCResponseBase();

	int getErrorCode();
	void setErrorCode(int errorCode);
	std::string& getErrorMessage();
	void setErrorMessage(std::string& errorMessage);
	void setErrorMessageByStatusCode(int statusCode);

	bool isError();
};

/**
 *
 */
class SSCDeviceResponse: public SSCResponseBase {

private:
	SSCDeviceInfo deviceInfo;

public:
	SSCDeviceResponse();
	virtual ~SSCDeviceResponse();

	static SSCDeviceResponse* parse(std::string data);

	SSCDeviceInfo& getDeviceInfo();
	int getDeviceId();
	std::string& getName();
	std::string& getUdId();
	std::string& getDomain();
	std::string& getStartedTime();
};

/**
 *
 */
class SSCDeviceListResponse: public SSCResponseBase {

private:
	std::vector<SSCDeviceInfo*> deviceList;

public:
	SSCDeviceListResponse();
	virtual ~SSCDeviceListResponse();

	static SSCDeviceListResponse* parse(std::string data);
	std::vector<SSCDeviceInfo*>& getDeviceList();
	void appendDeviceInfo(SSCDeviceInfo* deviceInfo);

	int getDeviceInfoCount();
	SSCDeviceInfo* getDeviceInfoByIndex(int index);
};

/**
 *
 */
class SSCSessionResponse: public SSCResponseBase {

private:
	SSCSessionInfo sessionInfo;

public:
	SSCSessionResponse();
	virtual ~SSCSessionResponse();

	static SSCSessionResponse* parse(std::string data);

	SSCSessionInfo& getSessionInfo();
	std::string& getSessionId();
	int getClientId();
	int getServerId();
	std::string& getService();
	std::string& getProtocol();
	std::string& getCreatedTime();
	std::string& getClientStatus();
	std::string& getServerStatus();
	std::string& getClientUpdatedTime();
	std::string& getServerUpdatedTime();

};

class SSCSessionConnectResponse: public SSCResponseBase {
	SSCSessionInfo sessionInfo;
private:

public:
	SSCSessionConnectResponse();
	virtual ~SSCSessionConnectResponse();

	static SSCSessionConnectResponse* parse(std::string data);

	SSCSessionInfo& getSessionInfo();
	std::string& getSessionId();
	int getClientId();
	int getServerId();
	std::string& getService();
	std::string& getProtocol();
	std::string& getCreatedTime();
};

/**
 *
 */
class SSCSessionDisconnectResponse: public SSCResponseBase {

private:

public:
	SSCSessionDisconnectResponse();
	virtual ~SSCSessionDisconnectResponse();

	static SSCSessionDisconnectResponse* parse(std::string data);
};

/**
 *
 */
class SSCSessionListResponse: public SSCResponseBase {

private:
	std::vector<SSCSessionInfo*> sessionList;

public:
	SSCSessionListResponse();
	virtual ~SSCSessionListResponse();

	static SSCSessionListResponse* parse(std::string data);

	std::vector<SSCSessionInfo*>& getSessionInfoList();
	void appendSessionInfo(SSCSessionInfo* sessionInfo);
	int getSessionInfoCount();
	SSCSessionInfo* getSessionInfoByIndex(int index);
};

/**
 *
 */
class SSCCameraProfileResponse: public SSCResponseBase {

private:
	SSCCameraProfileInfo cameraProfileInfo;


public:
	SSCCameraProfileResponse();
	virtual ~SSCCameraProfileResponse();

	static SSCCameraProfileResponse* parse(std::string data);

	SSCCameraProfileInfo& getCameraProfileInfo();
	int getCameraProfileId();
	std::string getStreamName();
	int getDeviceId();
	std::string getCameraId();
	int getStreamId();
	std::string getCreatedTime();
	std::string getUpdatedTime();
	const char* getProfileInfoText();
};

/**
 *
 */
class SSCCameraProfileListResponse: public SSCResponseBase {

private:
	std::vector<SSCCameraProfileInfo*> cameraStreamList;

public:
	SSCCameraProfileListResponse();
	virtual ~SSCCameraProfileListResponse();

	static SSCCameraProfileListResponse* parse(std::string data);

	std::vector<SSCCameraProfileInfo*> getCameraProfileList();
	void appendCameraProfileInfo(SSCCameraProfileInfo* sessionInfo);
	int getCameraProfileInfoCount();
	SSCCameraProfileInfo* getCameraProfileInfoByIndex(int index);
};

/**
 *
 */
class SSCCommandResponse: public SSCResponseBase {

private:
	std::string commandId;

public:
	SSCCommandResponse();
	virtual ~SSCCommandResponse();

	static SSCCommandResponse* parse(std::string data);

	std::string& getCommandId();
	void setCommandId(std::string& commandId);
};

/**
 *
 */
class SSCCommandResultResponse: public SSCResponseBase {

private:
	std::string commandId;
	std::string status;
	std::string commandType;
	int deviceId;
	std::string cameraId;
	int streamId;
	std::string createdTime;
	int resultCode;
	std::string resultMessage;

public:
	SSCCommandResultResponse();
	virtual ~SSCCommandResultResponse();

	static SSCCommandResultResponse* parse(std::string data);

	std::string& getCommandId();
	void setCommandId(std::string& commandId);
	std::string& getStatus();
	void setStatus(std::string& status);
	bool isCompleted();
	std::string& getCameraId();
	void setCameraId(std::string& cameraId);
	int getStreamId();
	void setStreamId(int streamId);
	std::string& getCreatedTime();
	void setCreatedTime(std::string& createdTime);
	int getDeviceId();
	void setDeviceId(int deviceId);
	int getResultCode();
	void setResultCode(int resultCode);
	std::string& getResultMessage();
	void setResultMessage(std::string& resultMessage);
};

#endif /* SSCRESPONSE_H_ */
