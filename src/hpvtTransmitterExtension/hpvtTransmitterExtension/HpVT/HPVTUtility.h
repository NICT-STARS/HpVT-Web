
#ifndef HPVTUTILITY_H_
#define HPVTUTILITY_H_

#include "HPVTTypes.h"


/**
 * Get the image data in openCV(cv::Mat) format from transmitter
 */
HPVT_ERROR_CODE HPVTCreateCVImageFromVideo(int width, int height, cv::Mat *img);


#endif /* API_HPVTUTILITY_H_ */
