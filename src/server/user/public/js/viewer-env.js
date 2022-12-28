/******************************************************************************/
/* Raspberry Pi Camera Web                                                    */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Environment                                                                */
/******************************************************************************/
var $Env =
{
  monthFormat    : "%y/%mm",
  dateFormat     : "%y/%mm/%dd",
  timeFormat     : "%H:%M:%S",
  timeZone       : "+0000",
  noImagePath    : "img/no_image.png",
  showLogConsole : true,
  serveIndex     :
  {
    thumbnail :
    {
      yearList  : { path : "data/picture_s/%filename/"                                   , pattern : /^(\d{4})$/                                                  , replacement : "$1/01/01 00:00:00" },
      monthList : { path : "data/picture_s/%filename/%y/"                                , pattern : /^(\d{2})$/                                                  , replacement : "%y/$1/01 00:00:00" },
      dayList   : { path : "data/picture_s/%filename/%y/%mm/"                            , pattern : /^(\d{2})$/                                                  , replacement : "%y/%m/$1 00:00:00" },
      timeList  : { path : "data/picture_s/%filename/%y/%mm/%dd/"                        , pattern : /^(\d{2})$/                                                  , replacement : "%y/%m/%d $1:00:00" },
      fileList  : { path : "data/picture_s/%filename/%y/%mm/%dd/%H/"                     , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.jpg$/        , replacement : "$1/$2/$3 $4:$5:$6" },
      filePath  :          "data/picture_s/%filename/%y/%mm/%dd/%H/%filename_%y%mm%dd%H%M%S.jpg"
    },
    picture :
    {
      filePath  :          "data/picture_m/%filename/%y/%mm/%dd/%H/%filename_%y%mm%dd%H%M%S.jpg"
    },
    fullPicture :
    {
      filePath  :          "data/picture/%filename/%y/%mm/%dd/%H/%filename_%y%mm%dd%H%M%S.jpg"
    },
    video :
    {
      yearList  : { path : "data/movie/%filename/"                                       , pattern : /^(\d{4})$/                                                  , replacement : "$1/01/01 00:00:00" },
      monthList : { path : "data/movie/%filename/%y/"                                    , pattern : /^(\d{2})$/                                                  , replacement : "%y/$1/01 00:00:00" },
      dayList   : { path : "data/movie/%filename/%y/%mm/"                                , pattern : /^(\d{2})$/                                                  , replacement : "%y/%m/$1 00:00:00" },
      timeList  : { path : "data/movie/%filename/%y/%mm/%dd/"                            , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.mp4$/        , replacement : "$1/$2/$3 $4:00:00" },
      fileList  : { path : "data/movie/%filename/%y/%mm/%dd/"                            , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.mp4$/        , replacement : "$1/$2/$3 $4:$5:$6" },
      filePath  :          "data/movie/%filename/%y/%mm/%dd/%filename_%y%mm%dd%H%M%S.mp4"
    },
    oneDayVideo :
    {
      yearList  : { path : "data/oneDayMovie/%filename/"                                 , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.mp4$/        , replacement : "$1/01/01 00:00:00" },
      monthList : { path : "data/oneDayMovie/%filename/"                                 , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.mp4$/        , replacement : "$1/$2/01 00:00:00" },
      dayList   : { path : "data/oneDayMovie/%filename/"                                 , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.mp4$/        , replacement : "$1/$2/$3 $4:$5:$6" },
      filePath  :          "data/oneDayMovie/%filename/%filename_%y%mm%dd%H%M%S.mp4"
    },
    cutVideo :
    {
      yearList  : { path : "data/cutMovie/%filename/"                                    , pattern : /^(\d{4})$/                                                  , replacement : "$1/01/01 00:00:00" },
      monthList : { path : "data/cutMovie/%filename/%y/"                                 , pattern : /^(\d{2})$/                                                  , replacement : "%y/$1/01 00:00:00" },
      dayList   : { path : "data/cutMovie/%filename/%y/%mm/"                             , pattern : /^(\d{2})$/                                                  , replacement : "%y/%m/$1 00:00:00" },
      timeList  : { path : "data/cutMovie/%filename/%y/%mm/%dd/"                         , pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/             , replacement : "$1/$2/$3 $4:$5:$6" },
      cutList   : { path : "data/cutMovie/%filename/%y/%mm/%dd/%filename_%y%mm%dd%H%M%S/", pattern : /^.+(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})_(\d{2})\.jpg$/, replacement : "$1/$2/$3 $4:$5:$6" },
      filePath  :          "data/cutMovie/%filename/%y/%mm/%dd/%filename_%y%mm%dd%H%M%S/%filename_%y%mm%dd%H%M%S_%sq.jpg"
    }
  }
};
