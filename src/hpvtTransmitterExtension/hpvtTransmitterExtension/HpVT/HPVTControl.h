#ifndef HPVTCONTROL_H_
#define HPVTCONTROL_H_

#include "HPVTTypes.h"

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/**
 * The function to be called when the plug-in is loaded.
 */
void HPVTLoadPlugin(void);

/**
 * The function to be called when the plug-in is unloaded.
 */
void HPVTUnloadPlugin(void);

/**
 * Initialization for using this API functions
 */
void HPVTInitialize(void);

/**
 * Finalization
 */
void HPVTDestroy(void);


HPVT_ERROR_CODE HPVTGetSoftwareVersion(int *major, int *minor, int *revision);


/**
 * Get full path of the file
 */
HPVT_ERROR_CODE HPVTGetApplicationFilePath(char *file_path);
HPVT_ERROR_CODE HPVTGetConfigFilePath(char *file_path);
HPVT_ERROR_CODE HPVTGetPluginFilePath(char *file_path);

/**
 * Get the camera type to use
 */
HPVT_CAMERA_TYPE HPVTGetCameraType(void);

/**
 * Set the camera state to shooting preparation state
 */
HPVT_ERROR_CODE HPVTCameraActivate(HPVT_CAMERA_ID camera_id);

/**
 * Release the camera state from the shooting preparation state
 */
HPVT_ERROR_CODE HPVTCameraInactivate(HPVT_CAMERA_ID camera_id);

/**
 * Set the camera shooting mode to video shooting
 */
HPVT_ERROR_CODE HPVTCameraSetShootingModeVideo(HPVT_CAMERA_ID camera_id);

/**
 * Set the camera shooting mode to still shooting
 */
HPVT_ERROR_CODE HPVTCameraSetShootingModeStill(HPVT_CAMERA_ID camera_id);

/**
 * Release the camera shooting mode
 */
HPVT_ERROR_CODE HPVTCameraUnsetShootingMode(HPVT_CAMERA_ID camera_id);

/**
 * Get current camera shooting mode
 */
HPVT_CAMERA_SHOOTING_MODE HPVTCameraGetShootingMode(HPVT_CAMERA_ID camera_id);

/**
 * Get current camera state
 */
HPVT_CAMERA_STATE HPVTCameraGetState(HPVT_CAMERA_ID camera_id);

/**
 * Start camera shooting
 */
HPVT_ERROR_CODE HPVTCameraCaptureEnable(HPVT_CAMERA_ID camera_id);

/**
 * Stop camera shooting
 */
HPVT_ERROR_CODE HPVTCameraCaptureDisable(HPVT_CAMERA_ID camera_id);

/**
 * All camera parameters setting function
 */
HPVT_ERROR_CODE HPVTCameraSetAllParameters(HPVT_CAMERA_ID camera_id, HPVT_CAMERA_PARAMETERS *params);

/**
 * Individual camera parameter changing functions
 */
