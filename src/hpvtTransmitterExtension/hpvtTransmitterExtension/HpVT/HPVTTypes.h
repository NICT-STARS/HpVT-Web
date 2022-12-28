#ifndef HPVTTYPES_H_
#define HPVTTYPES_H_

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#include <stdint.h>

/** Error code definitions */
#define HPVT_ERROR_CODE   int
#define HPVT_ERROR_NONE   (0)

/** Camera ID definitions */
#define HPVT_CAMERA_ID    int
#define HPVT_CAMERA_ID_0  (0)   /* first camera */
#define HPVT_CAMERA_ID_1  (1)   /* second camera */

/** Camera Type definitions */
#define HPVT_CAMERA_TYPE    int
#define HPVT_CAMERA_TYPE_STANDARD   (1)   /* Raspberry Pi camera */
#define HPVT_CAMERA_TYPE_IPCAMERA   (2)   /* IP camera */
#define HPVT_CAMERA_TYPE_SDI_CAMERA (3)   /* SDI camera */

/** Camera shooting mode definitions */
#define HPVT_CAMERA_SHOOTING_MODE             int
#define HPVT_CAMERA_SHOOTING_MODE_NO_SETTING  (0)
#define HPVT_CAMERA_SHOOTING_MODE_VIDEO       (1)
#define HPVT_CAMERA_SHOOTING_MODE_STILL       (2)

/** Camera state definitions */
#define HPVT_CAMERA_STATE                 int
#define HPVT_CAMERA_STATE_INACTIVE        (0)    /* Camera is not prepared */
#define HPVT_CAMERA_STATE_ACTIVE_STOPPED  (1)    /* Camera is prepared and not shooting */
#define HPVT_CAMERA_STATE_ACTIVE_RUNNING  (2)    /* Camera is prepared and shooting */

/** Rotation angle definitions */
#define HPVT_CAMERA_ROTATION         int
#define HPVT_CAMERA_ROTATION_NONE    (0)     /* Not rotate */
#define HPVT_CAMERA_ROTATION_90      (90)    /* Rotate 90 degrees */
#define HPVT_CAMERA_ROTATION_180     (180)   /* Rotate 180 degrees */
#define HPVT_CAMERA_ROTATION_270     (270)   /* Rotate 270 degrees */

/** ISO speed definitions */
#define HPVT_CAMERA_ISO           int
#define HPVT_CAMERA_ISO_AUTO      (0)        /* Automatic ISO */
#define HPVT_CAMERA_ISO_100       (100)
#define HPVT_CAMERA_ISO_160       (160)
#define HPVT_CAMERA_ISO_200       (200)
#define HPVT_CAMERA_ISO_250       (250)
#define HPVT_CAMERA_ISO_320       (320)
#define HPVT_CAMERA_ISO_400       (400)
#define HPVT_CAMERA_ISO_500       (500)
#define HPVT_CAMERA_ISO_640       (640)
#define HPVT_CAMERA_ISO_800       (800)

/** Flip type definitions */
#define HPVT_CAMERA_FLIP             int
#define HPVT_CAMERA_FLIP_NONE        (0)   /* Not flip */
#define HPVT_CAMERA_FLIP_VERTICAL    (1)   /* vertical flip */
#define HPVT_CAMERA_FLIP_HORIZONTAL  (2)   /* horizontal flip */
#define HPVT_CAMERA_FLIP_BOTH        (3)   /* vertical and horizontal flip */

/** Auto white balance mode definitions */
#define HPVT_CAMERA_AWB_MODE               int
#define HPVT_CAMERA_AWB_MODE_OFF           (0)  /* turn off white balance calculation */
#define HPVT_CAMERA_AWB_MODE_AUTO1         (1)  /* automatic mode */
#define HPVT_CAMERA_AWB_MODE_SUNLIGHT      (2)  /* sunny mode */
#define HPVT_CAMERA_AWB_MODE_CLOUDY        (3)  /* cloudy mode */
#define HPVT_CAMERA_AWB_MODE_SHADE         (4)  /* shade mode */
#define HPVT_CAMERA_AWB_MODE_TUNGSTEN      (5)  /* tungsten lighting mode */
#define HPVT_CAMERA_AWB_MODE_FLUORESCENT   (6)  /* fluorescent lighting mode */
#define HPVT_CAMERA_AWB_MODE_INCANDESCENT  (7)  /* incandescent lighting mode */
#define HPVT_CAMERA_AWB_MODE_FLASH         (8)  /* flash mode */
#define HPVT_CAMERA_AWB_MODE_AUTO2         (17) /* automatic mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_SUNLIGHT2     (18) /* sunny mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_CLOUDY2       (19) /* cloudy mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_SHADE2        (20) /* shade mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_TUNGSTEN2     (21) /* tungsten lighting mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_FLUORESCENT2  (22) /* fluorescent lighting mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_INCANDESCENT2 (23) /* incandescent lighting mode for M12/CS mount lens */
#define HPVT_CAMERA_AWB_MODE_FLASH2        (24) /* flash mode for M12/CS mount lens */

