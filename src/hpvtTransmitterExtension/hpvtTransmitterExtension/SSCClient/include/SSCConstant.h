/**
 * @file SSCConstant.h
 * @brief
 * @author CLEALINK TECHNOLOGY
 * @date 2019-1-28
 */

#ifndef SSCCONSTANT_H_
#define SSCCONSTANT_H_

//
#define SSC_PATH_API                   "/exchange/api/v1"
#define SSC_PATH_DEVICES                SSC_PATH_API"/devices"
#define SSC_PATH_SESSIONS               SSC_PATH_API"/sessions"
#define SSC_SUB_PATH_SESSIONS          "/sessions"
#define SSC_SUB_PATH_SERVICES          "/services/camm"
#define SSC_SUB_PATH_CAMERA_STREAMS     SSC_SUB_PATH_SERVICES"/camera_streams"
#define SSC_SUB_PATH_COMMANDS           SSC_SUB_PATH_SERVICES"/commands"

//
#define PROFILE_FILTER     unsigned long long

#define PROFILE_DeviceMgmt_GetCapabilities                              (1ULL << 0)
#define PROFILE_DeviceMgmt_GetDeviceInformation                         (1ULL << 1)
#define PROFILE_DeviceMgmt_GetDiscoveryMode                             (1ULL << 2)
#define PROFILE_DeviceMgmt_GetDNS                                       (1ULL << 3)
#define PROFILE_DeviceMgmt_GetDPAddresses                               (1ULL << 4)
#define PROFILE_DeviceMgmt_GetDynamicDNS                                (1ULL << 5)
#define PROFILE_DeviceMgmt_GetEndpointReference                         (1ULL << 6)
#define PROFILE_DeviceMgmt_GetHostname                                  (1ULL << 7)
#define PROFILE_DeviceMgmt_GetIPAddressFilter                           (1ULL << 8)
#define PROFILE_DeviceMgmt_GetNetworkDefaultGateway                     (1ULL << 9)
#define PROFILE_DeviceMgmt_GetNetworkInterfaces                         (1ULL << 10)
#define PROFILE_DeviceMgmt_GetNetworkProtocols                          (1ULL << 11)
#define PROFILE_DeviceMgmt_GetNTP                                       (1ULL << 12)
#define PROFILE_DeviceMgmt_GetRelayOutputs                              (1ULL << 13)
#define PROFILE_DeviceMgmt_GetRemoteDiscoveryMode                       (1ULL << 14)
#define PROFILE_DeviceMgmt_GetScopes                                    (1ULL << 15)
#define PROFILE_DeviceMgmt_GetSystemDateAndTime                         (1ULL << 16)
#define PROFILE_DeviceMgmt_GetSystemLog                                 (1ULL << 17)
#define PROFILE_DeviceMgmt_GetSystemSupportInformation                  (1ULL << 18)
#define PROFILE_DeviceMgmt_GetZeroConfiguration                         (1ULL << 19)
#define PROFILE_Imaging_GetImagingSettings                              (1ULL << 24)
#define PROFILE_Imaging_GetMoveOptions                                  (1ULL << 25)
#define PROFILE_Imaging_GetOptions                                      (1ULL << 26)
#define PROFILE_Imaging_GetStatus                                       (1ULL << 27)
#define PROFILE_Media_GetGuaranteedNumberOfVideoEncoderInstances        (1ULL << 32)
#define PROFILE_Media_GetStreamUri                                      (1ULL << 33)
#define PROFILE_Media_GetVideoEncoderConfiguration                      (1ULL << 34)
#define PROFILE_Media_GetVideoEncoderConfigurationOptions               (1ULL << 35)
#define PROFILE_Media_GetVideoSourceConfiguration                       (1ULL << 36)
#define PROFILE_Media_GetVideoSourceConfigurationOptions                (1ULL << 37)
#define PROFILE_Media_GetVideoSources                                   (1ULL << 38)
#define PROFILE_PTZ_GetConfiguration                                    (1ULL << 44)
#define PROFILE_PTZ_GetConfigurationOptions                             (1ULL << 45)
#define PROFILE_PTZ_GetNode                                             (1ULL << 46)
#define PROFILE_PTZ_GetPresets                                          (1ULL << 47)
#define PROFILE_PTZ_GetStatus                                           (1ULL << 48)

//
#define SSC_PTZ_CONTINUOUS_TIME_INFINITE                     (0)
#define SSC_PTZ_CONTINUOUS_TIME_DEFAULT                   (1000)

#endif /* SSCCONSTANT_H_ */
