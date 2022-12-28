/******************************************************************************/
/* Raspberry Pi Camera Receiver Client                                        */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Initialize                                                                 */
/******************************************************************************/
/*-----* variable *-----------------------------------------------------------*/
var $package        = require("./package.json");
var $config         = require("config");
var $socketIoClient = require("socket.io-client");
var $httpProxyAgent = require("http-proxy-agent");
var $childProc      = require("child_process");
var $socketIoOption = { path:$config.server.folder + "/socket.io" };
var $socket;
/*-----* console *------------------------------------------------------------*/
console.log("%s Version: %s"          , $package.description, $package.version);
console.log("");
console.log("Server Url: %s"          , $config.server.url);
console.log("Server Folder: %s"       , $config.server.folder);
console.log("Server Authorization: %s", $config.server.authorization.length > 0);
console.log("Show Status Command: %s" , $config.showStatusCommand);
console.log("Hide Status Command: %s" , $config.hideStatusCommand);
console.log("Set Delay   Command: %s" , $config.setDelayCommand);
console.log("Get Status  Command: %s" , $config.getStatusCommand);
console.log("");
/*-----* create web socket *--------------------------------------------------*/
if ($config.server.authorization.length > 0)
{
  var objBuffer = Buffer.from($config.server.authorization);
  $socketIoOption.extraHeaders = { Authorization:"Basic " + objBuffer.toString("base64") };
}

     if ($config.server.url.slice(0, 5) == "http:"  && process.env.http_proxy ) $socketIoOption.agent = new $httpProxyAgent(process.env.http_proxy );
else if ($config.server.url.slice(0, 6) == "https:" && process.env.https_proxy) $socketIoOption.agent = new $httpProxyAgent(process.env.https_proxy);

$socket = $socketIoClient.connect($config.server.url, $socketIoOption);
putLog("[WebSocket] start");
/******************************************************************************/
/* Web Socket                                                                 */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$socket.on("connect", function()
{
  putLog("[WebSocket] begin connection");
  sendStatus();
});
/*-----* recv(getStatus) *----------------------------------------------------*/
$socket.on("getStatus", function(pJson)
{
  if (!isJson(pJson)) return;
  if (!pJson.id     ) return;

  putLog("[WebSocket] recv getStatus [ " + JSON.stringify(pJson) + " ]");
  sendStatus(pJson.id);
});
/*-----* recv(setStatus) *----------------------------------------------------*/
$socket.on("setStatus", function(pJson)
{
  if (!isJson(pJson))
  {
    putLog("[WebSocket] recv setStatus");
    sendResult("error=change_parameter_json");
    sendStatus();
  }
  else
  {
    putLog("[WebSocket] recv setStatus [ " + JSON.stringify(pJson) + " ]");

    if (typeof pJson.display == "number")
    {
      var strCommand = pJson.display == 1 ? $config.showStatusCommand : $config.hideStatusCommand;
      putLog("exec command [ " + strCommand + " ]");

      $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
      {
        if (pErr)
        {
          putLog    (pErr);
          sendResult("error=" + pErr.toString());
        }
        else
          sendResult("success=change_parameter");

        sendStatus();
      });
    }

    if (typeof pJson.delay == "number")
    {
      var strCommand = $config.setDelayCommand.replace("%delay", pJson.delay);
      putLog("exec command [ " + strCommand + " ]");

      $childProc.exec(strCommand, function(pErr, pStdout, pStderr)
      {
        if (pErr)
        {
          putLog    (pErr);
          sendResult("error=" + pErr.toString());
        }
        else
          sendResult("success=change_parameter");

        sendStatus();
      });
    }
  }
});
/*-----* disconnect *---------------------------------------------------------*/
$socket.on("disconnect", function()
{
  putLog("[WebSocket] end connection");
});
/******************************************************************************/
/* sendStatus                                                                 */
/******************************************************************************/
function sendStatus(pId)
{
  putLog("exec command [ " + $config.getStatusCommand + " ]");

  $childProc.exec($config.getStatusCommand, function(pErr, pStdOut, pStdErr)
  {
    var objJson = { id:(pId ? pId : null), display:null, delay:null };

    if (pErr)
      putLog(pErr);
    else
    {
      var aryResult = pStdOut.split(",");

      for (var i01 = 0; i01 < aryResult.length; i01++)
      {
             if (aryResult[i01].split("=")[0] == "debug_display"  ) objJson.display = parseInt(aryResult[i01].split("=")[1], 10);
        else if (aryResult[i01].split("=")[0] == "buffering_delay") objJson.delay   = parseInt(aryResult[i01].split("=")[1], 10);
      }
    }

    $socket.json.emit("status", objJson);
    putLog("[WebSocket] send status [ " + JSON.stringify(objJson) + " ]");
  });
};
/******************************************************************************/
/* sendResult                                                                 */
/******************************************************************************/
function sendResult(pMessage)
{
  var objJson = { result : pMessage };
  $socket.emit("result", objJson);
  putLog("[WebSocket] send result [ " + JSON.stringify(objJson) + " ] ");
};
/******************************************************************************/
/* SIGINT Hundler                                                             */
/******************************************************************************/
process.on("SIGINT", function()
{
  console.log("");

  $socket.close();
  putLog("[WebSocket] stop");

  process.stdin.pause();
  process.exit();
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
