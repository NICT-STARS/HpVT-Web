/**
 * @file SSCClient.h
 * @brief libcurl wrapper
 * @author CLEALINK TECHNOLOGY
 * @date 2019-1-28
 */

#ifndef SSCCLIENT_H_
#define SSCCLIENT_H_

#include <string>
#include <curl/curl.h>

#include "SSCTaskQuery.h"
//class SSCDeviceTaskQuery;
//class SSCCameraProfileTaskQuery;
//class SSCSessionTaskQuery;
//class SSCOnvifImagingTaskQuery;
//class SSCOnvifEncoderTaskQuery;
//class SSCOnvifPtzTaskQuery;

/**
 *
 */
class SSCClient {

private:
	std::string host;
	CURL *curlHandle;
public:
	SSCClient(const std::string& host);
	virtual ~SSCClient();

	SSCDeviceTaskQuery* createDeviceTaskQuery(int deviceId);
	SSCDeviceListTaskQuery* createDeviceListTaskQuery();
	SSCSessionTaskQuery* createSessionTaskQuery(std::string& sessionId);
	SSCSessionListTaskQuery* createSessionListTaskQuery();
	SSCSessionListTaskQuery* createSessionListTaskQuery(int deviceId);
	SSCSessionConnectTaskQuery* createSessionConnectTaskQuery(int clientId, int serverId); //  connect hpvt
	SSCSessionDisconnectTaskQuery* createSessionDisconnectTaskQuery(std::string& sessionId); //  disconnect hpvt
	SSCCameraProfileTaskQuery* createCameraProfileTaskQuery(int deviceId, int cameraProfileId); // get config
	SSCCameraProfileListTaskQuery* createCameraProfileListTaskQuery(int deviceId);
	SSCOnvifImagingTaskQuery* createOnvifImagingTaskQuery(int deviceId, int cameraProfileId);
	SSCOnvifEncoderTaskQuery* createOnvifEncoderTaskQuery(int deviceId, int cameraProfileId);
	SSCOnvifPtzTaskQuery* createOnvifPtzTaskQuery(int deviceId, int cameraProfileId);
	SSCOnvifSystemTaskQuery* createOnvifSystemTaskQuery(int deviceId, int cameraProfileId);
	SSCCommandResultTaskQuery* createCommandResultTaskQuery(int deviceId, std::string& commandId);

	SSCRequestResult* requestGET(std::string& urlPath);
	SSCRequestResult* requestPOST(std::string& urlPath, std::string& formData);
	SSCRequestResult* requestDELETE(std::string& urlPath);

};

#endif /* SSCCLIENT_H_ */
