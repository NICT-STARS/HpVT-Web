/******************************************************************************/
/* Raspberry Pi Camera Web                                                    */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Environment                                                                */
/******************************************************************************/
var $Env =
{
  appName         : "myapp",
  videoPath       : "http://xxx.xxxxx.xx.xx/live/ch01/iframe.html",
  dateFormat      : "%y/%mm/%dd %H:%M:%S",
  timeZone        : "+0000",
  noImagePath     : "img/no_image.png",
  countThumbnail  : 2,                                                          // 2 to 5
  changeVideoTime : 10000,
  showThumbnail   : true,
  showLogConsole  : true,
  savePath        :
  {
    picture     : { parent : "data/picture/"    , folder : "%filename" },
    video       : { parent : "data/movie/"      , folder : "%filename" },
    cutVideo    : { parent : "data/cutMovie/"   , folder : "%filename" },
    oneDayVideo : { parent : "data/oneDayMovie/", folder : "%filename" }
  },
  graph           :
  {
    htmlPath : "graph/index.html?meta=" + encodeURIComponent("data/meta.json") + "&json=" + encodeURIComponent("../") + "%json_path",
    jsonPath : "data/graph/%filename/%filename.json"
  }
};
