/*
 ============================================================================
 Name        : BASE.h
 Author      : Clealink
 Version     :
 Copyright   : Your copyright notice
 Description : VCC-HD10ZM Camera API: header file
 ============================================================================
 */

#ifndef SRC_BASE_H_
#define SRC_BASE_H_


#ifdef	__cplusplus
extern "C" {
#endif


// to make stdio.h declare dprintf()
#define _POSIX_C_SOURCE  200809L

// to make glibc declare cfmakeraw()
#define _BSD_SOURCE
#define _DEFAULT_SOURCE

#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>

// to work with serial port
#include <termios.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Switch test Mode >>>>>>>>>>>>>>>>>>>>>>>>>>>> */

//#define DEBUG
#define DISPLAY_CMD

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Time intervals >>>>>>>>>>>>>>>>>>>>>>>>>>>> */

#define INIT_INTERVAL 8						// time needed buy INIT command to return
#define INTER_CMD_INTERVAL 0.0				// time between running consecutive commands
#define SET_CONFIRMSET_INTERVAL 0.5			// time interval between set and confirmSet functions
#define ZOOM_INTERVAL 20        			// time needed by camera to zoom to a specified value

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Serial Port: file pointer >>>>>>>>>>>>>>>>>>>>>>>>>> */

extern int serialPort_fd; 			       // serial port
extern FILE * serialPort_fp;               // serial port FILE pointer

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  MACROS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

/* Serial port file */
#define SERIAL_PORT "/dev/serial0"

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Error Code >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

#define out_error_code_0 0    // No error
#define out_error_code_1 1    // Invalid or out of range API argument(s)
#define out_error_code_2 2    // argument(s) value is not permissible
#define out_error_code_10 10  // Serial port could not be opened -- fopen() error (NULL return value)
#define out_error_code_11 11  // Serial port could not be closed -- fclose() error (non-zero return value)
#define out_error_code_12 12  // Serial port is not opened error -- NULL file pointer
#define out_error_code_20 20  // Failed to write command to serial port -- fprintf() error
#define out_error_code_30 30  // Failed to read camera reply from serial port -- fscanf() error (EOF)
#define out_error_code_31 31  // Unexpected number of returned values from camera
#define out_error_code_32 32  // Unexpected returned values from camera
#define out_error_code_40 40  // Camera is in wrong mode for the specified set command

/* Command id  */

typedef char * CMDID;

#define CMDID_VIDEO_FORMAT 1
#define CMDID_GAIN_MODE 2
#define CMDID_GAIN_VALUE 3
#define CMDID_GAIN_MAX_VALUE 4
#define CMDID_SHUTTER_MODE 5
#define CMDID_SHUTTER_VALUE 6
#define CMNDNUM_SHUTTER_LIMIT 7
#define CMDID_METERING_MODE 8
#define CMDID_SPOT_BLOCK 9
#define CMDID_AE_SPEED 10
#define CMDID_EXPOSURE_COMPENSATION_VALUE 11
#define CMDID_FLICKER_CANCEL 12
#define CMDID_GAIN_VALUE_PLUS_MINUS 13
#define CMDID_SHUTTER_SPEED_PLUS_MINUS 14
#define CMDID_IRIS_PLUS_MINUS 15

#define CMDID_WB_MODE 20
#define CMDID_PRESET 21
#define CMDID_BLUE_GAIN 22
#define CMDID_RED_GAIN 23
#define CMDID_ONE_PUSH_TRIGGER 24

#define CMDID_EDGE_LEVEL 30
#define CMDID_HDR_MODE 31
#define CMDID_HDR_RATIO_VALUE 32
#define CMDID_HDR_MBC_MODE 34
#define CMDID_CONTRAST 35
#define CMDID_MASTER_PEDESTAL 37
#define CMDID_RED_PEDESTAL 38
#define CMDID_GREEN_PEDESTAL 39
#define CMDID_BLUE_PEDESTAL 40
#define CMDID_RED_BALANCE 41
#define CMDID_GREEN_BALANCE 42
#define CMDID_BLUE_BALANCE 43
#define CMDID_COLOR_SATURATION 45
#define CMDID_SHADING_CORRECTION 48
#define CMDID_SHADING_CORRECTION_LEVEL 49
#define CMDID_NOISE_REDUCTION 51
#define CMDID_COLOR_CORRECTION 52
#define CMDID_COLOR_SUPPRESSION 53

#define CMDID_IRIS_MODE 61
#define CMDID_APERTURE_VALUE 64
#define CMDID_APERTURE_LIMIT 65
#define CMDID_ZOOM_DRIVE 66
#define CMDID_FOCUS_DRIVE 67
#define CMDID_FOCUS_MODE 68
#define CMDID_FOCUS_ONE_PUSH_TRIGGER 69
#define CMDID_IRCUT_FILTER_MODE 75
#define CMDID_AUTO_ICF_THRESHOLD 76

#define CMDID_OSD_UP_BUTTON 90
#define CMDID_OSD_DOWN_BUTTON 91
#define CMDID_OSD_R_BUTTON 92
#define CMDID_OSD_L_BUTTON 93
#define CMDID_OSD_CENTER_BUTTON 94
#define CMDID_MENU_COLOR 95
#define CMDID_HIGHLIGHT_COLOR 96

#define CMDID_CAMERA_SETTING_STORE 100
#define CMDID_CAMERA_SETTING_LOAD 101
#define CMDID_LTC_OFF_ON 103
#define CMDID_LTC_RESET 104

/* video format  */

typedef char * VIDEOFORMAT;
#define VIDEOFORMAT_1080p60fpsA 0
#define VIDEOFORMAT_1080p59fpsA 1
#define VIDEOFORMAT_1080p50fpsA 2
#define VIDEOFORMAT_1080p60fpsB 3
#define VIDEOFORMAT_1080p59fpsB 4
#define VIDEOFORMAT_1080p50fpsB 5
#define VIDEOFORMAT_1080i60fps 6
#define VIDEOFORMAT_1080i59fps 7
#define VIDEOFORMAT_1080i50fps 8
#define VIDEOFORMAT_1080p30fps 9
#define VIDEOFORMAT_1080p29fps 10
#define VIDEOFORMAT_1080p25fps 11
#define VIDEOFORMAT_1080p24fps 12
#define VIDEOFORMAT_1080p23fps 13
#define VIDEOFORMAT_720p60fps 14
#define VIDEOFORMAT_720p59fps 15
#define VIDEOFORMAT_720p50fps 16

/* gain mode  */

typedef char * GAINMODE;
#define GAINMODE_MANUAL 0
#define GAINMODE_AUTO 1

/* shutter mode  */

typedef char * SHUTTERMODE;
#define SHUTTERMODE_MANUAL 0
#define SHUTTERMODE_AUTO 1

/* metering mode  */

typedef char * METERINGRMODE;
#define METERINGRMODE_AVERAGE 0
#define METERINGRMODE_CENTER_WEIGHTED 1
#define METERINGRMODE_SPOT 2
#define METERINGRMODE_BACKLIGHT_COMPENSATION 3

/* Iris mode */

typedef char * IRISMODE;
#define IRISMODE_MANUAL 0
#define IRISMODE_AUTO 1

/* flicker cancel */

typedef char * FLICKERCANCEL;
#define FLICKERCANCEL_OFF 0
#define FLICKERCANCEL_ON 1

/* WB mode */

typedef char * WBMODE;
#define WBMODE_AUTO 0
#define WBMODE_AUTO_OUTDOOR 1
#define WBMODE_DAYLIGHT 2
#define WBMODE_CLOUDY 3
#define WBMODE_SHADE 4
#define WBMODE_TUNGSTEN 5
#define WBMODE_FLW 6
#define WBMODE_FLN 7
#define WBMODE_FLD 8
#define WBMODE_ATW 9
#define WBMODE_ONEPUSH 10
#define WBMODE_MANUAL 11
#define WBMODE_PRESET1 12
#define WBMODE_PRESET2 13
#define WBMODE_PRESET3 14
#define WBMODE_PRESET4 15
#define WBMODE_PRESET5 16

/* Preset  */

typedef char * PRESET;
#define PRESET_PRESET1 1
#define PRESET_PRESET2 2
#define PRESET_PRESET3 3
#define PRESET_PRESET4 4
#define PRESET_PRESET5 5

/* One push trigger */

typedef char * ONEPUSHTRIGGER;
#define ONEPUSHTRIGGER_TRIGGERSTART 1

/* HDR mode */

typedef char * HDRMODE;
#define HDRMODE_OFF 0
#define HDRMODE_ON_MANUAL 1
#define HDRMODE_ON_AUTO1 2
#define HDRMODE_ON_AUTO2 3

/* HDR MBC mode */

typedef char * HDRMBCMODE;
#define HDRMBCMODE_OFF 0
#define HDRMBCMODE_ON_TYPE1 1
#define HDRMBCMODE_ON_TYPE2 2

/* Contrast */

typedef char * CONTRAST;
#define CONTRAST_CONTRAST_MINUS2 0
#define CONTRAST_CONTRAST_MINUS1 1
#define STANDARD 2
#define CONTRAST_CONTRAST_PLUS1 3
#define CONTRAST_CONTRAST_PLUS2 4

/* Shading correction */

typedef char * SHADINGCORRECTION;
#define SHADINGCORRECTION_OFF 0
#define SHADINGCORRECTION_ON 1

/* Color correction */

typedef char * COLORCORRECTION;
#define COLORCORRECTION_STANDARD 0
#define COLORCORRECTION_FLUORESCENT_LIGHT 1
#define COLORCORRECTION_TUNGSTEN_LAMP 2

/* Iris mode */

typedef char * IRISMODE;
#define IRISMODE_MANUAL 0
#define IRISMODE_AUTO 1

/* Focus mode */

typedef char * FOCUSMODE;
#define FOCUSMODE_AUTO 0
#define FOCUSMODE_MANUAL 1
#define FOCUSMODE_ONE_PUSH_TRIGGER 2

/* Focus one point trigger status */

typedef char * FOCUSONEPUSHTRIGGERSTATUS;
#define FOCUSONEPUSHTRIGGERSTATUS_STOPPED 0
#define FOCUSONEPUSHTRIGGERSTATUS_OPERATING 1

/* IRCut filter mode */

typedef char * IRCUTFILTERMODE;
#define IRCUTFILTERMODE_OUT 0
#define IRCUTFILTERMODE_IN 1
#define IRCUTFILTERMODE_AUTO 2

/* Menu color */

typedef char * MENUCOLOR;
#define MENUCOLOR_BLACK 0
#define MENUCOLOR_BLUE 1
#define MENUCOLOR_GREEN 2
#define MENUCOLOR_CYAN 3
#define MENUCOLOR_RED 4
#define MENUCOLOR_MAGENTA 5
#define MENUCOLOR_YELLOW 6
#define MENUCOLOR_WHITE 7


/* Highlight color */

typedef char * HIGHLIGHTCOLOR;
#define HIGHLIGHTCOLOR_BLACK 0
#define HIGHLIGHTCOLOR_BLUE 1
#define HIGHLIGHTCOLOR_GREEN 2
#define HIGHLIGHTCOLOR_CYAN 3
#define HIGHLIGHTCOLOR_RED 4
#define HIGHLIGHTCOLOR_MAGENTA 5
#define HIGHLIGHTCOLOR_YELLOW 6
#define HIGHLIGHTCOLOR_WHITE 7

/* LTC OFF/ON */

typedef char * LTCOFFON;
#define LTCOFFON_OFF 0
#define LTCOFFON_ON 1


#ifdef	__cplusplus
}
#endif



#endif /* SRC_BASE_H_ */
