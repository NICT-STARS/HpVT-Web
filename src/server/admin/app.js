/******************************************************************************/
/* Raspberry Pi Camera Server(Admin)                                          */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Initialize                                                                 */
/******************************************************************************/
/*-----* variable *-----------------------------------------------------------*/
var $package         = require("./package.json");
var $config          = require("config");
var $util            = require("util");
var $serveIndex      = require("serve-index");
var $express         = require("express");
var $http            = require("http");
var $socketIo        = require("socket.io");
var $jimp            = require("jimp");
var $mkDirP          = require("mkdirp");
var $path            = require("path");
var $fileSystem      = require("fs");
var $fileSystemEx    = require("fs-extra");
var $childProc       = require("child_process");
var $application     = $express();
var $httpServer      = $http.Server($application);
var $socket          = $socketIo($httpServer);
var $transmitterNs   = $socket.of($config.transmitterNamespace);
var $receiverNs      = $socket.of($config.receiverNamespace);
var $userInterfaceNs = $socket.of($config.userInterfaceNamespace);
var $transmitteres   = {};
/*-----* console *------------------------------------------------------------*/
console.log("%s Version: %s"                 , $package.description, $package.version);
console.log("");
console.log("Port: %d"                       , $config.port);
console.log("Save Image File Path: %s"       , $config.saveImageFilePath);
console.log("Save Video File Path: %s"       , $config.saveVideoFilePath);
console.log("Save Video Cut  Path: %s"       , $config.saveVideoCutPath);
console.log("Save Image(Medium) Command: %s" , $config.saveImageMediumCommand);
console.log("Save Image(Small ) Command: %s" , $config.saveImageSmallCommand);
console.log("Save Video File Command: %s"    , $config.saveVideoFileCommand);
console.log("Save Video Cut  Command: %s"    , $config.saveVideoCutCommand);
console.log("Get File Count Command: %s"     , $config.getFileCountCommand);
console.log("Check Disk Space Command: %s"   , $config.checkDiskSpaceCommand);
console.log("Check Disk Space Interval: %dms", $config.checkDiskSpaceInterval);
console.log("Stop  Disk Space Size: %dKB"    , $config.stopDiskSpaceSize);
console.log("WebSocket Timeout: %dms"        , $config.webSocketTimeout);
console.log("Graph Interval: %dday"          , $config.graph.interval / 1000 / 60 / 60 / 24);
console.log("Time Zone: %s"                  , $config.timeZone);
console.log("UserInterface Namespace: %s"    , $config.userInterfaceNamespace);
console.log("Transmitter   Namespace: %s"    , $config.  transmitterNamespace);
console.log("Receiver      Namespace: %s"    , $config.     receiverNamespace);
console.log("");
/*-----* recovery $transmitteres *--------------------------------------------*/
$fileSystem.access(__dirname + "/config/transmitteres.json", function(pErr)
{
  if (!pErr)
  {
    $fileSystem.readFile(__dirname + "/config/transmitteres.json", "utf-8", function(pErr, pData)
    {
      if (!pErr)
      {
        try
        {
          $transmitteres = JSON.parse(pData);

          for (var strTransmitter in $transmitteres)
          {
            $transmitteres[strTransmitter].image.image = Buffer.from($transmitteres[strTransmitter].image.image, "base64");

            if ($transmitteres[strTransmitter].video)
            getFileCount(strTransmitter, "video", $config.getFileCountCommand.replace(/%path/g, __dirname + "/public/data/movie/"   + $transmitteres[strTransmitter].image.saveFileName));
            getFileCount(strTransmitter, "image", $config.getFileCountCommand.replace(/%path/g, __dirname + "/public/data/picture/" + $transmitteres[strTransmitter].image.saveFileName));
          }
        }
        catch(e) { }
      }
    });
  }
});
/*-----* http server *--------------------------------------------------------*/
$socket     .set   ("heartbeat timeout" , $config.webSocketTimeout);
$socket     .set   ("heartbeat interval", $config.webSocketTimeout);
$httpServer .listen($config.port, function(){ putLog("http server start"); });
$application.use   ($express.static(__dirname + "/public"));
$application.use   ("/data", $serveIndex(__dirname + "/public/data", { template:__dirname + "/config/directory.html", view:"details" }));
/******************************************************************************/
/* Transmitter Namespace                                                      */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$transmitterNs.on("connection",function(pSocket)
{
  putLog($util.format("begin connection from %s %s", pSocket.id, pSocket.handshake.address));
/*-----* recv(status) *-------------------------------------------------------*/
  pSocket.on("status", function(pJson)
  {
    if (!isJson(pJson)   ) return;
    if (!pJson.macAddress) return;

    putLog($util.format("recv status from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    if ($transmitteres[pJson.macAddress])
    {
      if ($transmitteres[pJson.macAddress].alive != 1 && $transmitteres[pJson.macAddress].status.Configuration)
      {
        $transmitterNs.to(pSocket.id).emit("setStatus", $transmitteres[pJson.macAddress].status.Configuration);
        putLog($util.format("send setStatus to %s [ %s ]", pSocket.id, JSON.stringify($transmitteres[pJson.macAddress].status.Configuration)));

        var objJson = { macAddress:"----------" };

        if ($transmitteres[pJson.macAddress].status.Configuration.connect == 1)
        {
          $transmitterNs.to(pSocket.id).emit("select", objJson);
          putLog($util.format("send select to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
        }
        else
        {
          $transmitterNs.to(pSocket.id).emit("unselect", objJson);
          putLog($util.format("send unselect to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
        }

        $transmitteres[pJson.macAddress].id           = pSocket.id;
        $transmitteres[pJson.macAddress]       .alive = pJson.Configuration ? 1 : 0;
        $transmitteres[pJson.macAddress].status.alive = $transmitteres[pJson.macAddress].alive;
        $transmitteres[pJson.macAddress].image .alive = $transmitteres[pJson.macAddress].alive;

        $userInterfaceNs.emit("transmitter.status", $transmitteres[pJson.macAddress].status);
        putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[pJson.macAddress].status)));
        return;
      }
    }
    else
      $transmitteres[pJson.macAddress] = { id:null, status:{ saveImage:0 }, image:{ fileCount:0 }, alive:1 };

    if (pJson.Configuration)
    {
      pJson.saveImage                               = $transmitteres[pJson.macAddress].status.saveImage;
      $transmitteres[pJson.macAddress].status       = pJson;
      $transmitteres[pJson.macAddress].id           = pSocket.id;
      $transmitteres[pJson.macAddress]       .alive = 1;
      $transmitteres[pJson.macAddress].status.alive = 1;
      $transmitteres[pJson.macAddress].image .alive = 1;
    }
    else
    {
      $transmitteres[pJson.macAddress].id           = pSocket.id;
      $transmitteres[pJson.macAddress]       .alive = 0;
      $transmitteres[pJson.macAddress].status.alive = 0;
      $transmitteres[pJson.macAddress].image .alive = 0;
    }

    $userInterfaceNs.emit("transmitter.status", $transmitteres[pJson.macAddress].status);
    putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[pJson.macAddress].status)));
  });
/*-----* recv(image) *--------------------------------------------------------*/
  pSocket.on("image", function(pJson)
  {
    if (!isJson(pJson)   ) return;
    if (!pJson.macAddress) return;
    if (!pJson.image     ) return;

    var objJsonCpy = Object.assign({}, pJson);

    objJsonCpy.image = "size=" + pJson.image.length;
    putLog($util.format("recv image from %s [ %s ]", pSocket.id, JSON.stringify(objJsonCpy)));

    if (!$transmitteres[pJson.macAddress])
    {
      $transmitteres[pJson.macAddress] = { id:null, status:{ saveImage:0 }, image:{ fileCount:0 }, alive:1 };
    }
    else if ($transmitteres[pJson.macAddress].alive != 1)
    {
      $transmitterNs.to(pSocket.id).emit("getStatus");
      putLog($util.format("send getStatus to %s", pSocket.id));
    }

    pJson.fileCount                        = $transmitteres[pJson.macAddress].image.fileCount;       objJsonCpy.fileCount       = pJson.fileCount;
    pJson.fileCountStatus                  = $transmitteres[pJson.macAddress].image.fileCountStatus; objJsonCpy.fileCountStatus = pJson.fileCountStatus;
    pJson.alive                            = $transmitteres[pJson.macAddress].alive;                 objJsonCpy.alive           = pJson.alive;
    $transmitteres[pJson.macAddress].id    = pSocket.id;
    $transmitteres[pJson.macAddress].image = pJson;

    $userInterfaceNs.emit("transmitter.image", $transmitteres[pJson.macAddress].image);
    putLog($util.format("send transmitter.image to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(objJsonCpy)));

    if ($transmitteres[pJson.macAddress].status.saveImage == 1)
    {
      var objDate = new Date(parseInt(pJson.date, 10));
      var strPath = __dirname + "/public/data/picture/" + pJson.saveFileName + "/" + formatDate(objDate, $config.saveImageFilePath.replace(/%filename/g, pJson.saveFileName), $config.timeZone) + ".jpg";

      $fileSystem.access(strPath, function(pErr)
      {
        if (pErr)
        {
          if (pErr.code == "ENOENT")
          {
            $mkDirP($path.dirname(strPath), function(pErr)
            {
              if (pErr)
                putLog(pErr);
              else
              {
                $fileSystem.writeFile(strPath, pJson.image, function(pErr)
                {
                  if (pErr)
                    putLog(pErr);
                  else
                  {
                    var strPathM    = __dirname + "/public/data/picture_m/" + pJson.saveFileName + "/" + formatDate(objDate, $config.saveImageFilePath.replace(/%filename/g, pJson.saveFileName), $config.timeZone) + ".jpg";
                    var strCommandM = $config.saveImageMediumCommand.replace(/%input/g , strPath).replace(/%output/g, strPathM);

                    $mkDirP($path.dirname(strPathM), function(pErr)
                    {
                      if (pErr)
                        putLog(pErr);
                      else
                      {
                        putLog("exec command [ " + strCommandM + " ]");

                        $childProc.exec(strCommandM, function(pErr, pStdout, pStderr)
                        {
                          if (pErr) putLog(pErr);
                        });
                      }
                    });

                    var strPathS    = __dirname + "/public/data/picture_s/" + pJson.saveFileName + "/" + formatDate(objDate, $config.saveImageFilePath.replace(/%filename/g, pJson.saveFileName), $config.timeZone) + ".jpg";
                    var strCommandS = $config.saveImageSmallCommand.replace(/%input/g , strPath).replace(/%output/g, strPathS);

                    $mkDirP($path.dirname(strPathS), function(pErr)
                    {
                      if (pErr)
                        putLog(pErr);
                      else
                      {
                        putLog("exec command [ " + strCommandS + " ]");

                        $childProc.exec(strCommandS, function(pErr, pStdout, pStderr)
                        {
                          if (pErr) putLog(pErr);
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          else
            putLog(pErr);
        }
      });
    }

    if (pJson.graph && pJson.graph.flg)
    {
      var strGraphPath = __dirname + "/public/data/graph/" + pJson.saveFileName + "/" + pJson.saveFileName + ".json";
      var objGraphDate = new Date(parseInt(pJson.date, 10));
      var strGraphDate = formatDate(objGraphDate, "%y-%mm-%dd %H:%M:%S", $config.timeZone);

      $fileSystem.access(strGraphPath, function(pGraphErr)
      {
        if (pGraphErr)
        {
          if (pGraphErr.code == "ENOENT")
          {
            var objGraphJson = [[]]; objGraphJson[0].push({ date:strGraphDate, v1:pJson.graph.value });

            $fileSystemEx.outputJson(strGraphPath, objGraphJson, { encoding:"utf-8", replacer:null, spaces:null }, function(pGraphErr1)
            {
              if (pGraphErr1) putLog(pGraphErr1);
            });
          }
          else
            putLog(pGraphErr);
        }
        else
        {
          $fileSystem.readFile(strGraphPath, "utf-8", function(pGraphErr2, pGraphData)
          {
            if (pGraphErr2)
              putLog(pGraphErr2);
            else
            {
              var objGraphJson      = JSON.parse(pGraphData);
              var flgGraphExist     = false;
              var objGraphExistDate;

              for (var i01 = objGraphJson[0].length - 1; i01 > -1; i01--)
              {
                objGraphExistDate = new Date(objGraphJson[0][i01].date);

                     if (objGraphDate.getTime() - objGraphExistDate.getTime() < 1000) { flgGraphExist = true; break; }
                else if (objGraphDate.getTime() > objGraphExistDate.getTime()       )                         break;
              }

              if (!flgGraphExist)
              {
                while (objGraphJson[0].length > 0)
                {
                  objGraphExistDate = new Date(objGraphJson[0][0].date);
                  if (objGraphDate.getTime() - objGraphExistDate.getTime() < $config.graph.interval) break;
                  objGraphJson[0].shift();
                }

                objGraphJson[0].push({ date:strGraphDate, v1:pJson.graph.value });

                $fileSystemEx.outputJson(strGraphPath, objGraphJson, { encoding:"utf-8", replacer:null, spaces:2 }, function(pGraphErr3)
                {
                  if (pGraphErr3) putLog(pGraphErr3);
                });
              }
            }
          });
        }
      });
    }
  });
/*-----* recv(video) *--------------------------------------------------------*/
  pSocket.on("video", function(pJson)
  {
    if (!isJson(pJson)   ) return;
    if (!pJson.macAddress) return;

    putLog($util.format("recv video from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    var objDate    = new Date(parseInt(pJson.date, 10));
    var strPath    = __dirname + "/public/data/movie/" + pJson.saveFileName + "/" + formatDate(objDate, $config.saveVideoFilePath.replace(/%filename/g, pJson.saveFileName), $config.timeZone) + ".mp4";
    var strCommand = $config.saveVideoFileCommand.replace(/%input/g, pJson.filePath).replace(/%fps/g, pJson.fps).replace(/%output/g, pJson.filePath + ".mp4");

    putLog("exec command [ " + strCommand + " ]");

    $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
    {
      if (pErr)
        putLog(pErr);
      else
      {
        $mkDirP($path.dirname(strPath), function(pErr)
        {
          if (pErr)
            putLog(pErr);
          else
          {
            strCommand = "mv " + pJson.filePath + ".mp4 " + strPath;
            putLog("exec command [ " + strCommand + " ]");

            $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
            {
              if (pErr)
                putLog(pErr);
              else if ($transmitteres[pJson.macAddress])
              {
                if ($transmitteres[pJson.macAddress].video) $transmitteres[pJson.macAddress].video.macAddress = pJson.macAddress;
                else                                        $transmitteres[pJson.macAddress].video            = { macAddress:pJson.macAddress, fileCount:0 };

                $userInterfaceNs.emit("transmitter.video", $transmitteres[pJson.macAddress].video);
                putLog($util.format("send transmitter.video to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[pJson.macAddress].video)));

                strPath    = __dirname + "/public/data/cutMovie/" + pJson.saveFileName + "/" + formatDate(objDate, $config.saveVideoCutPath.replace(/%filename/g, pJson.saveFileName), $config.timeZone) + ".jpg";
                strCommand = $config.saveVideoCutCommand.replace(/%input/g, pJson.filePath).replace(/%fps/g, pJson.fps).replace(/%output/g, strPath);

                $mkDirP($path.dirname(strPath), function(pErr)
                {
                  if (pErr)
                    putLog(pErr);
                  else
                  {
                    putLog("exec command [ " + strCommand + " ]");

                    $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
                    {
                      if (pErr) putLog(pErr);
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
/*-----* recv(videoFiles) *---------------------------------------------------*/
  pSocket.on("videoFiles", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv videoFiles from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));
    $userInterfaceNs.emit("transmitter.videoFiles", pJson);
    putLog($util.format("send transmitter.videoFiles to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(pJson)));
  });
/*-----* recv(result) *-------------------------------------------------------*/
  pSocket.on("result", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv result from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));
    $userInterfaceNs.emit("transmitter.result", pJson);
    putLog($util.format("send transmitter.result to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(pJson)));
  });
/*-----* disconnect *---------------------------------------------------------*/
  pSocket.once("disconnect", function()
  {
    putLog($util.format("end from %s", pSocket.id));

    for (var strTransmitter in $transmitteres)
    {
      if ($transmitteres[strTransmitter].id == pSocket.id)
      {
        var objJson = { macAddress:strTransmitter, alive:-1 };
        $userInterfaceNs.emit("transmitter.exit", objJson);
        putLog($util.format("send transmitter.exit to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(objJson)));

        $transmitteres[strTransmitter].status.alive = -1;
        $transmitteres[strTransmitter].image .alive = -1;
        $transmitteres[strTransmitter]       .alive = -1;
        break;
      }
    }
  });
});
/******************************************************************************/
/* Receiver Namespace                                                         */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$receiverNs.on("connection",function(pSocket)
{
  putLog($util.format("begin connection from %s %s", pSocket.id, pSocket.handshake.address));
/*-----* recv *---------------------------------------------------------------*/
  pSocket.on("status", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv status from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    if (pJson.id)
    {
      var strId = pJson.id;
      pJson.id  = pSocket.id;
      $userInterfaceNs.to(strId).emit("receiver.status", pJson);
      putLog($util.format("send receiver.status to %s [ %s ]", strId, JSON.stringify(pJson)));
    }
    else
    {
      pJson.id = pSocket.id;
      $userInterfaceNs.emit("receiver.status", pJson);
      putLog($util.format("send receiver.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(pJson)));
    }
  });
/*-----* recv(result) *-------------------------------------------------------*/
  pSocket.on("result", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv result from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));
    $userInterfaceNs.emit("receiver.result", pJson);
    putLog($util.format("send receiver.result to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(pJson)));
  });
/*-----* disconnect *---------------------------------------------------------*/
  pSocket.once("disconnect", function()
  {
    var objJson = { id:pSocket.id };
    putLog($util.format("end from %s", pSocket.id));
    $userInterfaceNs.emit("receiver.exit", objJson);
    putLog($util.format("send receiver.exit to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(objJson)));
  });
});
/******************************************************************************/
/* UserInterface Namespace                                                    */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$userInterfaceNs.on("connection",function(pSocket)
{
  putLog($util.format("begin connection from %s %s", pSocket.id, pSocket.handshake.address));
/*-----* recv(transmitter.setStatus) *----------------------------------------*/
  pSocket.on("transmitter.setStatus", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv transmitter.setStatus from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    if ($transmitteres[pJson.macAddress])
    {
      if (typeof pJson.saveImage == "number") $transmitteres[pJson.macAddress].status.saveImage = pJson.saveImage;

      if ($transmitteres[pJson.macAddress].alive == 1)
      {
        $transmitterNs.to($transmitteres[pJson.macAddress].id).emit("setStatus", pJson.Configuration);
        putLog($util.format("send setStatus to %s [ %s ]", $transmitteres[pJson.macAddress].id, JSON.stringify(pJson.Configuration)));
      }
      else if ($transmitteres[pJson.macAddress].status.Configuration)
      {
        for (var strKey in pJson.Configuration)
        {
          if (strKey in $transmitteres[pJson.macAddress].status.Configuration) $transmitteres[pJson.macAddress].status.Configuration[strKey] = pJson.Configuration[strKey];
        }

        $userInterfaceNs.emit("transmitter.status", $transmitteres[pJson.macAddress].status);
        putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[pJson.macAddress].status)));

        var objJson = { macAddress:pJson.macAddress, result:"success=change_parameter_reserved" };
        $userInterfaceNs.to(pSocket.id).emit("transmitter.result", objJson);
        putLog($util.format("send transmitter.result to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
      }
    }
    else
    {
      var objJson = { macAddress:pJson.macAddress, result:"error=transmitter_not_found" };
      $userInterfaceNs.to(pSocket.id).emit("transmitter.result", objJson);
      putLog($util.format("send transmitter.result to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
    }
  });
/*-----* recv(transmitter.getStatus) *----------------------------------------*/
  pSocket.on("transmitter.getStatus", function()
  {
    putLog($util.format("recv transmitter.getStatus from %s", pSocket.id));

    for (var strTransmitter in $transmitteres)
    {
      $userInterfaceNs.to(pSocket.id).emit("transmitter.status", $transmitteres[strTransmitter].status);
      putLog($util.format("send transmitter.status to %s [ %s ]", pSocket.id, JSON.stringify($transmitteres[strTransmitter].status)));
    }
  });
/*-----* recv(transmitter.getImage) *-----------------------------------------*/
  pSocket.on("transmitter.getImage", function()
  {
    putLog($util.format("recv transmitter.getImage from %s", pSocket.id));

    for (var strTransmitter in $transmitteres)
    {
      if ($transmitteres[strTransmitter].image && $transmitteres[strTransmitter].image.image)
      {
        var objJsonCpy = Object.assign({}, $transmitteres[strTransmitter].image);
        objJsonCpy.image = "size=" + $transmitteres[strTransmitter].image.image.length;
        $userInterfaceNs.to(pSocket.id).emit("transmitter.image", $transmitteres[strTransmitter].image);
        putLog($util.format("send transmitter.image to %s [ %s ]", pSocket.id, JSON.stringify(objJsonCpy)));
      }
    }
  });
/*-----* recv(transmitter.getVideo) *-----------------------------------------*/
  pSocket.on("transmitter.getVideo", function()
  {
    putLog($util.format("recv transmitter.getVideo from %s", pSocket.id));

    for (var strTransmitter in $transmitteres)
    {
      var objJson = $transmitteres[strTransmitter].video ? $transmitteres[strTransmitter].video : { macAddress:strTransmitter, fileCount:0 };
      $userInterfaceNs.to(pSocket.id).emit("transmitter.video", objJson);
      putLog($util.format("send transmitter.video to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
    }
  });
/*-----* recv(transmitter.getVideoFiles) *------------------------------------*/
  pSocket.on("transmitter.getVideoFiles", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv transmitter.getVideoFiles from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    if ($transmitteres[pJson.macAddress] && $transmitteres[pJson.macAddress].alive == 1)
    {
      $transmitterNs.to($transmitteres[pJson.macAddress].id).emit("getVideoFiles");
      putLog($util.format("send getVideoFiles to %s", $transmitteres[pJson.macAddress].id));
    }
    else
    {
      var objJson = { macAddress:pJson.macAddress };
      $userInterfaceNs.to(pSocket.id).emit("transmitter.videoFiles", objJson);
      putLog($util.format("send transmitter.videoFiles to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
    }
  });
/*-----* recv(transmitter.setVideoFiles) *------------------------------------*/
  pSocket.on("transmitter.setVideoFiles", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv transmitter.setVideoFiles from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    if ($transmitteres[pJson.macAddress] && $transmitteres[pJson.macAddress].alive == 1)
    {
      $transmitterNs.to($transmitteres[pJson.macAddress].id).emit("setVideoFiles", pJson);
      putLog($util.format("send setVideoFiles to %s [ %s ]", $transmitteres[pJson.macAddress].id, JSON.stringify(pJson)));
    }
  });
/*-----* recv(transmitter.select) *-------------------------------------------*/
  pSocket.on("transmitter.select", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv transmitter.select from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    for (var strTransmitter in $transmitteres)
    {
      if (strTransmitter == pJson.macAddress)
      {
        if ($transmitteres[strTransmitter].alive == 1)
        {
          $transmitterNs.to($transmitteres[strTransmitter].id).emit("select", pJson);
          putLog($util.format("send select to %s [ %s ]", $transmitteres[strTransmitter].id, JSON.stringify(pJson)));
        }
        else if ($transmitteres[strTransmitter].status.Configuration)
        {
          $transmitteres[strTransmitter].status.Configuration.connect = 1;
          $userInterfaceNs.emit("transmitter.status", $transmitteres[strTransmitter].status);
          putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[strTransmitter].status)));

          var objJson = { macAddress:strTransmitter, result:"success=open_connection_reserved" };
          $userInterfaceNs.to(pSocket.id).emit("transmitter.result", objJson);
          putLog($util.format("send transmitter.result to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
        }
      }
      else
      {
        if ($transmitteres[strTransmitter].alive == 1)
        {
          $transmitterNs.to($transmitteres[strTransmitter].id).emit("unselect", pJson);
          putLog($util.format("send unselect to %s [ %s ]", $transmitteres[strTransmitter].id, JSON.stringify(pJson)));
        }
        else if ($transmitteres[strTransmitter].status.Configuration)
        {
          $transmitteres[strTransmitter].status.Configuration.connect = 0;
          $userInterfaceNs.emit("transmitter.status", $transmitteres[strTransmitter].status);
          putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[strTransmitter].status)));

          var objJson = { macAddress:strTransmitter, result:"success=close_connection_reserved" };
          $userInterfaceNs.to(pSocket.id).emit("transmitter.result", objJson);
          putLog($util.format("send transmitter.result to %s [ %s ]", pSocket.id, JSON.stringify(objJson)));
        }
      }
    }
  });
/*-----* recv(transmitter.setOrderThumbnail) *--------------------------------*/
  pSocket.on("transmitter.setOrderThumbnail", function(pJson)
  {
    if (!(pJson instanceof Array)) return;
    putLog($util.format("recv transmitter.setOrderThumbnail from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));

    for (var i01 = 0; i01 < pJson.length; i01++)
    {
      var strTransmitter = pJson[i01];

      if (strTransmitter in $transmitteres)
      {
        $transmitteres[strTransmitter].orderThumbnail = i01;
      }
    }
  });
/*-----* recv(transmitter.getOrderThumbnail) *--------------------------------*/
  pSocket.on("transmitter.getOrderThumbnail", function()
  {
    var aryTransmitteres = [];
    var aryResult        = [];

    putLog($util.format("recv transmitter.getOrderThumbnail from %s", pSocket.id));

    for (var strTransmitter in $transmitteres)
    {
      if ("orderThumbnail" in $transmitteres[strTransmitter])
      {
        aryTransmitteres.push({ macAddress : strTransmitter, orderThumbnail : $transmitteres[strTransmitter].orderThumbnail });
      }
    }

    aryTransmitteres.sort(function(a, b) { return a.orderThumbnail - b.orderThumbnail; });

    for (var i01 = 0; i01 < aryTransmitteres.length; i01++)
    {
      aryResult.push(aryTransmitteres[i01].macAddress);
    }

    $userInterfaceNs.to(pSocket.id).emit("transmitter.orderThumbnail", aryResult);
    putLog($util.format("send transmitter.orderThumbnail to %s [ %s ]", pSocket.id, JSON.stringify(aryResult)));
  });
/*-----* recv(receiver.setStatus) *-------------------------------------------*/
  pSocket.on("receiver.setStatus", function(pJson)
  {
    if (!isJson(pJson)) return;
    putLog($util.format("recv receiver.setStatus from %s [ %s ]", pSocket.id, JSON.stringify(pJson)));
    $receiverNs.emit("setStatus", pJson);
    putLog($util.format("send setStatus to %s [ %s ]", $config.receiverNamespace, JSON.stringify(pJson)));
  });
/*-----* recv(receiver.getStatus) *-------------------------------------------*/
  pSocket.on("receiver.getStatus", function()
  {
    var objJson = { id:pSocket.id };
    putLog($util.format("recv receiver.getStatus from %s", pSocket.id));
    $receiverNs.emit("getStatus", objJson);
    putLog($util.format("send getStatus to %s [ %s ]", $config.receiverNamespace, JSON.stringify(objJson)));
  });
/*-----* disconnect *---------------------------------------------------------*/
  pSocket.once("disconnect", function()
  {
    putLog($util.format("end from %s", pSocket.id));
  });
});
/******************************************************************************/
/* Check Disk Space                                                           */
/******************************************************************************/
setInterval(function()
{
/*-----* check disk space *---------------------------------------------------*/
  if ($config.checkDiskSpaceStatus != "calculating")
  {
    $config.checkDiskSpaceStatus = "calculating";

    var strCommand = $config.checkDiskSpaceCommand.replace(/%path/g, __dirname);
    putLog("exec command [ " + strCommand + " ]");

    $childProc.exec(strCommand, function(pErr, pStdOut, pStdErr)
    {
      if (!pErr)
      {
        var objJson   = { total:null, used:null, available:null };
        var aryResult = pStdOut.split(",");

        for (var i01 = 0; i01 < aryResult.length; i01++)
        {
               if (aryResult[i01].split("=")[0] == "total"    ) objJson.total     = parseInt(aryResult[i01].split("=")[1], 10);
          else if (aryResult[i01].split("=")[0] == "used"     ) objJson.used      = parseInt(aryResult[i01].split("=")[1], 10);
          else if (aryResult[i01].split("=")[0] == "available") objJson.available = parseInt(aryResult[i01].split("=")[1], 10);
        }

        if (objJson.available && objJson.available <= $config.stopDiskSpaceSize)
        {
          for (var strTransmitter in $transmitteres)
          {
            if ($transmitteres[strTransmitter].status.saveImage != 0 || ($transmitteres[strTransmitter].status.Configuration && $transmitteres[strTransmitter].status.Configuration.saveVideo != 0))
            {
              $transmitteres[strTransmitter].status              .saveImage = 0;
              $transmitteres[strTransmitter].status.Configuration.saveVideo = 0;

              $userInterfaceNs.emit("transmitter.status", $transmitteres[strTransmitter].status);
              putLog($util.format("send transmitter.status to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify($transmitteres[strTransmitter].status)));

              $transmitterNs.to($transmitteres[strTransmitter].id).emit("setStatus", $transmitteres[strTransmitter].status.Configuration);
              putLog($util.format("send setStatus to %s [ %s ]", $transmitteres[strTransmitter].id, JSON.stringify($transmitteres[strTransmitter].status.Configuration)));
            }
          }
        }

        $userInterfaceNs.emit("server.diskSpace", objJson);
        putLog($util.format("send server.diskSpace to %s [ %s ]", $config.userInterfaceNamespace, JSON.stringify(objJson)));
      }

      $config.checkDiskSpaceStatus = "complete";
    });
  }
/*-----* calc file count *----------------------------------------------------*/
  for (var strTransmitter in $transmitteres)
  {
    if ($transmitteres[strTransmitter].alive == 1)
    {
      if ($transmitteres[strTransmitter].image.fileCountStatus != "calculating")
      {
        getFileCount(strTransmitter, "image", $config.getFileCountCommand.replace(/%path/g, __dirname + "/public/data/picture/" + $transmitteres[strTransmitter].image.saveFileName));
      }

      if ($transmitteres[strTransmitter].video
      &&  $transmitteres[strTransmitter].video.fileCountStatus != "calculating")
      {
        getFileCount(strTransmitter, "video", $config.getFileCountCommand.replace(/%path/g, __dirname + "/public/data/movie/"   + $transmitteres[strTransmitter].image.saveFileName));
      }
    }
  }
}, $config.checkDiskSpaceInterval);
/******************************************************************************/
/* SIGINT Hundler                                                             */
/******************************************************************************/
process.on("SIGINT", function()
{
  console.log("");

  $socket    .close();
  $httpServer.close();

  putLog("http server stop");

  for (var strTransmitter in $transmitteres)
  {
    $transmitteres[strTransmitter].status.alive = -1;
    $transmitteres[strTransmitter].image .alive = -1;
    $transmitteres[strTransmitter]       .alive = -1;
    if ($transmitteres[strTransmitter].image.image)
    $transmitteres[strTransmitter].image .image = $transmitteres[strTransmitter].image.image.toString("base64");
  }

  $fileSystemEx.outputJson(__dirname + "/config/transmitteres.json", $transmitteres, { encoding:"utf-8", replacer:null, spaces:2 }, function(pErr)
  {
    if (pErr) putLog(pErr);

    process.stdin.pause();
    process.exit();
  });
});
/******************************************************************************/
/* getFileCount                                                               */
/******************************************************************************/
function getFileCount(pTransmitter, pMedia, pCommand)
{
  $transmitteres[pTransmitter][pMedia].fileCountStatus = "calculating";
  putLog("exec command [ " + pCommand + " ]");

  $childProc.exec(pCommand, function(pErr, pStdout, pStderr)
  {
    if ($transmitteres[pTransmitter] && $transmitteres[pTransmitter][pMedia])
    {
      $transmitteres[pTransmitter][pMedia].fileCount       = pErr ? 0 : parseInt(pStdout, 10);
      $transmitteres[pTransmitter][pMedia].fileCountStatus = "complete";
    }
  });
}
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