/** Metering mode definitions */
#define HPVT_CAMERA_METERING_MODE          int
#define HPVT_CAMERA_METERING_MODE_AVERAGE  (0)  /* average the whole frame for metering */
#define HPVT_CAMERA_METERING_MODE_SPOT     (1)  /* spot metering */
#define HPVT_CAMERA_METERING_MODE_MATRIX   (2)  /* matrix metering */
#define HPVT_CAMERA_METERING_MODE_BACKLIT  (3)  /* assume a backlit image */

/** Exposure mode definitions */
#define HPVT_CAMERA_EXPOSURE_MODE                     int
#define HPVT_CAMERA_EXPOSURE_MODE_OFF                 (0)    /* turn off */
#define HPVT_CAMERA_EXPOSURE_MODE_AUTO                (1)    /* use automatic exposure mode */
#define HPVT_CAMERA_EXPOSURE_MODE_NIGHT               (2)    /* select setting for night shooting */
#define HPVT_CAMERA_EXPOSURE_MODE_BACKLIGHT           (3)    /* select setting for backlit subject */
#define HPVT_CAMERA_EXPOSURE_MODE_SPOTLIGHT           (4)    /* select setting for spotlit subject */
#define HPVT_CAMERA_EXPOSURE_MODE_SPORTS              (5)    /* select setting for sports (fast shutter etc.) */
#define HPVT_CAMERA_EXPOSURE_MODE_SNOW                (6)    /* select setting optimized for snowy scenery */
#define HPVT_CAMERA_EXPOSURE_MODE_BEACH               (7)    /* select setting optimized for beach */
#define HPVT_CAMERA_EXPOSURE_MODE_VERY_LONG           (10)   /* select setting for long exposures */
#define HPVT_CAMERA_EXPOSURE_MODE_FIXED_FPS           (11)   /* constrain fps to a fixed value */
#define HPVT_CAMERA_EXPOSURE_MODE_NIGHT_WITH_PREVIEW  (12)   /* select setting for night preview */
#define HPVT_CAMERA_EXPOSURE_MODE_ANTISHAKE           (13)   /* antishake mode */
#define HPVT_CAMERA_EXPOSURE_MODE_FIREWORKS           (14)   /* select setting optimized for fireworks */


/** Camera shutter speed definitions */
#define HPVT_CAMERA_SHUTTER_SPEED_AUTO  (0)  /* Automatic */

/** Dynamic Range Compression level definitions*/
#define HPVT_CAMERA_DRC_LEVEL_TYPE          int
#define HPVT_CAMERA_DRC_LEVEL_OFF           (0)
#define HPVT_CAMERA_DRC_LEVEL_LOW           (1)
#define HPVT_CAMERA_DRC_LEVEL_MEDIUM        (2)
#define HPVT_CAMERA_DRC_LEVEL_HIGH          (3)


/** H.264/AVC profile definitions*/
#define HPVT_H264_AVC_PROFILE_TYPE          int
#define HPVT_H264_AVC_PROFILE_BASELINE      (1)
#define HPVT_H264_AVC_PROFILE_MAIN          (2)
#define HPVT_H264_AVC_PROFILE_HIGH          (8)


/** Video transmission session state definitions */
#define HPVT_VIDEO_CONNECTION_STATE               int
#define HPVT_VIDEO_CONNECTION_STATE_CLOSED        (0)   /* disabled connection attempt */
#define HPVT_VIDEO_CONNECTION_STATE_DISCONNECTED  (1)   /* disconnected the connection */
#define HPVT_VIDEO_CONNECTION_STATE_CONNECTING    (2)   /* trying to connect to other host */
#define HPVT_VIDEO_CONNECTION_STATE_WAITING       (3)   /* waiting for a connection from other host */
#define HPVT_VIDEO_CONNECTION_STATE_CONNECTED     (8)   /* connected with other host */

/** status definitions */
#define HPVT_VIDEO_CAMERA_MWB_STATE             int
#define HPVT_VIDEO_CAMERA_MWB_STATE_FAILURE     (-1)
#define HPVT_VIDEO_CAMERA_MWB_STATE_INIT        (0)
#define HPVT_VIDEO_CAMERA_MWB_STATE_PROCESSING  (1)
#define HPVT_VIDEO_CAMERA_MWB_STATE_SUCCESS     (2)