HPVT_ERROR_CODE HPVTCameraChangeCaptureFramerate(HPVT_CAMERA_ID camera_id, int framerate);
HPVT_ERROR_CODE HPVTCameraChangeRotation(HPVT_CAMERA_ID camera_id, int rotation);
HPVT_ERROR_CODE HPVTCameraChangeFlip(HPVT_CAMERA_ID camera_id, int flip);
HPVT_ERROR_CODE HPVTCameraChangeSharpness(HPVT_CAMERA_ID camera_id, int sharpness);
HPVT_ERROR_CODE HPVTCameraChangeContrast(HPVT_CAMERA_ID camera_id, int contrast);
HPVT_ERROR_CODE HPVTCameraChangeBrightness(HPVT_CAMERA_ID camera_id, int brightness);
HPVT_ERROR_CODE HPVTCameraChangeSaturation(HPVT_CAMERA_ID camera_id, int saturation);
HPVT_ERROR_CODE HPVTCameraChangeISO(HPVT_CAMERA_ID camera_id, int iso);
HPVT_ERROR_CODE HPVTCameraChangeShutterSpeed(HPVT_CAMERA_ID camera_id, int speed);
HPVT_ERROR_CODE HPVTCameraChangeExposureMode(HPVT_CAMERA_ID camera_id, HPVT_CAMERA_EXPOSURE_MODE mode);
HPVT_ERROR_CODE HPVTCameraChangeExposureCompensation(HPVT_CAMERA_ID camera_id, int exposure_compensation);
HPVT_ERROR_CODE HPVTCameraChangeWhiteBalanceMode(HPVT_CAMERA_ID camera_id, HPVT_CAMERA_AWB_MODE mode);
HPVT_ERROR_CODE HPVTCameraChangeWhiteBalanceGain(HPVT_CAMERA_ID camera_id, float red_gain, float blue_gain);
HPVT_ERROR_CODE HPVTCameraChangeMeteringMode(HPVT_CAMERA_ID camera_id, HPVT_CAMERA_METERING_MODE mode);
HPVT_ERROR_CODE HPVTCameraChangeROI(HPVT_CAMERA_ID camera_id, HPVT_ROI_RECT rect);
/**
 * All camera parameters getting function
 */
HPVT_ERROR_CODE HPVTCameraGetAllParameters(HPVT_CAMERA_ID camera_id, HPVT_CAMERA_PARAMETERS *params);

/**
 * Individual camera parameter getting functions
 */
