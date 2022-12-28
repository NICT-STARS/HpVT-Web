/******************************************************************************/
/* Raspberry Pi Camera Client                                                 */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Initialize                                                                 */
/******************************************************************************/
/*-----* check argv *---------------------------------------------------------*/
if (process.argv.length < 4)
{
  console.log("Argument Error. Example [ node app.js name key1=value1 key2=value2 ... ]");
  process.stdin.pause();
  process.exit();
}
/*-----* variable *-----------------------------------------------------------*/
var $package        = require("./package.json");
var $config         = require("config");
var $socketIoClient = require("socket.io-client");
var $httpProxyAgent = require("http-proxy-agent");
var $util           = require("util");
var $socketOption   = { path:$config.server.folder + "/socket.io" };
var $socket         = null;
var $flgChange      = false;
/*-----* console *------------------------------------------------------------*/
console.log("%s Version: %s"          , $package.description, $package.version);
console.log("");
console.log("Server Url: %s"          , $config.server.url);
console.log("Server Folder: %s"       , $config.server.folder);
console.log("Server Authorization: %s", $config.server.authorization.length > 0);
console.log("Time Out: %d ms"         , $config.timeOut);
console.log("");
/*-----* web socket start *---------------------------------------------------*/
if ($config.server.authorization.length > 0)
{
  var objBuffer = Buffer.from($config.server.authorization);
  $socketOption.extraHeaders = { Authorization:"Basic " + objBuffer.toString("base64") };
}

     if ($config.server.url.slice(0, 5) == "http:"  && process.env.http_proxy ) $socketOption.agent = new $httpProxyAgent(process.env.http_proxy );
else if ($config.server.url.slice(0, 6) == "https:" && process.env.https_proxy) $socketOption.agent = new $httpProxyAgent(process.env.https_proxy);

$socket = $socketIoClient.connect($config.server.url, $socketOption);
setTimeout(function() { $socket.close(); } , $config.timeOut);
/******************************************************************************/
/* Web Socket                                                                 */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$socket.on("connect", function()
{
  putLog("start web socket client");
  $socket.emit("transmitter.getStatus");
});
/*-----* recv(transmitter.status) *-------------------------------------------*/
$socket.on("transmitter.status", function(pJson)
{
  if (!isJson(pJson)                       ) return;
  if (typeof pJson.saveFileName != "string") return;
  if (typeof pJson.macAddress   != "string") return;

  if (pJson.saveFileName == process.argv[2])
  {
    putLog($util.format("recv status [ %s ]", JSON.stringify(pJson)));

    if ($flgChange)
    {
      setTimeout(function() { $socket.close(); } , 1000);
      return;
    }

    var objStatus = { macAddress : pJson.macAddress, Configuration : {} };
    var objSelect = { macAddress : pJson.macAddress };
    var flgStatus = false;
    var flgSelect = false;

    for (var i01 = 3; i01 < process.argv.length; i01++)
    {
      var aryParam = process.argv[i01].split("="); if (aryParam.length != 2) continue;
      var strKey   = aryParam[0];
      var objValue = aryParam[1];

           if (/^-?\d+$/     .test(objValue)) objValue = parseInt  (objValue, 10);
      else if (/^-?\d+\.\d+$/.test(objValue)) objValue = parseFloat(objValue    );

      if (strKey == "connect")
      {
        objSelect.macAddress = (objValue == 1 ? pJson.macAddress : "----------");
        flgSelect            = true;
      }
      else
      {
        if (strKey == "saveImage") objStatus              [strKey] = objValue;
        else                       objStatus.Configuration[strKey] = objValue;
                                   flgStatus                       = true;
      }
    }

    if (flgSelect) { $socket.emit("transmitter.select"   , objSelect); putLog($util.format("send select [ %s ]", JSON.stringify(objSelect))); }
    if (flgStatus) { $socket.emit("transmitter.setStatus", objStatus); putLog($util.format("send status [ %s ]", JSON.stringify(objStatus))); }

    $flgChange = true;
  }
});
/*-----* disconnect *---------------------------------------------------------*/
$socket.on("disconnect", function()
{
  putLog("stop web socket client");
  process.stdin.pause();
  process.exit();
});
/******************************************************************************/
/* SIGINT Hundler                                                             */
/******************************************************************************/
process.on("SIGINT", function()
{
  console.log("");
  $socket.close();
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
