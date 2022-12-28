/******************************************************************************/
/* Raspberry Pi Camera Web Environment                                        */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Common                                                                     */
/******************************************************************************/
var $Env =
{
  appName         : "myapp",
  videoPath       : "http://xxx.xxxxx.xx.xx/live/ch01/iframe.html",
  webSocketPath   : "/ui",
  dateFormat      : "%y/%mm/%dd %H:%M:%S",
  timeZone        : "+0000",
  noImagePath     : "img/no_image.png",
  countThumbnail  : 2,                                                 // 2 to 5
  changeVideoTime : 10000,
  showThumbnail   : true,
  showLogConsole  : true,
  alertDiskSpace  : 2000000,                                           // KB
  preview         :
  {
    urlPath   : "../",
    savePath  :
    {
      picture     : { parent : "../data/picture/"    , folder : "%filename" },
      video       : { parent : "../data/movie/"      , folder : "%filename" },
      cutVideo    : { parent : "../data/cutMovie/"   , folder : "%filename" },
      oneDayVideo : { parent : "../data/oneDayMovie/", folder : "%filename" },
      thumbnail   :
      {
        yearList  : { path : "../data/picture_s/%filename/"              , pattern : /^(\d{4})$/                                          , replacement : "$1/01/01 00:00:00" },
        monthList : { path : "../data/picture_s/%filename/%y/"           , pattern : /^(\d{2})$/                                          , replacement : "%y/$1/01 00:00:00" },
        dayList   : { path : "../data/picture_s/%filename/%y/%mm/"       , pattern : /^(\d{2})$/                                          , replacement : "%y/%m/$1 00:00:00" },
        timeList  : { path : "../data/picture_s/%filename/%y/%mm/%dd/"   , pattern : /^(\d{2})$/                                          , replacement : "%y/%m/%d $1:00:00" },
        fileList  : { path : "../data/picture_s/%filename/%y/%mm/%dd/%H/", pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.jpg$/, replacement : "$1/$2/$3 $4:$5:$6" },
        filePath  :          "../data/picture_s/%filename/%y/%mm/%dd/%H/%filename_%y%mm%dd%H%M%S.jpg"
      }
    }
  },
/******************************************************************************/
/* Transmitter                                                                */
/******************************************************************************/
/*-----* common *-------------------------------------------------------------*/
  transmitter :
  {
    ConfigurationDefault :
    {
      saveImage     : 0,
      Configuration :
      {
        createImageInterval  :  60,
        createImageQuality   : 100,
        createImageTimeStamp :   1,
        saveVideo            :   0,
        saveVideoInterval    : 600,
        saveVideoDuration    : 600,
        connect              :   0,
        adaptiveControl      :   0,
        fecLevel             :   9,
        heartBeat            : 500
      }
    },
    ConfigurationOptions :
    {
      saveImage :
      {
        ON  : 1,
        OFF : 0
      },
      createImageInterval :
      {
        "10sec" :   10,
        "30sec" :   30,
        "60sec" :   60,
         "2min" :  120,
         "5min" :  300,
        "10min" :  600,
        "30min" : 1800,
        "60min" : 3600
      },
      createImageQuality :
      {
        min :    0,
        max :  100
      },
      createImageTimeStamp :
      {
        Show : 1,
        Hide : 0
      },
      saveVideoInterval :
      {
        "30sec" :    30,
        "60sec" :    60,
         "5min" :   300,
        "10min" :   600,
        "30min" :  1800,
           "1h" :  3600,
           "3h" : 10800
      },
      saveVideoDuration :
      {
         "5sec" :   5,
        "10sec" :  10,
        "30sec" :  30,
        "60sec" :  60,
         "5min" : 300,
        "10min" : 600
      },
      saveVideo :
      {
        "ON ( Auto )"   : 1,
        "ON ( Manual )" : 2,
        "OFF"           : 0
      },
      connect :
      {
        YES : 1,
        NO  : 0
      },
      adaptiveControl :
      {
        OFF : 0,
        ON  : 1
      },
      fecLevel :
      {
        LEVEL_02 :  2,
        LEVEL_03 :  3,
        LEVEL_04 :  4,
        LEVEL_05 :  5,
        LEVEL_06 :  6,
        LEVEL_07 :  7,
        LEVEL_08 :  8,
        LEVEL_09 :  9,
        LEVEL_10 : 10
      },
      heartBeat :
      {
        "100ms"  :   100,
        "500ms"  :   500,
         "1sec"  :  1000,
         "2sec"  :  2000,
         "3sec"  :  3000,
         "4sec"  :  4000,
         "5sec"  :  5000,
         "6sec"  :  6000,
         "7sec"  :  7000,
         "8sec"  :  8000,
         "9sec"  :  9000,
        "10sec"  : 10000
      }
    },
/*-----* standard camera *----------------------------------------------------*/
    standardCamera :
    {
      ConfigurationDefault :
      {
        cameraType   : "standard",
        width        :    1280,
        height       :     720,
        bps          : 2000000,
        fps          :      10,
        rotation     :       0,
        flip         :       0,
        sharpness    :       0,
        contrast     :       0,
        brightness   :      50,
        saturation   :       0,
        iso          :       0,
        exposureMode :       1,
        whiteBalance :       1,
        meteringMode :       0
      },
      ConfigurationOptions :
      {
        resolution :
        {
              SD :  "640x360",
              HD : "1280x720",
          fullHD : "1920x1080"
        },
        bps :
        {
          "100Kbps" :   100000,
          "150Kbps" :   150000,
          "200Kbps" :   200000,
          "500Kbps" :   500000,
            "1Mbps" :  1000000,
            "2Mbps" :  2000000,
            "3Mbps" :  3000000,
            "4Mbps" :  4000000,
            "6Mbps" :  6000000,
            "8Mbps" :  8000000,
           "10Mbps" : 10000000,
           "15Mbps" : 15000000,
           "20Mbps" : 20000000
        },
        fps :
        {
           "1fps" :  1,
           "2fps" :  2,
           "5fps" :  5,
          "10fps" : 10,
          "15fps" : 15,
          "20fps" : 20,
          "25fps" : 25,
          "30fps" : 30
        },
        rotation :
        {
            "0&#12444;" :   0,
          "180&#12444;" : 180
        },
        flip :
        {
          NONE       : 0,
          VERTICAL   : 1,
          HORIZONTAL : 2,
          BOTH       : 3
        },
        sharpness :
        {
          min : -100,
          max :  100
        },
        contrast :
        {
          min : -100,
          max :  100
        },
        brightness :
        {
          min :    0,
          max :  100
        },
        saturation :
        {
          min : -100,
          max :  100
        },
        iso :
        {
          ISO_AUTO :   0,
          ISO_100  : 100,
          ISO_160  : 160,
          ISO_200  : 200,
          ISO_250  : 250,
          ISO_320  : 320,
          ISO_400  : 400,
          ISO_500  : 500,
          ISO_640  : 640,
          ISO_800  : 800
        },
        exposureMode :
        {
          OFF                :  0,
          AUTO               :  1,
          NIGHT              :  2,
          BACK_LIGHT         :  3,
          SPOTLIGHT          :  4,
          SPORTS             :  5,
          SNOW               :  6,
          BEACH              :  7,
          VERY_LONG          : 10,
          FIXED_FPS          : 11,
          NIGHT_WITH_PREVIEW : 12,
          ANTISHAKE          : 13,
          FIREWORKS          : 14
        },
        whiteBalance :
        {
          OFF          :  0,
          AUTO         :  1,
          AUTO2        : 17,
          SUNLIGHT     :  2,
          CLOUDY       :  3,
          SHADE        :  4,
          TUNGSTEN     :  5,
          FLUORESCENT  :  6,
          INCANDESCENT :  7,
          FLASH        :  8
        },
        meteringMode :
        {
          AVERAGE : 0,
          SPOT    : 1,
          MATRIX  : 2,
          BACKLIT : 3
        }
      }
    },
/*-----* sdi camera *---------------------------------------------------------*/
    sdiCamera :
    {
      ConfigurationDefault :
      {
        cameraType : "sdicamera",
        zoom       : 0
      },
      ConfigurationOptions :
      {
        zoom :
        {
          min :    0,
          max : 1024
        }
      }
    },
/*-----* ip camera *----------------------------------------------------------*/
    ipCamera :
    {
      ConfigurationDefault :
      {
        cameraType : "ipcamera",
        bps        : 2048,
      },
      ConfigurationOptions :
      {
        bps :
        {
          "128Kbps" :   128,
          "256Kbps" :   256,
          "512Kbps" :   512,
            "1Mbps" :  1024,
            "2Mbps" :  2048,
            "3Mbps" :  3072,
            "4Mbps" :  4096,
            "6Mbps" :  6144,
            "8Mbps" :  8192,
           "10Mbps" : 10240,
           "15Mbps" : 15360,
           "20Mbps" : 20480
        }
      }
    }
  },
/******************************************************************************/
/* Receiver                                                                   */
/******************************************************************************/
  receiver :
  {
    Configuration        : { display : null, delay : null },
    ConfigurationDefault : { display :    1, delay :  300 },
    ConfigurationOptions :
    {
      display :
      {
        "Show Status" : 1,
        "Hide Status" : 0
      },
      delay :
      {
         "300ms" :  300,
         "500ms" :  500,
        "1000ms" : 1000,
        "2000ms" : 2000,
        "3000ms" : 3000,
        "5000ms" : 5000
      }
    }
  }
};