int HPVTCameraGetResolutionWidth(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetResolutionHeight(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetCaptureFramerate(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetBrightness(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetSaturation(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetSharpness(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetContrast(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_ISO HPVTCameraGetISO(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetShutterSpeed(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_EXPOSURE_MODE HPVTCameraGetExposureMode(HPVT_CAMERA_ID camera_id);
int HPVTCameraGetExposureCompensation(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_AWB_MODE HPVTCameraGetWhiteBalanceMode(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetWhiteBalanceRedGain(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetWhiteBalanceBlueGain(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_METERING_MODE HPVTCameraGetMeteringMode(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetROILeft(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetROITop(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetROIWidth(HPVT_CAMERA_ID camera_id);
float HPVTCameraGetROIHeight(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_ROTATION HPVTCameraGetRotaion(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_FLIP HPVTCameraGetFlip(HPVT_CAMERA_ID camera_id);
HPVT_CAMERA_DRC_LEVEL_TYPE HPVTCameraGetDRCLevel(HPVT_CAMERA_ID camera_id);

/**
 * Open video transmission session
 */
HPVT_ERROR_CODE HPVTVideoOpenConnection(void);

/**
 * Close video transmission session
 */
HPVT_ERROR_CODE HPVTVideoCloseConnection(void);

/**
 * Get current video transmission session state
 */
HPVT_VIDEO_CONNECTION_STATE HPVTVideoGetConnectionState(void);

/**
 * Set the timeout for video transmission
 */
HPVT_ERROR_CODE HPVTVideoSetConnectionTimeout(int timeout);

/**
 * Get the timeout setting for video transmission
 */
int HPVTVideoGetConnectionTimeout(void);

/**
 * Set the waiting time until reconnection starts
 */
HPVT_ERROR_CODE HPVTVideoSetReconnectionWaitTime(int wait_time);

/**
 * Get the waiting time until reconnection starts
 */
int HPVTVideoGetReconnectionWaitTime(void);

/**
 * Enable sending control packets
 */
HPVT_ERROR_CODE HPVTVideoFeedbackControlEnable(void);

/**
 * Disable sending control packets
 */
HPVT_ERROR_CODE HPVTVideoFeedbackControlDisable(void);

/**
 * Returns '1' if sending control packets is enabled.
 * Returns '0' if sending control packets is disabled.
 */
int HPVTVideoFeedbackControlIsEnabled(void);

/**
 * Set the feedback interval for video transmission
 */
HPVT_ERROR_CODE HPVTVideoSetFeedbackInterval(int interval);

/**
 * Get the feedback interval setting for video transmission
 */
int HPVTVideoGetFeedbackInterval(void);

/**
 * Enable pace control transmission
 */
HPVT_ERROR_CODE HPVTVideoPaceControlEnable(void);

/**
 * Disable pace control transmission
 */
HPVT_ERROR_CODE HPVTVideoPaceControlDisable(void);

/**
 * Returns '1' if pace control transmission is enabled.
 * Returns '0' if pace control transmission is disabled.
 */
int HPVTVideoPaceControlIsEnabled(void);

/**
 * Set FEC level to transmitter
 */
HPVT_ERROR_CODE HPVTVideoSetFECLevel(int level);

/**
 * Get current FEC level
 */
int HPVTVideoGetFECLevel(void);

/**
 * Enable preview on transmitter side
 */
HPVT_ERROR_CODE HPVTVideoPreviewEnable(void);

/**
 * Disable preview on transmitter side
 */
HPVT_ERROR_CODE HPVTVideoPreviewDisable(void);

/**
 * Returns '1' if preview is enabled.
 * Returns '0' if preview is disabled.
 */
int HPVTVideoPreviewIsEnabled(void);

/**
 * Enable video transmission
 */
HPVT_ERROR_CODE HPVTVideoTransmissionEnable(void);

/**
 * Disable video transmission
 */
HPVT_ERROR_CODE HPVTVideoTransmissionDisable(void);

/**
 * Returns '1' if transmission is enabled.
 * Returns '0' if transmission is disabled.
 */
int HPVTVideoTransmissionIsEnabled(void);


/**
 * All video encode parameters setting function
 */
HPVT_ERROR_CODE HPVTVideoEncodeSetAllParameters(HPVT_VIDEO_ENCODE_PARAMETERS* params);

/**
 * Individual video encode parameter changing functions
 */
HPVT_ERROR_CODE HPVTVideoEncodeChangeBitrate(int bitrate);
HPVT_ERROR_CODE HPVTVideoEncodeChangeFramerate(int framerate);
HPVT_ERROR_CODE HPVTVideoEncodeChangeIFrameInteval(int interval);

/**
 * All video encode parameters getting function
 */
HPVT_ERROR_CODE HPVTVideoEncodeGetAllParameters(HPVT_VIDEO_ENCODE_PARAMETERS* params);
/**
 * Individual video encode parameter getting functions
 */
int HPVTVideoEncodeGetBitrate(void);
int HPVTVideoEncodeGetFramerate(void);
int HPVTVideoEncodeGetIFrameInterval(void);
HPVT_H264_AVC_PROFILE_TYPE HPVTVideoEncodeGetProfile(void);
int HPVTVideoEncodeGetResolutionWidth(void);
int HPVTVideoEncodeGetResolutionHeight(void);

/**
 *
 */
HPVT_ERROR_CODE HPVTVideoExecuteManualWhiteBalance(int sync);

/**
 *
 */
HPVT_ERROR_CODE HPVTVideoCancelManualWhiteBalance(void);

/**
 *
 */
HPVT_VIDEO_CAMERA_MWB_STATE HPVTVideoGetManualWhiteBalanceState(void);

/**
 *
 */
HPVT_ERROR_CODE HPVTVideoDeleteManualWhiteBalanceConfigFile(void);

/**
 *
 */
HPVT_ERROR_CODE HPVTImageEncodeGetAllParameters(HPVT_CAMERA_ID camera_id, HPVT_IMAGE_ENCODE_PARAMETERS* params);

/**
 *
 */
HPVT_ERROR_CODE HPVTImageEncodeSetAllParameters(HPVT_CAMERA_ID camera_id, HPVT_IMAGE_ENCODE_PARAMETERS* params);

/**
 *
 */
int HPVTImageEncodeGetJPEGQuality(HPVT_CAMERA_ID camera_id);

/**
 *
 */
HPVT_ERROR_CODE HPVTImageEncodeChangeJPEGQuality(HPVT_CAMERA_ID camera_id, int quality);


/**
 * Overwrite Exif information of JPEG image data
 */
HPVT_ERROR_CODE HPVTImageEncodeGetExifTagModel(HPVT_CAMERA_ID camera_id, int max_length, char *buffer);
HPVT_ERROR_CODE HPVTImageEncodeSetExifTagModel(HPVT_CAMERA_ID camera_id, char *buffer, int length);
HPVT_ERROR_CODE HPVTImageEncodeUnsetExifTagModel(HPVT_CAMERA_ID camera_id);
HPVT_ERROR_CODE HPVTImageEncodeGetExifTagMake(HPVT_CAMERA_ID camera_id, int max_length, char *buffer);
HPVT_ERROR_CODE HPVTImageEncodeSetExifTagMake(HPVT_CAMERA_ID camera_id, char *buffer, int length);
HPVT_ERROR_CODE HPVTImageEncodeUnsetExifTagMake(HPVT_CAMERA_ID camera_id);

/**
 * Register callback function to be called when creating still image data
 */
HPVT_ERROR_CODE HPVTStillSetCallbackOnCreate(void (*callback)(HPVT_CAMERA_ID camera_id, uint32_t data_length));

/**
 * Unregister callback function to be called when creating still image data
 */
HPVT_ERROR_CODE HPVTStillUnsetCallbackOnCreate(void);

/**
 * Get the image data in JPEG format from the camera
 */
HPVT_ERROR_CODE HPVTStillGetJPEGImage(HPVT_CAMERA_ID camera_id, void *data, uint32_t max_size, uint32_t *length);


/**
 * Enable displaying debug status on receiver side
 */
HPVT_ERROR_CODE HPVTVideoDebugDisplayEnable(void);

/**
 * Disable displaying debug status on receiver side
 */
HPVT_ERROR_CODE HPVTVideoDebugDisplayDisable(void);

/**
 * Returns '1' if displaying debug status is enabled.
 * Returns '0' if displaying debug status is disabled.
 */
int HPVTVideoDebugDisplayIsEnabled(void);

/**
 * Set the buffering delay time parameter on receiver side
 */
HPVT_ERROR_CODE HPVTVideoSetBufferingDelayTime(int delay_time);

/**
 * Get the buffering delay time parameter on receiver side
 */
int HPVTVideoGetBufferingDelayTime(void);

/**
 * Set the display strictness parameter on receiver side
 */
HPVT_ERROR_CODE HPVTVideoSetDisplayStrictness(int strictness);

/**
 * Get the display strictness parameter on receiver side
 */
int HPVTVideoGetDisplayStrictness(void);

/**
 * Get the video bit rate value from the video decoder
 */
int HPVTVideoDecodeGetBitrate(void);

/**
 * Get the video frame rate value from the video decoder
 */
int HPVTVideoDecodeGetFramerate(void);

/**
 * Get the video I-frame interval rate value from the video decoder
 */
int HPVTVideoDecodeGetIFrameInterval(void);

/**
 * Get the video width from the video decoder
 */
int HPVTVideoDecodeGetResolutionWidth(void);

/**
 * Get the video height from the video decoder
 */
int HPVTVideoDecodeGetResolutionHeight(void);

/**
 * Get the screen width from the video decoder
 */
int HPVTVideoDecodeGetScreenWidth(void);

/**
 * Get the screen height from the video decoder
 */
int HPVTVideoDecodeGetScreenHeight(void);

/**
 * Calculate the horizontal screen position corresponding to video X-coordinate
 */
int HPVTVideoDecodeCalculateScreenPositionX(int point_x);

/**
 * Calculate the vertical screen position corresponding to video Y-coordinate
 */
int HPVTVideoDecodeCalculateScreenPositionY(int point_y);

/**
 * Calculate the horizontal screen length corresponding to video X-coordinate
 */
int HPVTVideoDecodeCalculateScreenLengthX(int length_x);

/**
 * Calculate the vertical screen length corresponding to video Y-coordinate
 */
int HPVTVideoDecodeCalculateScreenLengthY(int length_y);

/**
 * Register callback function to be called when decoding video frame data
 */
HPVT_ERROR_CODE HPVTVideoSetCallbackOnDecode(void (*callback)(uint32_t data_length, int width, int height));

/**
 * Unregister callback function to be called when decoding video frame data
 */
HPVT_ERROR_CODE HPVTVideoUnsetCallbackOnDecode(void);

/**
 * Get the image data in I420(YUV420) format from transmitter
 */
HPVT_ERROR_CODE HPVTVideoGetYUVImageFromVideo(void *data, uint32_t max_size, uint32_t *length);


/**
 * Send non-video data
 */
HPVT_ERROR_CODE HPVTVideoSendContent(void *content_data, uint32_t content_length, uint16_t *sequence_number);

/**
 * Register callback function to be called when receiving an acknowledgment
 */
HPVT_ERROR_CODE HPVTVideoSetCallbackOnNotifyAck(void (*callback)(uint16_t sequence_number, HPVT_ACK_ADDITIONAL_DATA *additional_data));

/**
 * Unregister callback function to be called when receiving an acknowledgment
 */
HPVT_ERROR_CODE HPVTVideoUnsetCallbackOnNotifyAck(void);

/**
 * Send acknowledgment
 */
HPVT_ERROR_CODE HPVTVideoNotifyAck(uint16_t sequence_number);

/**
 * Send acknowledgment with any data
 */
HPVT_ERROR_CODE HPVTVideoNotifyAckWithData(uint16_t sequence_number, void *buffer, uint32_t length);

/**
 * Register callback function to be called when receiving non-video data
 */
HPVT_ERROR_CODE HPVTVideoSetCallbackOnReceiveContent(void (*callback)(void *content_data, uint32_t content_length, uint16_t sequence_number));

/**
 * Unregister callback function to be called when receiving non-video data
 */
HPVT_ERROR_CODE HPVTVideoUnsetCallbackOnReceiveContent(void);

/**
 * Get current traffic information
 */
HPVT_NETWORK_TRAFFIC_INFO* HPVTGetNetworkTrafficInfoSelf(void);

/**
 * Get current traffic information
 */
HPVT_NETWORK_TRAFFIC_INFO* HPVTGetNetworkTrafficInfoPeer(void);

/**
 * Get current throughput of sending packets
 */
int HPVTVideoGetSendThroughputSelf(void);

/**
 * Get current throughput of sending packets
 */
int HPVTVideoGetSendThroughputPeer(void);

/**
 * Get current throughput of receiving packets
 */
int HPVTVideoGetReceiveThroughputSelf(void);

/**
 * Get current throughput of receiving packets
 */
int HPVTVideoGetReceiveThroughputPeer(void);

/**
 * Get current packet loss rate
 */
float HPVTVideoGetPacketLossRateSelf(void);

/**
 * Get current packet loss rate
 */
float HPVTVideoGetPacketLossRatePeer(void);

/**
 * Get current round trip time
 */
float HPVTVideoGetRoundTripTimeSelf(void);

/**
 * Get current round trip time
 */
float HPVTVideoGetRoundTripTimePeer(void);

/**
 * Register callback function to be called when updating feedback information
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetCallbackOnUpdate(void (*callback)(void));

/**
 * unregister callback function to be called when updating feedback information
 */
HPVT_ERROR_CODE HPVTAdaptiveControlUnsetCallbackOnUpdate(void);

/**
 * Enable adaptive control video encoding
 */
HPVT_ERROR_CODE HPVTAdaptiveControlEnable(void);

/**
 * Disable adaptive control video encoding
 */
HPVT_ERROR_CODE HPVTAdaptiveControlDisable(void);

/**
 * Returns '1' if adaptive control video encoding is enabled.
 * Returns '0' if adaptive control video encoding is disabled.
 */
int HPVTAdaptiveControlIsEnabled(void);

/**
 * Get the priority for adaptive control
 */
HPVT_VIDEO_ADAPTIVE_CONTROL_PRIORITY HPVTAdaptiveControlGetPriority(void);

/**
 * Set the priority for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetPriority(HPVT_VIDEO_ADAPTIVE_CONTROL_PRIORITY priority);

/**
 * Get the measurement interval for adaptive control
 */
int HPVTAdaptiveControlGetMeasurementInterval(void);

/**
 * Set the measurement interval for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetMeasurementInterval(int interval);

/**
 * Get the limit of variation for adaptive control
 */
int HPVTAdaptiveControlGetLimitOfVariation(void);

/**
 * Set the limit of variation for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetLimitOfVariation(int limit_amount);

/**
 * Get the measurement interval of bit rate increase judgment for adaptive control
 */
int HPVTAdaptiveControlGetBitrateIncreaseInterval(void);

/**
 * Set the measurement interval of bit rate increase judgment for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetBitrateIncreaseInterval(int interval);

/**
 * Get the unreceived rate of bit rate increase judgment for adaptive control
 */
float HPVTAdaptiveControlGetBitrateIncreaseUnreceivedRate(void);

/**
 * Set the unreceived rate of bit rate increase judgment for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetBitrateIncreaseUnreceivedRate(float rate);

/**
 * Get the minimum video bit rate for adaptive control
 */
int HPVTAdaptiveControlGetMinimumBitrate(void);

/**
 * Set the minimum video bit rate for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetMinimumBitrate(int bitrate);

/**
 * Get the maximum video bit rate for adaptive control
 */
int HPVTAdaptiveControlGetMaximumBitrate(void);

/**
 * Set the maximum video bit rate for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetMaximumBitrate(int bitrate);

/**
 * Get the minimum video frame rate for adaptive control
 */
int HPVTAdaptiveControlGetMinimumFramerate(void);

/**
 * Set the minimum video frame rate for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetMinimumFramerate(int framerate);

/**
 * Get the maximum video frame rate for adaptive control
 */
int HPVTAdaptiveControlGetMaximumFramerate(void);

/**
 * Set the maximum video frame rate for adaptive control
 */
HPVT_ERROR_CODE HPVTAdaptiveControlSetMaximumFramerate(int framerate);

/**
 * Enable recording video frames
 */
HPVT_ERROR_CODE HPVTVideoRecordEnable(void);

/**
 * Disable recording video frames
 */
HPVT_ERROR_CODE HPVTVideoRecordDisable(void);

/**
 * Returns '1' if recording video frames is enabled.
 * Returns '0' if recording video frames is disabled.
 */
int HPVTVideoRecordIsEnabled(void);

/**
 * Get the maximum size of files in the video storage directory
 */
int HPVTVideoGetRecordMaxStorageSize(void);

/**
 * Set the maximum size of files in the video storage directory
 */
HPVT_ERROR_CODE HPVTVideoSetRecordMaxStorageSize(int max_size);

/**
 * Get the recording interval
 */
int HPVTVideoGetRecordMaxTime(void);

/**
 * Set the recording interval
 */
HPVT_ERROR_CODE HPVTVideoSetRecordMaxTime(int interval);

/**
 * Enable RTSP Stream of IPCamera
 */
HPVT_ERROR_CODE HPVTVideoRTSPStreamEnable(void);

/**
 * Disable RTSP Stream of IPCamera
 */
HPVT_ERROR_CODE HPVTVideoRTSPStreamDisable(void);

/**
 * Returns '1' if RTSP video stream is enabled.
 * Returns '0' if RTSP video stream is disabled.
 */
int HPVTVideoRTSPStreamIsEnabled(void);


/**
 * Get the number of activation video encoder
 */
uint32_t HPVTVideoGetNumberOfActivationEncoder(void);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* HPVTCONTROL_H_ */
