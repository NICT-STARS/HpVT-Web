#ifndef HPVTIMAGEANALYSIS_H_
#define HPVTIMAGEANALYSIS_H_

#include "HPVTTypes.h"

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/**
 * Enable creation of analysis images
 */
HPVT_ERROR_CODE HPVTAnalysisEnable(void);

/**
 * Disable creation of analysis images
 */
HPVT_ERROR_CODE HPVTAnalysisDisable(void);

/**
 * Returns '1' if creation of analysis images is enabled.
 * Returns '0' if creation of analysis images is disabled.
 */
int HPVTAnalysisIsEnabled(void);

/**
 * All image analysis parameters getting function
 */
HPVT_ERROR_CODE HPVTAnalysisSetAllParameters(HPVT_IMAGE_ANALYSIS_PARAMETERS* params);

/**
 * All image analysis parameters setting function
 */
HPVT_ERROR_CODE HPVTAnalysisGetAllParameters(HPVT_IMAGE_ANALYSIS_PARAMETERS* params);

/**
 * Individual image analysis parameter getting functions
 */
HPVT_IMAGE_COLOR_FORMAT_TYPE HPVTAnalysisGetImageColorFormat(void);
int HPVTAnalysisGetImageSamplingFramerate(void);
int HPVTAnalysisGetImageResolutionWidth(void);
int HPVTAnalysisGetImageResolutionHeight(void);
int HPVTAnalysisImageCroppingIsEnabled(void);
int HPVTAnalysisGetImageCropPositionLeft(void);
int HPVTAnalysisGetImageCropPositionTop(void);

/**
 * Register callback function to be called when capturing frame image and making metadata
 */
HPVT_ERROR_CODE HPVTAnalysisSetCallbackOnCapture(void (*callback)(HPVT_IMAGE_METADATA* metadata));

/**
 * Unregister callback function to be called when capturing frame image and making metadata
 */
HPVT_ERROR_CODE HPVTAnalysisUnsetCallbackOnCapture(void);

/**
 * Register callback function to be called when creating frame image data
 */

HPVT_ERROR_CODE HPVTAnalysisSetCallbackOnCreateIplImage(void (*callback)(HPVT_IMAGE_METADATA* metadata, IplImage *img));
#ifndef HPVT_USE_ONLY_OPENCV_C_API
HPVT_ERROR_CODE HPVTAnalysisSetCallbackOnCreateMatImage(void (*callback)(HPVT_IMAGE_METADATA* metadata, cv::Mat img));
#ifdef HPVT_USE_OPENCV3
HPVT_ERROR_CODE HPVTAnalysisSetCallbackOnCreateUMatImage(void (*callback)(HPVT_IMAGE_METADATA* metadata, cv::UMat img));
#endif
#endif

/**
 * Unregister callback function to be called when creating frame image data
 */
void HPVTAnalysisUnsetCallbackOnCreateImage(void);

/**
 * Get the frame image data
 */

HPVT_ERROR_CODE HPVTAnalysisGetFrameIplImage(HPVT_IMAGE_METADATA *metadata, IplImage *img, int sync);
#ifndef HPVT_USE_ONLY_OPENCV_C_API
HPVT_ERROR_CODE HPVTAnalysisGetFrameMatImage(HPVT_IMAGE_METADATA *metadata, cv::Mat img, int sync);
#ifdef HPVT_USE_OPENCV3
HPVT_ERROR_CODE HPVTAnalysisGetFrameUMatImage(HPVT_IMAGE_METADATA *metadata, cv::UMat img, int sync);
#endif
#endif

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* HPVTIMAGEANALYSIS_H_ */