/** Video adaptive control priority behavior definitions */
#define HPVT_VIDEO_ADAPTIVE_CONTROL_PRIORITY          int
#define HPVT_VIDEO_ADAPTIVE_CONTROL_PRIORITY_MOTION   (1)  /* frame rate priority */
#define HPVT_VIDEO_ADAPTIVE_CONTROL_PRIORITY_PICTURE  (2)  /* image quality priority */


/** Image color format for analysis definitions */
#define HPVT_IMAGE_COLOR_FORMAT_TYPE       int
#define HPVT_IMAGE_COLOR_FORMAT_TYPE_RGB   (1)  /* RGB */
#define HPVT_IMAGE_COLOR_FORMAT_TYPE_GRAY  (2)  /* gray scale */

/** Receiving video frame image mode for analysis */
#define HPVT_SYNCHRONOUS_TRUE   (1)  /* Synchronous mode */
#define HPVT_SYNCHRONOUS_FALSE  (0)  /* Asynchronous mode */


typedef struct hpvt_roi_rect_s {
	float left;
	float top;
	float width;
	float height;
} HPVT_ROI_RECT;

/** Definition of camera setting parameters */
typedef struct hpvt_camera_parameters_s {

	int width;
	int height;
	int framerate;
	int sharpness;
	int contrast;
	int brightness;
	int saturation;
	HPVT_CAMERA_ISO iso;
	int shutter_speed;
	HPVT_CAMERA_EXPOSURE_MODE exposure_mode;
	int exposure_compensation;
	HPVT_CAMERA_AWB_MODE awb_mode;
	float awb_red_gain;
	float awb_blue_gain;
	HPVT_CAMERA_METERING_MODE metering_mode;
	HPVT_CAMERA_DRC_LEVEL_TYPE drc_level;
	HPVT_ROI_RECT roi;
	HPVT_CAMERA_ROTATION rotation;
	HPVT_CAMERA_FLIP flip;

} HPVT_CAMERA_PARAMETERS;

/** Definition of video encode setting parameters */
typedef struct hpvt_video_encode_parameters_s {
	int bitrate;
	int framerate;
	int i_frame_interval;
	HPVT_H264_AVC_PROFILE_TYPE profile;

} HPVT_VIDEO_ENCODE_PARAMETERS;

/** Definition of image encode setting parameters */
typedef struct hpvt_camera_image_encode_parameters_s {
	int jpeg_quality;

} HPVT_IMAGE_ENCODE_PARAMETERS;

/** Definition of additional data to the acknowledgment packet */
typedef struct hpvt_acknowledgment_addtional_data_s {
	void *buffer;
	int length;
} HPVT_ACK_ADDITIONAL_DATA;


/** Definition of image analysis setting parameters */
typedef struct hpvt_image_analysis_parameters_s {

	int width;
	int height;
	HPVT_IMAGE_COLOR_FORMAT_TYPE color_format;
	struct {
		int enabled;
		int left;
		int top;
	} crop;
	int sampling_framerate;

} HPVT_IMAGE_ANALYSIS_PARAMETERS;


/** Definition of image metadata for analysis */
typedef struct hpvt_image_metadata_s {
	void *p_data;
	int size;                 /* Length of data */
	int id;                   /* Identifier number for image data*/
	uint64_t captured_time;   /* Image captured time in epoch millisecond */
	HPVT_IMAGE_COLOR_FORMAT_TYPE color_format;
	int width;
	int height;
} HPVT_IMAGE_METADATA;


/** Definition of network traffic information */
typedef struct HPVT_NETWORK_TRAFFIC_INFO {
	struct {
		struct {
			uint64_t packets;
			uint64_t bytes;
		} control;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} payload;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} redundancy;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} dropped;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} cancel;
	} sent;
	struct {
		struct {
			uint64_t packets;
			uint64_t bytes;
		} control;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} payload;
		struct {
			uint64_t packets;
			uint64_t bytes;
		} redundancy;
		struct {
			uint64_t packets;
		} unexpected;
		struct {
			uint64_t packets;
		} reordering;
		struct {
			struct {
				uint64_t packets;
				uint64_t bytes;
			} total;
			struct {
				uint64_t packets;
				uint64_t bytes;
			} duplicate;
			struct {
				uint64_t packets;
				uint64_t bytes;
			} overrun;
			struct {
				uint64_t packets;
				uint64_t bytes;
			} outofrange;
			struct {
				uint64_t packets;
				uint64_t bytes;
			} invalid;
			struct {
				uint64_t packets;
				uint64_t bytes;
			} broken;
		} dropped;
	} received;
} HPVT_NETWORK_TRAFFIC_INFO;


#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* HPVTTYPES_H_ */
