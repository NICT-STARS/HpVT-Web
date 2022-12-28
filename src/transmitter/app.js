require("getmac").getMac(function(_Err, $macAddress) { if (_Err) { console.log(_Err); process.exit(); }
/******************************************************************************/
/* Raspberry Pi Camera Transmitter Client                                     */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Initialize                                                                 */
/******************************************************************************/
/*-----* variable *-----------------------------------------------------------*/
var $package          = require("./package.json");
var $config           = require("config");
var $socketIoClient   = require("socket.io-client");
var $httpProxyAgent   = require("http-proxy-agent");
var $net              = require("net");
var $fileSystem       = require("fs");
var $path             = require("path");
var $childProc        = require("child_process");
var $socketIoOption   = { path:$config.webServer.folder + "/socket.io" };
var $webSocket;
var $netSocket;
var $netSocketBuffer  = Buffer.alloc(0, 0);
var $imageBuffer      = Buffer.alloc(0, 0);
var $videoManager     = { mutex : false, saveMode : 0, files : [], sendingFile : null };
/*-----* console *------------------------------------------------------------*/
console.log("%s Version: %s"                        , $package.description, $package.version);
console.log("");
console.log("MAC Address: %s"                       , $macAddress);
console.log("Caption: %s"                           , $config.caption);
console.log("Save File Name: %s"                    , $config.saveFileName);
console.log("Solution Type: %s"                     , $config.solutionType);
console.log("Web Server Url: %s"                    , $config.webServer.url);
console.log("Web Server Folder: %s"                 , $config.webServer.folder);
console.log("Web Server Authorization: %s"          , $config.webServer.authorization.length > 0);
console.log("Web Server SSH Host: %s"               , $config.webServer.ssh.host);
console.log("Web Server SSH Port: %d"               , $config.webServer.ssh.port);
console.log("Web Server SSH User: %s"               , $config.webServer.ssh.user);
console.log("Web Server SSH Identity File: %s"      , $config.webServer.ssh.identityFile);

if ("host" in $config.webServer.ssh.proxy)
{
console.log("Web Server SSH Proxy Host: %s"         , $config.webServer.ssh.proxy.host);
console.log("Web Server SSH Proxy Port: %d"         , $config.webServer.ssh.proxy.port);
console.log("Web Server SSH Proxy User: %s"         , $config.webServer.ssh.proxy.user);
console.log("Web Server SSH Proxy Identity File: %s", $config.webServer.ssh.proxy.identityFile);
}

console.log("Video File Server Path: %s"            , $config.videoFileServerPath);
console.log("Video File Path: %s"                   , $config.videoFilePath);
console.log("video File Transfer Limit: %s"         , $config.videoFileTransferLimit > 0 ? $config.videoFileTransferLimit + "Kbps" : "no limit");
console.log("HpVT Extention Server Host: %s"        , $config.hpvtExtentionServer.host);
console.log("HpVT Extention Server Port: %d"        , $config.hpvtExtentionServer.port);
console.log("Graph: %s"                             , $config.graph);
console.log("");
/*-----* create web socket *--------------------------------------------------*/
if ($config.webServer.authorization.length > 0)
{
  var objBuffer = Buffer.from($config.webServer.authorization);
  $socketIoOption.extraHeaders = { Authorization:"Basic " + objBuffer.toString("base64") };
}

     if ($config.webServer.url.slice(0, 5) == "http:"  && process.env.http_proxy ) $socketIoOption.agent = new $httpProxyAgent(process.env.http_proxy );
else if ($config.webServer.url.slice(0, 6) == "https:" && process.env.https_proxy) $socketIoOption.agent = new $httpProxyAgent(process.env.https_proxy);

$webSocket = $socketIoClient.connect($config.webServer.url, $socketIoOption);
putLog("[WebSocket] start");
/*-----* create net socket *--------------------------------------------------*/
$netSocket = $net.createConnection($config.hpvtExtentionServer.port, $config.hpvtExtentionServer.host, function()
{
  putLog("[HpVTExtentionSocket] start");
});
/******************************************************************************/
/* Web Socket                                                                 */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$webSocket.on("connect", function()
{
  putLog("[WebSocket] begin connection");

  if (!$netSocket.destroyed)
  {
    $netSocket.write("getStatus\n");
    putLog("[HpVTExtentionSocket] send [ getStatus ]");
  }

  if ($imageBuffer.length > 0)
  {
    setTimeout(function() { sendImage($imageBuffer); }, 5000);
  }
  else if (!$netSocket.destroyed)
  {
    $netSocket.write("getImage\n" );
    putLog("[HpVTExtentionSocket] send [ getImage ]");
  }
});
/*-----* recv(getStatus) *----------------------------------------------------*/
$webSocket.on("getStatus", function()
{
  putLog("[WebSocket] recv getStatus");

  if (!$netSocket.destroyed)
  {
    $netSocket.write("getStatus\n");
    putLog("[HpVTExtentionSocket] send [ getStatus ]");
  }
});
/*-----* recv(setStatus) *----------------------------------------------------*/
$webSocket.on("setStatus", function(pJson)
{
  if (!isJson(pJson))
  {
    putLog("[WebSocket] recv setStatus");

    if (!$netSocket.destroyed)
    {
      $netSocket.write("getStatus\n");
      putLog("[HpVTExtentionSocket] send [ getStatus ]");
    }

    sendResult(Buffer.from("error=change_parameter_json"));
  }
  else
  {
    putLog("[WebSocket] recv setStatus [ " + JSON.stringify(pJson) + " ]");

    var strCommand = "setStatus(" + JSON.stringify(pJson) + ")";

    if (!$netSocket.destroyed)
    {
      $netSocket.write(strCommand + "\n");
      putLog("[HpVTExtentionSocket] send [ " + strCommand + " ]");
    }
  }
});
/*-----* recv(unselect) *-----------------------------------------------------*/
$webSocket.on("unselect", function(pJson)
{
  putLog("[WebSocket] recv unselect");

  if (!isJson(pJson))
  {
    if (!$netSocket.destroyed)
    {
      $netSocket.write("getStatus\n");
      putLog("[HpVTExtentionSocket] send [ getStatus ]");
    }

    sendResult(Buffer.from("error=close_connection_json"));
  }
  else if (!pJson.macAddress)
  {
    if (!$netSocket.destroyed)
    {
      $netSocket.write("getStatus\n");
      putLog("[HpVTExtentionSocket] send [ getStatus ]");
    }

    sendResult(Buffer.from("error=close_connection_macAddress"));
  }
  else if ($macAddress != pJson.macAddress)
  {
    if (!$netSocket.destroyed)
    {
      $netSocket.write("unselect\n");
      putLog("[HpVTExtentionSocket] send [ unselect ]");
    }
  }
});
/*-----* recv(select) *-------------------------------------------------------*/
$webSocket.on("select", function(pJson)
{
  putLog("[WebSocket] recv select");

  if (!isJson(pJson))
  {
    if (!$netSocket.destroyed)
    {
      $netSocket.write("getStatus\n");
      putLog("[HpVTExtentionSocket] send [ getStatus ]");
    }

    sendResult(Buffer.from("error=open_connection_json"));
  }
  else
  {
    if (!$netSocket.destroyed)
    {
      $netSocket.write("select\n");
      putLog("[HpVTExtentionSocket] send [ select ]");
    }
  }
});
/*-----* recv(getVideoFiles) *------------------------------------------------*/
$webSocket.on("getVideoFiles", function()
{
  putLog("[WebSocket] recv getVideoFiles");

  var aryVideoFiles = getVideoFiles();
  var objJson       = { macAddress : $macAddress, files : [] };
  var intIndex      = -1;

  if ($videoManager.sendingFile != null)
  {
    for (var i01 = 0; i01 < aryVideoFiles.length; i01++)
    {
      if (aryVideoFiles[i01].fileName == $videoManager.sendingFile)
      {
        intIndex = i01;
        break;
      }
    }

    if (intIndex > -1) aryVideoFiles.splice(intIndex, 1);
  }

  for (var i01 = 0; i01 < aryVideoFiles.length; i01++)
  {
    intIndex = $videoManager.files.indexOf(aryVideoFiles[i01].fileName);
    objJson.files.push({ fileName : aryVideoFiles[i01].fileName, createTime : aryVideoFiles[i01].createTime.getTime(), duration : aryVideoFiles[i01].duration, select : intIndex > -1 });
  }

  $webSocket.emit("videoFiles", objJson);
  putLog("[WebSocket] send videoFiles [ " + JSON.stringify(objJson) + " ]");
});
/*-----* recv(setVideoFiles) *------------------------------------------------*/
$webSocket.on("setVideoFiles", function(pJson)
{
  if (!isJson(pJson)) return;
  putLog("[WebSocket] recv setVideoFiles [ " + JSON.stringify(pJson) + " ]");

  if (Array.isArray(pJson.files))
  {
    setTimeout(function _loop()
    {
      if (!$videoManager.mutex)
      {
        $videoManager.mutex = true;
        $videoManager.files = pJson.files.slice();
        $videoManager.mutex = false;
      }
      else
        setTimeout(_loop, 100);
    }, 100);
  }
});
/*-----* disconnect *---------------------------------------------------------*/
$webSocket.on("disconnect", function()
{
  putLog("[WebSocket] end connection");
});
/******************************************************************************/
/* Net Socket                                                                 */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$netSocket.on("connect", function()
{
  putLog("[HpVTExtentionSocket] begin connection");

  if ($webSocket.connected)
  {
    $netSocket.write("getStatus\n");
    putLog("[HpVTExtentionSocket] send [ getStatus ]");

    if ($imageBuffer.length <= 0)
    {
      $netSocket.write("getImage\n");
      putLog("[HpVTExtentionSocket] send [ getImage ]");
    }
  }
});
/*-----* recv *---------------------------------------------------------------*/
$netSocket.on("data", function(pData)
{
  $netSocketBuffer = Buffer.concat([$netSocketBuffer, pData]);

  while ($netSocketBuffer.indexOf(")HpVT.end\n") > -1)
  {
    var aryBuffer = $netSocketBuffer.slice(0, $netSocketBuffer.indexOf(")HpVT.end\n") + 1);

    if (aryBuffer.slice(0, 11) == "HpVT.status")
    {
      putLog("[HpVTExtentionSocket] recv [ " + aryBuffer  + " ]");
      sendStatus(aryBuffer.slice(12, -1));
    }
    else if (aryBuffer.slice(0, 10) == "HpVT.image")
    {
      putLog("[HpVTExtentionSocket] recv [ HpVT.image(date=" + aryBuffer.slice(11, 25) + ",size=" + aryBuffer.slice(25, -1).length + ") ]");
      $imageBuffer = Buffer.alloc(aryBuffer.slice(11, -1).length, 0);
      aryBuffer.copy($imageBuffer, 0, 11);
      sendImage($imageBuffer);
    }
    else if (aryBuffer.slice(0, 11) == "HpVT.result")
    {
      putLog("[HpVTExtentionSocket] recv [ " + aryBuffer  + " ]");
      sendResult(aryBuffer.slice(12, -1));
    }
    else
      putLog("[HpVTExtentionSocket] recv error [ " + aryBuffer.slice(0, 10)  + " ]");

    $netSocketBuffer = $netSocketBuffer.slice($netSocketBuffer.indexOf(")HpVT.end\n") + 10);
  }
});
/*-----* error *--------------------------------------------------------------*/
$netSocket.on("error", function(pError)
{
  putLog("[HpVTExtentionSocket] error [ " + pError.toString() + " ]");
});
/*-----* close *--------------------------------------------------------------*/
$netSocket.on("close", function()
{
  putLog("[HpVTExtentionSocket] end connection");
  sendStatus(Buffer.from("{}"));
  setTimeout(function() { $netSocket.connect($config.hpvtExtentionServer.port, $config.hpvtExtentionServer.host); }, 10000);
});
/******************************************************************************/
/* sendStatus                                                                 */
/******************************************************************************/
function sendStatus(pBuffer)
{
  try
  {
    var objJson = JSON.parse(pBuffer.toString());

    objJson.macAddress   = $macAddress;
    objJson.caption      = $config.caption;
    objJson.saveFileName = $config.saveFileName;
    objJson.solutionType = $config.solutionType;
    objJson.graph        = { flg:$config.graph, value:null }

    if ("Configuration" in objJson && "saveVideo" in objJson.Configuration) $videoManager.saveMode = objJson.Configuration.saveVideo;

    if ($videoManager.saveMode != 2)
    {
      setTimeout(function _loop()
      {
        if (!$videoManager.mutex)
        {
          $videoManager.mutex = true;
          $videoManager.files = [];
          $videoManager.mutex = false;
        }
        else
          setTimeout(_loop, 100);
      }, 100);
    }

    if ($webSocket.connected)
    {
      $webSocket.emit("status", objJson);
      putLog("[WebSocket] send status [ " + JSON.stringify(objJson) + " ]");
    }
  }
  catch(e)
  {
    putLog("[SendStatus] error [ " + e.toString().replace("\n", " ")  + " ]");
  }
}
/******************************************************************************/
/* sendImage                                                                  */
/******************************************************************************/
function sendImage(pBuffer)
{
  var objJson =
  {
    macAddress   : $macAddress,
    caption      : $config.caption,
    saveFileName : $config.saveFileName,
    solutionType : $config.solutionType,
    date         : (new Date(pBuffer.slice( 0,  4) + "/" + pBuffer.slice(4, 6) + "/" + pBuffer.slice(6, 8) + " " + pBuffer.slice(8, 10) + ":" + pBuffer.slice(10, 12) + ":" + pBuffer.slice(12, 14))).getTime(),
    image        : "size=" + pBuffer.slice(14).length,
    graph        : { flg:$config.graph, value:$config.graph ? Math.random() * (11 - 0) + 0 : null }
  };

  if ($webSocket.connected)
  {
    putLog("[WebSocket] send image [ " + JSON.stringify(objJson) + " ]");
    objJson.image = pBuffer.slice(14);
    $webSocket.emit("image", objJson);
  }
}
/******************************************************************************/
/* sendResult                                                                 */
/******************************************************************************/
function sendResult(pBuffer)
{
  var objJson =
  {
    macAddress : $macAddress,
    result     : pBuffer.toString()
  };

  if ($webSocket.connected)
  {
    $webSocket.emit("result", objJson);
    putLog("[WebSocket] send result [ " + JSON.stringify(objJson) + " ]");
  }
}
/******************************************************************************/
/* sendVideo                                                                  */
/******************************************************************************/
function sendVideo(pVideoFile)
{
  try
  {
    var objServer     = $config.webServer.ssh;
    var strServerPath = formatDate(pVideoFile.createTime, $config.videoFileServerPath.replace(/%saveFileName/g, $config.saveFileName));
    var objJson       = { macAddress : $macAddress, saveFileName : $config.saveFileName, date : pVideoFile.createTime.getTime(), filePath : strServerPath, fps : pVideoFile.frameRate };
    var strProxy      = "";
    var strCommand;

    if ("host" in objServer.proxy)
    {
      strProxy = "-o ProxyCommand='ssh -p %port -i %identityFile -W %h:%p %user@%host' ";
      strProxy = strProxy.replace("%port"        , objServer.proxy.port);
      strProxy = strProxy.replace("%identityFile", objServer.proxy.identityFile);
      strProxy = strProxy.replace("%user"        , objServer.proxy.user);
      strProxy = strProxy.replace("%host"        , objServer.proxy.host);
    }

    strCommand = "ssh " + strProxy + "-p %port -i %identityFile %user@%host mkdir -p %serverPath";
    strCommand = strCommand.replace("%port"        , objServer.port);
    strCommand = strCommand.replace("%identityFile", objServer.identityFile);
    strCommand = strCommand.replace("%user"        , objServer.user);
    strCommand = strCommand.replace("%host"        , objServer.host);
    strCommand = strCommand.replace("%serverPath"  , $path.dirname(strServerPath));

    putLog("[SendVideo] exec command [ " + strCommand + " ]");

    $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
    {
      if (pErr)
      {
        putLog("[SendVideo] error [ " + pErr.toString().replace("\n", " ")  + " ]");
        $videoManager.sendingFile = null;
        return;
      }

      var strLimit = $config.videoFileTransferLimit > 0 ? "-l " + $config.videoFileTransferLimit + " " : "";

      strCommand = "scp " + strProxy + strLimit + "-P %port -i %identityFile %path %user@%host:%serverPath";
      strCommand = strCommand.replace("%port"        , objServer .port);
      strCommand = strCommand.replace("%identityFile", objServer .identityFile);
      strCommand = strCommand.replace("%path"        , pVideoFile.fileName);
      strCommand = strCommand.replace("%user"        , objServer .user);
      strCommand = strCommand.replace("%host"        , objServer .host);
      strCommand = strCommand.replace("%serverPath"  , strServerPath);

      putLog("[SendVideo] exec command [ " + strCommand + " ]");

      $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
      {
        if (pErr)
        {
          putLog("[SendVideo] error [ " + pErr.toString().replace("\n", " ")  + " ]");
          $videoManager.sendingFile = null;
          return;
        }

        if ($webSocket.connected)
        {
          putLog("[WebSocket] send video [ " + JSON.stringify(objJson) + " ]");
          $webSocket.emit("video", objJson);
          removeVideo(pVideoFile.fileName);
        }
        else
          $videoManager.sendingFile = null;
      });
    });
  }
  catch(e)
  {
    putLog("[SendVideo] error [ " + e.toString().replace("\n", " ")  + " ]");
    $videoManager.sendingFile = null;
  }
}
/******************************************************************************/
/* removeVideo                                                                */
/******************************************************************************/
function removeVideo(pFile)
{
  var strCommand;

  strCommand = "sudo rm " + pFile.replace(/h264$/, "*");
  putLog("[RemoveVideo] exec command [ " + strCommand + " ]");

  $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
  {
    if (pErr) putLog("[RemoveVideo] error [ " + pErr.toString().replace("\n", " ")  + " ]");

    setTimeout(function _loop()
    {
      if (!$videoManager.mutex)
      {
        $videoManager.mutex = true;

        var intIndex =     $videoManager.files.indexOf(pFile);
        if (intIndex > -1) $videoManager.files.splice (intIndex, 1);

        $videoManager.sendingFile = null;
        $videoManager.mutex       = false;
      }
      else
        setTimeout(_loop, 100);
    }, 100);
  });
}
/******************************************************************************/
/* getVideoFiles                                                              */
/******************************************************************************/
function getVideoFiles()
{
  var aryVideoFiles = [];

  try
  {
    var aryFiles     = $fileSystem.readdirSync($config.videoFilePath);
    var aryMetaFiles = aryFiles.filter(function(pFile) { return /.*\.meta$/.test(pFile); });

    aryMetaFiles.sort(function(pX, pY)
    {
      var objFileStatX = $fileSystem.statSync($config.videoFilePath + "/" + pX);
      var objFileStatY = $fileSystem.statSync($config.videoFilePath + "/" + pY);

             if( objFileStatX.birthtime.getTime() < objFileStatY.birthtime.getTime()) return -1;
        else if( objFileStatX.birthtime.getTime() > objFileStatY.birthtime.getTime()) return  1;
        else                                                                          return  0;
    });

    for (var i01 = 0; i01 < aryMetaFiles.length; i01++)
    {
      var aryMetaInfos = $fileSystem.readFileSync($config.videoFilePath + "/" + aryMetaFiles[i01], "utf-8").split("\n");
      var objMetaInfo  = {};

      for (var i02 = 0; i02 < aryMetaInfos.length; i02++)
      {
        var aryMetaInfo = aryMetaInfos[i02];

        if (aryMetaInfo.split("=").length == 2)
        {
               if (aryMetaInfo.split("=")[0] == "FileName"  ) objMetaInfo.fileName   =           aryMetaInfo.split("=")[1];
          else if (aryMetaInfo.split("=")[0] == "CreateTime") objMetaInfo.createTime = new Date (aryMetaInfo.split("=")[1].replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6Z"));
          else if (aryMetaInfo.split("=")[0] == "FrameRate" ) objMetaInfo.frameRate  =  parseInt(aryMetaInfo.split("=")[1], 10);
          else if (aryMetaInfo.split("=")[0] == "Duration"  ) objMetaInfo.duration   =  parseInt(aryMetaInfo.split("=")[1], 10);
        }
      }

      if ("fileName" in objMetaInfo && "createTime" in objMetaInfo && "frameRate" in objMetaInfo) aryVideoFiles.push(objMetaInfo);
    }
  }
  catch(e)
  {
    putLog("[getVideoFiles] error [ " + e.toString().replace("\n", " ")  + " ]");
  }

  return aryVideoFiles;
}
/******************************************************************************/
/* checkVideoFile                                                             */
/******************************************************************************/
setTimeout(function checkVideoFile()
{
  if ($videoManager.saveMode > 0 && $videoManager.sendingFile == null)
  {
    var aryVideoFiles = getVideoFiles();
/*-----* auto *---------------------------------------------------------------*/
    if ($videoManager.saveMode == 1)
    {
      if (aryVideoFiles.length > 0)
      {
        $videoManager.sendingFile = aryVideoFiles[aryVideoFiles.length - 1].fileName;
        sendVideo(aryVideoFiles[aryVideoFiles.length - 1]);
      }
    }
/*-----* manual *-------------------------------------------------------------*/
    else if ($videoManager.saveMode == 2 && !$videoManager.mutex)
    {
      if ($videoManager.files.length > 0)
      {
        for (var i01 = 0; i01 < aryVideoFiles.length; i01++)
        {
          if (aryVideoFiles[i01].fileName == $videoManager.files[0])
          {
            $videoManager.sendingFile = aryVideoFiles[i01].fileName;
            sendVideo(aryVideoFiles[i01]);
            break;
          }
        }
      }
    }
  }

  setTimeout(checkVideoFile, 1000);
}, 1000);
/******************************************************************************/
/* SIGINT Hundler                                                             */
/******************************************************************************/
process.on("SIGINT", function()
{
  console.log("");

  $webSocket.close();
  putLog("[WebSocket] stop");

  $netSocket.end();

  setTimeout(function()
  {
    putLog("[HpVTExtentionSocket] stop");
    process.stdin.pause();
    process.exit();
  }, 1000);
});
/******************************************************************************/
/* putLog                                                                     */
/******************************************************************************/
function putLog(pMessage)
{
  var objDate        = new Date();
  var strMonth       = ("0"  + (objDate.getMonth       () + 1)).slice(-2);
  var strDay         = ("0"  +  objDate.getDate        ()     ).slice(-2);
  var strHours       = ("0"  +  objDate.getHours       ()     ).slice(-2);
  var strMinutes     = ("0"  +  objDate.getMinutes     ()     ).slice(-2);
  var strSeconds     = ("0"  +  objDate.getSeconds     ()     ).slice(-2);
  var strMillseconds = ("00" +  objDate.getMilliseconds()     ).slice(-3);

  console.log("%d/%s/%s %s:%s:%s.%s %s", objDate.getFullYear(), strMonth, strDay, strHours, strMinutes, strSeconds, strMillseconds, pMessage);
}
/******************************************************************************/
/* isJson                                                                     */
/******************************************************************************/
function isJson(pJson)
{
  return (pJson instanceof Object && !(pJson instanceof Array)) ? true : false;
}
/******************************************************************************/
/* formatDate                                                                 */
/******************************************************************************/
function formatDate(pDate, pFormatString, pTimeZone)
{
  var objDate   = new Date(pDate.getTime());
  var strResult = pFormatString;

  if (typeof pTimeZone == "string")
  {
    if (pTimeZone.indexOf("+") != -1) objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("+", "-")));
    else                              objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("-", "+")));
  }

  strResult = strResult.replace(/%y/g ,          objDate.getFullYear    ()      .toString(  ));
  strResult = strResult.replace(/%mm/g, ("0"  + (objDate.getMonth       () + 1)).slice   (-2));
  strResult = strResult.replace(/%m/g ,         (objDate.getMonth       () + 1) .toString(  ));
  strResult = strResult.replace(/%dd/g, ("0"  + (objDate.getDate        ()    )).slice   (-2));
  strResult = strResult.replace(/%d/g ,          objDate.getDate        ()      .toString(  ));
  strResult = strResult.replace(/%H/g , ("0"  +  objDate.getHours       ()     ).slice   (-2));
  strResult = strResult.replace(/%M/g , ("0"  +  objDate.getMinutes     ()     ).slice   (-2));
  strResult = strResult.replace(/%S/g , ("0"  +  objDate.getSeconds     ()     ).slice   (-2));
  strResult = strResult.replace(/%N/g , ("00" +  objDate.getMilliseconds()     ).slice   (-3));

  return strResult;
}
});
