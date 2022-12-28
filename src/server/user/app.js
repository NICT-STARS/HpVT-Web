/******************************************************************************/
/* Raspberry Pi Camera Server(User)                                           */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* Initialize                                                                 */
/******************************************************************************/
/*-----* variable *-----------------------------------------------------------*/
var $package      = require("./package.json");
var $config       = require("config");
var $util         = require("util");
var $serveIndex   = require("serve-index");
var $express      = require("express");
var $http         = require("http");
var $socketIo     = require("socket.io");
var $application  = $express();
var $httpServer   = $http.Server($application);
var $serverSocket = $socketIo($httpServer);
/*-----* console *------------------------------------------------------------*/
console.log("%s Version: %s"          , $package.description, $package.version);
console.log("");
console.log("Port: %d"                , $config.port);
console.log("Server Url: %s"          , $config.server.url);
console.log("Server Folder: %s"       , $config.server.folder);
console.log("Server Authorization: %s", $config.server.authorization.length > 0);
console.log("WebSocket Timeout: %dms" , $config.webSocketTimeout);
console.log("");
/*-----* http server *--------------------------------------------------------*/
$serverSocket.set   ("heartbeat timeout" , $config.webSocketTimeout);
$serverSocket.set   ("heartbeat interval", $config.webSocketTimeout);
$httpServer  .listen($config.port, function(){ putLog("http server start"); });
$application .use   ($express.static(__dirname + "/public"));
$application .use   ("/data", $serveIndex(__dirname + "/public/data", { template:__dirname + "/config/directory.html", view:"details" }));
/******************************************************************************/
/* Server Socket                                                              */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$serverSocket.on("connection",function(pSocket)
{
  putLog($util.format("begin connection from %s %s", pSocket.id, pSocket.handshake.address));

  var objClient             = require("socket.io-client");
  var objClientSocketOption = { path:$config.server.folder + "/socket.io" };

  if ($config.server.authorization.length > 0)
  {
    var objBuffer = Buffer.from($config.server.authorization);
    objClientSocketOption.extraHeaders = { Authorization:"Basic " + objBuffer.toString("base64") };
  }

  var objClientSocket = objClient.connect($config.server.url, objClientSocketOption);
/*-----* recv(transmitter.getStatus) *----------------------------------------*/
  pSocket.on("transmitter.getStatus", function()
  {
    putLog($util.format("recv transmitter.getStatus from %s", pSocket.id));
    objClientSocket.emit("transmitter.getStatus");
  });
/*-----* recv(transmitter.getImage) *-----------------------------------------*/
  pSocket.on("transmitter.getImage", function()
  {
    putLog($util.format("recv transmitter.getImage from %s", pSocket.id));
    objClientSocket.emit("transmitter.getImage");
  });
/*-----* recv(transmitter.getOrderThumbnail) *--------------------------------*/
  pSocket.on("transmitter.getOrderThumbnail", function()
  {
    putLog($util.format("recv transmitter.getOrderThumbnail from %s", pSocket.id));
    objClientSocket.emit("transmitter.getOrderThumbnail");
  });
/*-----* disconnect *---------------------------------------------------------*/
  pSocket.once("disconnect", function()
  {
    putLog($util.format("end from %s", pSocket.id));
    objClientSocket.close();
  });
/******************************************************************************/
/* Client Socket                                                              */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
  objClientSocket.on("connect", function()
  {
    putLog($util.format("start web socket client %s", pSocket.id));
    objClientSocket.emit("transmitter.getOrderThumbnail");
  });
/*-----* recv(transmitter.status) *-------------------------------------------*/
  objClientSocket.on("transmitter.status", function(pJson)
  {
    pSocket.emit("transmitter.status", pJson);
    putLog($util.format("send transmitter.status to %s", pSocket.id));
  });
/*-----* recv(transmitter.image) *--------------------------------------------*/
  objClientSocket.on("transmitter.image", function(pJson)
  {
    pSocket.emit("transmitter.image", pJson);
    putLog($util.format("send transmitter.image to %s", pSocket.id));
  });
/*-----* recv(transmitter.orderThumbnail) *-----------------------------------*/
  objClientSocket.on("transmitter.orderThumbnail", function(pJson)
  {
    pSocket.emit("transmitter.orderThumbnail", pJson);
    putLog($util.format("send transmitter.orderThumbnail to %s", pSocket.id));
  });
/*-----* recv(transmitter.exit) *---------------------------------------------*/
  objClientSocket.on("transmitter.exit", function(pJson)
  {
    pSocket.emit("transmitter.exit", pJson);
    putLog($util.format("send transmitter.exit to %s", pSocket.id));
  });
/*-----* disconnect *---------------------------------------------------------*/
  objClientSocket.on("disconnect", function()
  {
    pSocket.emit("_disconnect");
    putLog($util.format("stop web socket client %s", pSocket.id));
  });
});
/******************************************************************************/
/* SIGINT Hundler                                                             */
/******************************************************************************/
process.on("SIGINT", function()
{
  console      .log  ("");
  $serverSocket.close();
  $httpServer  .close();
  putLog("http server stop");

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
