#ifndef HPVT_API_HPVTFILERECORD_H_
#define HPVT_API_HPVTFILERECORD_H_

#include "HPVTTypes.h"

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/**
 * Returns '1' if recording still image file is enabled.
 * Returns '0' if recording still image file is disabled.
 */
int HPVTSSCImageWritingIsEnabled(void);

/**
 * Enable recording image file
 */
HPVT_ERROR_CODE HPVTSSCImageWritingEnable(void);

/**
 * Disable recording image file
 */
HPVT_ERROR_CODE HPVTSSCImageWritingDisable(void);

/**
 * Get the interval of capturing image
 */
int HPVTSSCImageGetInterval(void);

/**
 * Set the interval of capturing image
 */
HPVT_ERROR_CODE HPVTSSCImageSetInterval(int interval);

/**
 * Get the JPEG quality
 */
int HPVTSSCImageGetQuality(void);

/**
 * Set the JPEG quality
 */
HPVT_ERROR_CODE HPVTSSCImageSetQuality(int quality);

/**
 * Get the maximum count of files in the directory
 */
int HPVTSSCImageGetFileMaxCount(void);

/**
 * Set the maximum count of files in the directory
 */
HPVT_ERROR_CODE HPVTSSCImageSetFileMaxCount(int max_count);

/**
 * Returns '1' if image file rotation is enabled.
 * Returns '0' if image file rotation is disabled.
 */
int HPVTSSCImageFileRotationIsEnabled(void);

/**
 * Enable image file rotation
 */
HPVT_ERROR_CODE HPVTSSCImageFileRotationEnable(void);

/**
 * Disable image file rotation
 */
HPVT_ERROR_CODE HPVTSSCImageFileRotationDisable(void);

/**
 * Returns '1' if recording video frames is enabled.
 * Returns '0' if recording video frames is disabled.
 */
int HPVTSSCVideoWritingIsEnabled(void);

/**
 * Enable recording video frames
 */
HPVT_ERROR_CODE HPVTSSCVideoWritingEnable(void);

/**
 * Disable recording video frames
 */
HPVT_ERROR_CODE HPVTSSCVideoWritingDisable(void);

/**
 * Get the recording interval
 */
int HPVTSSCVideoGetInterval(void);

/**
 * Set the recording interval
 */
HPVT_ERROR_CODE HPVTSSCVideoSetInterval(int interval);

/**
 * Get the recording duration
 */
int HPVTSSCVideoGetDuration(void);

/**
 * Set the recording duration
 */
HPVT_ERROR_CODE HPVTSSCVideoSetDuration(int duration);

/**
 * Get the maximum size of files in the directory
 */
int HPVTSSCVideoGetFileMaxSize(void);

/**
 * Set the maximum size of files in the directory
 */
HPVT_ERROR_CODE HPVTSSCVideoSetFileMaxSize(int max_size);

/**
 * Get the maximum count of files in the directory
 */
int HPVTSSCVideoGetFileMaxCount(void);

/**
 * Set the maximum count of files in the directory
 */
HPVT_ERROR_CODE HPVTSSCVideoSetFileMaxCount(int max_count);

/**
 * Returns '1' if video file rotation is enabled.
 * Returns '0' if video file rotation is disabled.
 */
int HPVTSSCVideoFileRotationIsEnabled(void);

/**
 * Enable video file rotation
 */
HPVT_ERROR_CODE HPVTSSCVideoFileRotationEnable(void);

/**
 * Disable video file rotation
 */
HPVT_ERROR_CODE HPVTSSCVideoFileRotationDisable(void);

/**
 * Get the maximum size of files in the video storage directory
 */
int HPVTSSCVideoGetMaxStorageSize(void);

/**
 * Set the maximum size of files in the video storage directory
 */
HPVT_ERROR_CODE HPVTSSCVideoSetMaxStorageSize(int max_size);


#ifdef __cplusplus
}
#endif /* __cplusplus */


#endif /* HPVT_API_HPVTFILERECORD_H_ */
