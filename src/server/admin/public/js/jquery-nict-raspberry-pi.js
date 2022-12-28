;(function($){ $.nictRaspberryPi = {
/******************************************************************************/
/** NICT Raspberry Pi for JQuery Function                                     */
/** Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                   */
/******************************************************************************/
/******************************************************************************/
/* nictRaspberryPi.getList                                                    */
/******************************************************************************/
getList : function(pJson)
{
/*-----* initialize *---------------------------------------------------------*/
  var $li = $("#list > li[mac_address='" + pJson.macAddress + "']");

  if ($li.length == 0)
  {
    var strSaveFileName = typeof pJson.saveFileName == "string" ? pJson.saveFileName : "";
    var strCaption      = typeof pJson.caption      == "string" ? pJson.caption      : "";
    var strSolutionType = typeof pJson.solutionType == "string" ? pJson.solutionType : "";
    var $image          = $("<div class='image'></div>");
    var $param          = $("<div class='param'></div>");
/*-----* image *--------------------------------------------------------------*/
    $image.append("<div class='view_area'  ><img src='" + $Env.noImagePath + "'/></div>");
    $image.append("<div class='bar'      >"                +
                    "<span class='bar_download'  ></span>" +
                    "<span class='bar_fullscreen'></span>" +
                  "</div>");
    $image.append("<div class='caption'    ><i></i>" + strCaption + "<i></i></div>");
    $image.append("<div class='date'       >&nbsp;</div>");
    $image.append("<div class='logo'       ></div>");
    $image.append("<div class='rec_status'>"      +
                    "<i class='rec_picture'></i>" +
                    "<i class='rec_video'  ></i>" +
                  "</div>");
    $image.append("<div class='tab'        >"                                        +
                    "<div class='picture'><span class='select'><i></i></span></div>" +
                    "<div class='video'  ><span               ><i></i></span></div>" +
                  "</div>");

    $image.find("img").on("load", function()
    {
      $(this)              .animate({ opacity:1 }, { duration:600, easing: "swing" });
      $(this).parents("li").attr   ("aspect_ratio", (this.naturalWidth / this.naturalHeight).toFixed(1));
    });
/*-----* param *--------------------------------------------------------------*/
    var objTransmitter = $Env.transmitter.ConfigurationOptions;
    var objReceiver    = $Env.receiver;

    $param.append("<h2 class='property'><i></i></h2>");

    $param.append("<div class='createImageInterval'>"     +
                    "<label><i></i></label>"              +
                    "<select name='createImageInterval'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.createImageInterval) +
                    "</select>"                           +
                  "</div>");

    $param.append("<div class='createImageQuality'>"  +
                    "<label><i></i></label>"          +
                    "<input name='createImageQuality' type='range' min='" + objTransmitter.createImageQuality.min + "' max='" + objTransmitter.createImageQuality.max + "'/>" +
                  "</div>");

    $param.append("<div class='createImageTimeStamp'>"     +
                    "<label><i></i></label>"               +
                    "<select name='createImageTimeStamp'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.createImageTimeStamp) +
                    "</select>"                            +
                  "</div>");

    $param.append("<div class='saveImage'>"                     +
                    "<label><i></i></label>"                    +
                    "<select name='saveImage'>"                 +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.saveImage) +
                    "</select>"                                 +
                    "<div class='server_info'>"                 +
                      "<i></i><span class='disk_space'></span>" +
                      "<i></i><span class='file_count'></span>" +
                    "</div>"                                    +
                  "</div>");

    $param.append("<div class='saveVideo'>"                                 +
                    "<label><i></i></label>"                                +
                    "<div class='input_area'>"                              +
                      "<label class='saveVideoInterval'></label>"           +
                      "<select name='saveVideoInterval'>"                   +
                        $.nictRaspberryPi.createHtmlOption(objTransmitter.saveVideoInterval) +
                      "</select>"                                           +
                      "<label class='saveVideoDuration'></label>"           +
                      "<select name='saveVideoDuration'>"                   +
                        $.nictRaspberryPi.createHtmlOption(objTransmitter.saveVideoDuration) +
                      "</select>"                                           +
                      "<label class='saveVideo'></label>"                   +
                      "<select name='saveVideo'>"                           +
                        $.nictRaspberryPi.createHtmlOption(objTransmitter.saveVideo) +
                      "</select>"                                           +
                      "<div class='video_files'><span><i></i></span></div>" +
                    "</div>"                                                +
                    "<div class='server_info'>"                             +
                      "<i></i><span class='disk_space'></span>"             +
                      "<i></i><span class='file_count'></span>"             +
                    "</div>"                                                +
                  "</div>");

    if (strSolutionType.indexOf("video") > -1)
    {
    $param.append("<div class='connect'>"     +
                    "<label><i></i></label>"  +
                    "<select name='connect'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.connect) +
                    "</select>"               +
                  "</div>");
    }

    $param.append("<div class='adaptiveControl'>"     +
                    "<label><i></i></label>"          +
                    "<select name='adaptiveControl'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.adaptiveControl) +
                    "</select>"                       +
                  "</div>");

    $param.append("<div class='fecLevel'>"     +
                    "<label><i></i></label>"   +
                    "<select name='fecLevel'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.fecLevel) +
                    "</select>"                +
                  "</div>");

    $param.append("<div class='heartBeat'>"     +
                    "<label><i></i></label>"    +
                    "<select name='heartBeat'>" +
                      $.nictRaspberryPi.createHtmlOption(objTransmitter.heartBeat) +
                    "</select>"                 +
                  "</div>");

    $param.append("<div class='delay'>"      +
                    "<label><i></i></label>" +
                    "<select name='delay'>"  +
                      $.nictRaspberryPi.createHtmlOption(objReceiver.ConfigurationOptions.delay) +
                    "</select>"              +
                  "</div>");

    $param.append("<div class='display'>"     +
                    "<label><i></i></label>"  +
                    "<select name='display'>" +
                      $.nictRaspberryPi.createHtmlOption(objReceiver.ConfigurationOptions.display) +
                    "</select>"               +
                  "</div>");

         if (pJson.Configuration.cameraType == "standard" ) $.nictRaspberryPi.createParamStandard ($param);
    else if (pJson.Configuration.cameraType == "sdicamera") $.nictRaspberryPi.createParamSdiCamera($param);
    else                                                    $.nictRaspberryPi.createParamIpCamera ($param, pJson.ConfigurationOptions);

    $param.append("<div class='reset'><span><i></i></span></div>");
/*-----* history *------------------------------------------------------------*/
    $param.append("<h2  class='history'><i></i></h2>");
    $param.append("<div class='history_button'>"                                          +
                     "<a class='history_picture    disabled' target='_blank'><i></i></a>" +
                     "<a class='history_video      disabled' target='_blank'><i></i></a>" +
                     "<a class='history_cut_video  disabled' target='_blank'><i></i></a>" +
                     "<a class='history_time_lapse disabled' target='_blank'><i></i></a>" +
                  "</div>");
/*-----* other *--------------------------------------------------------------*/
    $param.append("<i class='view_url'></i>");
    if ($Env.showThumbnail)
    $param.append("<div class='list'></div>");

    $param.find(".delay"         ).toggleClass("disconnect", !objReceiver.Configuration.delay  );
    $param.find(".display"       ).toggleClass("disconnect", !objReceiver.Configuration.display);
    $param.find(".delay   select").val        (               objReceiver.Configuration.delay  );
    $param.find(".display select").val        (               objReceiver.Configuration.display);

    $li = $("<li mac_address='" + pJson.macAddress + "' save_file_name='" + strSaveFileName + "' caption='" + strCaption + "' solution_type='" + strSolutionType + "' camera_type='" + pJson.Configuration.cameraType + "'></li>");
    $li.append($image);
    $li.append($param);
    $li.data  ("newTransmitter", true);
/*-----* add list *-----------------------------------------------------------*/
    var $sibling = null;

    if ($Env.localStorage && Array.isArray($Env.localStorage.orderThumbnail) && $Env.localStorage.orderThumbnail.indexOf(pJson.macAddress) > -1)
    {
      for (var i01 = $Env.localStorage.orderThumbnail.length - 1; i01 > $Env.localStorage.orderThumbnail.indexOf(pJson.macAddress); i01--)
      {
        if ($("#list").children("[mac_address='" + $Env.localStorage.orderThumbnail[i01] + "']").length > 0)
        {
          $sibling = $("#list").children("[mac_address='" + $Env.localStorage.orderThumbnail[i01] + "']");
        }
      }
    }
    else
    {
      $("#list").children("[mac_address]").each(function(pIndex, pElement)
      {
        if ($li.attr("caption") < $(pElement).attr("caption"))
        {
          $sibling = $(pElement);
          return false;
        }
      });
    }

    if ($sibling) $sibling                 .before($li);
    else          $("#list li.dummy:first").before($li);

    if (!$Env.showThumbnail) $li.find(".caption").trigger("mouseup");
  }
  else
    $li.data("newTransmitter", null);

  return $li;
},
/******************************************************************************/
/* nictRaspberryPi.createParamStandard                                        */
/******************************************************************************/
createParamStandard : function(pParam)
{
  var objTransmitter = $Env.transmitter.standardCamera.ConfigurationOptions;

  pParam.append("<div class='resolution'>"     +
                  "<label><i></i></label>"     +
                  "<select name='resolution'>" +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.resolution) +
                  "</select>"                  +
                "</div>");

  pParam.append("<div class='rotation'>"     +
                  "<label><i></i></label>"   +
                  "<select name='rotation'>" +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.rotation) +
                  "</select>"                +
                "</div>");

  pParam.append("<div class='flip'>"       +
                  "<label><i></i></label>" +
                  "<select name='flip'>"   +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.flip) +
                  "</select>"              +
                "</div>");

  pParam.append("<div class='bps'>"        +
                  "<label><i></i></label>" +
                  "<select name='bps'>"    +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.bps) +
                  "</select>"              +
                "</div>");

  pParam.append("<div class='fps'>"        +
                  "<label><i></i></label>" +
                  "<select name='fps'>"    +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.fps) +
                  "</select>"              +
                "</div>");

  pParam.append("<h2 class='effect'><i></i></h2>");

  pParam.append("<div class='sharpness'>"  +
                  "<label><i></i></label>" +
                  "<input name='sharpness' type='range' min='" + objTransmitter.sharpness.min + "' max='" + objTransmitter.sharpness.max + "'/>" +
                "</div>");

  pParam.append("<div class='contrast'>"   +
                  "<label><i></i></label>" +
                  "<input name='contrast' type='range' min='" + objTransmitter.contrast.min + "' max='" + objTransmitter.contrast.max + "'/>" +
                "</div>");

  pParam.append("<div class='brightness'>" +
                  "<label><i></i></label>" +
                  "<input name='brightness' type='range' min='" + objTransmitter.brightness.min + "' max='" + objTransmitter.brightness.max + "'/>" +
                "</div>");

  pParam.append("<div class='saturation'>" +
                  "<label><i></i></label>" +
                  "<input name='saturation' type='range' min='" + objTransmitter.saturation.min + "' max='" + objTransmitter.saturation.max + "'/>" +
                "</div>");

  pParam.append("<div class='iso'>"        +
                  "<label><i></i></label>" +
                  "<select name='iso'>"    +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.iso) +
                  "</select>"              +
                "</div>");

  pParam.append("<div class='exposureMode'>"     +
                  "<label><i></i></label>"       +
                  "<select name='exposureMode'>" +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.exposureMode) +
                  "</select>"                    +
                "</div>");

  pParam.append("<div class='whiteBalance'>"     +
                  "<label><i></i></label>"       +
                  "<select name='whiteBalance'>" +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.whiteBalance) +
                  "</select>"                    +
                "</div>");

  pParam.append("<div class='meteringMode'>"     +
                  "<label><i></i></label>"       +
                  "<select name='meteringMode'>" +
                    $.nictRaspberryPi.createHtmlOption(objTransmitter.meteringMode) +
                  "</select>"                    +
                "</div>");
},
/******************************************************************************/
/* nictRaspberryPi.createParamSdiCamera                                       */
/******************************************************************************/
createParamSdiCamera : function(pParam)
{
  var objTransmitter = $Env.transmitter.sdiCamera.ConfigurationOptions;

  pParam.append("<div class='zoom'>"       +
                  "<label><i></i></label>" +
                  "<input name='zoom' type='range' min='" + objTransmitter.zoom.min + "' max='" + objTransmitter.zoom.max + "'/>" +
                "</div>");
},
/******************************************************************************/
/* nictRaspberryPi.createParamIpCamera                                        */
/******************************************************************************/
createParamIpCamera : function(pParam, pTransmitter)
{
  if (!pTransmitter) return;
/*-----* resolution *---------------------------------------------------------*/
  if (Array.isArray(pTransmitter.ResolutionsAvailable) && pTransmitter.ResolutionsAvailable.length > 0)
  {
    var objResolutionsAvailable = {};

    for (var i01 = 0; i01 < pTransmitter.ResolutionsAvailable.length; i01++)
    {
      var objResolution = pTransmitter.ResolutionsAvailable[i01];
      var strResolution = objResolution.Width + "x" + objResolution.Height;

      objResolutionsAvailable[strResolution] = strResolution;
    }

    pParam.append("<div class='resolution'>"     +
                    "<label><i></i></label>"     +
                    "<select name='resolution'>" +
                      $.nictRaspberryPi.createHtmlOption(objResolutionsAvailable) +
                    "</select>"                  +
                  "</div>");
  }
/*-----* quality *------------------------------------------------------------*/
  if (pTransmitter.QualityRange && typeof pTransmitter.QualityRange.Min == "number" && typeof pTransmitter.QualityRange.Max == "number")
  {
    pParam.append("<div class='quality'>"    +
                    "<label><i></i></label>" +
                    "<input name='quality' type='range' min='" + pTransmitter.QualityRange.Min + "' max='" + pTransmitter.QualityRange.Max + "'/>" +
                  "</div>");
  }
/*-----* bps *----------------------------------------------------------------*/
  pParam.append("<div class='bps'>"        +
                  "<label><i></i></label>" +
                  "<select name='bps'>"    +
                    $.nictRaspberryPi.createHtmlOption($Env.transmitter.ipCamera.ConfigurationOptions.bps) +
                  "</select>"              +
                "</div>");
/*-----* fps *----------------------------------------------------------------*/
  if (pTransmitter.FrameRateRange && typeof pTransmitter.FrameRateRange.Min == "number" && typeof pTransmitter.FrameRateRange.Max == "number")
  {
    var objFrameRateRange = {};

    for (var i01 = pTransmitter.FrameRateRange.Min; i01 <= pTransmitter.FrameRateRange.Max; i01++)
    {
      objFrameRateRange[i01 + "fps"] = i01;
    }

    pParam.append("<div class='fps'>"        +
                    "<label><i></i></label>" +
                    "<select name='fps'>"    +
                      $.nictRaspberryPi.createHtmlOption(objFrameRateRange) +
                    "</select>"              +
                  "</div>");
  }
/*-----* focus *----------------------------------------------------------------*/
  if (pTransmitter.Focus)
  {
    if (Array.isArray(pTransmitter.Focus.AutoFocusModes) && pTransmitter.Focus.AutoFocusModes.length > 1)
    {
      var objAutoFocusModes = {};

      for (var i01 = 0; i01 < pTransmitter.Focus.AutoFocusModes.length; i01++)
      {
        objAutoFocusModes[pTransmitter.Focus.AutoFocusModes[i01]] = pTransmitter.Focus.AutoFocusModes[i01];
      }

      pParam.append("<div class='focusMode'>"     +
                      "<label><i></i></label>"    +
                      "<select name='focusMode'>" +
                        $.nictRaspberryPi.createHtmlOption(objAutoFocusModes) +
                      "</select>"                 +
                    "</div>");
    }

    if (pTransmitter.Focus.DefaultSpeed && typeof pTransmitter.Focus.DefaultSpeed.Min == "number" && typeof pTransmitter.Focus.DefaultSpeed.Max == "number")
    {
      pParam.append("<div class='focusSpeed'>"  +
                      "<label><i></i></label>"  +
                      "<input name='focusSpeed' type='range' step='0.1' min='" + pTransmitter.Focus.DefaultSpeed.Min + "' max='" + pTransmitter.Focus.DefaultSpeed.Max + "'/>" +
                    "</div>");
    }

    if (pTransmitter.Focus.NearLimit && typeof pTransmitter.Focus.NearLimit.Min == "number" && typeof pTransmitter.Focus.NearLimit.Max == "number")
    {
      pParam.append("<div class='focusNearLimit'>" +
                      "<label><i></i></label>"     +
                      "<div>"                      +
                        "<label></label>"          +
                        "<input name='focusNearLimit' type='range' step='0.1' min='" + pTransmitter.Focus.NearLimit.Min + "' max='" + pTransmitter.Focus.NearLimit.Max + "'/>" +
                      "</div>"                     +
                    "</div>");
    }

    if (pTransmitter.Focus.FarLimit && typeof pTransmitter.Focus.FarLimit.Min == "number" && typeof pTransmitter.Focus.FarLimit.Max == "number")
    {
      pParam.append("<div class='focusFarLimit'>" +
                      "<label><i></i></label>"    +
                      "<div>"                     +
                        "<label></label>"         +
                        "<input name='focusFarLimit' type='range' step='0.1' min='" + pTransmitter.Focus.FarLimit.Min + "' max='" + pTransmitter.Focus.FarLimit.Max + "'/>" +
                      "</div>"                    +
                    "</div>");
    }
  }
/*-----* pan & tilt *---------------------------------------------------------*/
  if (pTransmitter.PanTiltSpeedSpace && pTransmitter.PanTiltSpeedSpace.XRange && typeof pTransmitter.PanTiltSpeedSpace.XRange.Min == "number" && typeof pTransmitter.PanTiltSpeedSpace.XRange.Max == "number")
  {
    pParam.append("<div class='panTilt'>"                                                                        +
                    "<label><i></i></label>"                                                                     +
                    "<div>"                                                                                      +
                      "<table>"                                                                                  +
                        "<tr>"                                                                                   +
                          "<td><button type='button' name='panTiltUpLeft'   ><i></i></button></td>"              +
                          "<td><button type='button' name='panTiltUp'       ><i></i></button></td>"              +
                          "<td><button type='button' name='panTiltUpRight'  ><i></i></button></td>"              +
                        "</tr>"                                                                                  +
                        "<tr>"                                                                                   +
                          "<td><button type='button' name='panTiltLeft'     ><i></i></button></td>"              +
                          "<td></td>"                                                                            +
                          "<td><button type='button' name='panTiltRight'    ><i></i></button></td>"              +
                        "</tr>"                                                                                  +
                        "<tr>"                                                                                   +
                          "<td><button type='button' name='panTiltDownLeft' ><i></i></button></td>"              +
                          "<td><button type='button' name='panTiltDown'     ><i></i></button></td>"              +
                          "<td><button type='button' name='panTiltDownRight'><i></i></button></td>"              +
                        "</tr>"                                                                                  +
                      "</table>"                                                                                 +
                      "<label class='panTiltSpeed'>"                              + ((pTransmitter.PanTiltSpeedSpace.XRange.Min             + pTransmitter.PanTiltSpeedSpace.XRange.Max) / 2).toFixed(1) + "</label>" +
                      "<input  name='panTiltSpeed' type='range' step='0.1' min='" +   pTransmitter.PanTiltSpeedSpace.XRange.Min + "' max='" + pTransmitter.PanTiltSpeedSpace.XRange.Max + "'/>" +
                      "<label class='panTiltTime' >5.0</label>"                                                  +
                      "<input  name='panTiltTime'  type='range' step='100' min='100' max='10000' value='5000'/>" +
                    "</div>"                                                                                     +
                  "</div>");
  }
/*-----* zoom *---------------------------------------------------------------*/
  if (pTransmitter.ZoomSpeedSpace && pTransmitter.ZoomSpeedSpace.XRange && typeof pTransmitter.ZoomSpeedSpace.XRange.Min == "number" && typeof pTransmitter.ZoomSpeedSpace.XRange.Max == "number")
  {
    pParam.append("<div class='zoom'>"                                                                        +
                    "<label><i></i></label>"                                                                  +
                    "<div>"                                                                                   +
                      "<table>"                                                                               +
                        "<tr>"                                                                                +
                          "<td><button type='button' name='zoomOut'><i></i></button></td>"                    +
                          "<td><button type='button' name='zoomIn' ><i></i></button></td>"                    +
                        "</tr>"                                                                               +
                      "</table>"                                                                              +
                      "<label class='zoomSpeed'>"                              + ((pTransmitter.ZoomSpeedSpace.XRange.Min             + pTransmitter.ZoomSpeedSpace.XRange.Max) / 2).toFixed(1) + "</label>" +
                      "<input  name='zoomSpeed' type='range' step='0.1' min='" +   pTransmitter.ZoomSpeedSpace.XRange.Min + "' max='" + pTransmitter.ZoomSpeedSpace.XRange.Max + "'/>" +
                      "<label class='zoomTime' >5.0</label>"                                                  +
                      "<input  name='zoomTime'  type='range' step='100' min='100' max='10000' value='5000'/>" +
                    "</div>"                                                                                  +
                  "</div>");
  }
/*-----* efect *--------------------------------------------------------------*/
  if ((pTransmitter.Sharpness       && typeof pTransmitter.Sharpness      .Min == "number" && typeof pTransmitter.Sharpness      .Max == "number")
  ||  (pTransmitter.Contrast        && typeof pTransmitter.Contrast       .Min == "number" && typeof pTransmitter.Contrast       .Max == "number")
  ||  (pTransmitter.Brightness      && typeof pTransmitter.Brightness     .Min == "number" && typeof pTransmitter.Brightness     .Max == "number")
  ||  (pTransmitter.ColorSaturation && typeof pTransmitter.ColorSaturation.Min == "number" && typeof pTransmitter.ColorSaturation.Max == "number"))
  {
    pParam.append("<h2 class='effect'><i></i></h2>");
  }

  if (pTransmitter.Sharpness && typeof pTransmitter.Sharpness.Min == "number" && typeof pTransmitter.Sharpness.Max == "number")
  {
    pParam.append("<div class='sharpness'>"  +
                    "<label><i></i></label>" +
                    "<input name='sharpness' type='range' min='" + pTransmitter.Sharpness.Min + "' max='" + pTransmitter.Sharpness.Max + "'/>" +
                  "</div>");
  }

  if (pTransmitter.Contrast && typeof pTransmitter.Contrast.Min == "number" && typeof pTransmitter.Contrast.Max == "number")
  {
    pParam.append("<div class='contrast'>"   +
                    "<label><i></i></label>" +
                    "<input name='contrast' type='range' min='" + pTransmitter.Contrast.Min + "' max='" + pTransmitter.Contrast.Max + "'/>" +
                  "</div>");
  }

  if (pTransmitter.Brightness && typeof pTransmitter.Brightness.Min == "number" && typeof pTransmitter.Brightness.Max == "number")
  {
    pParam.append("<div class='brightness'>" +
                    "<label><i></i></label>" +
                    "<input name='brightness' type='range' min='" + pTransmitter.Brightness.Min + "' max='" + pTransmitter.Brightness.Max + "'/>" +
                  "</div>");
  }

  if (pTransmitter.ColorSaturation && typeof pTransmitter.ColorSaturation.Min == "number" && typeof pTransmitter.ColorSaturation.Max == "number")
  {
    pParam.append("<div class='saturation'>" +
                    "<label><i></i></label>" +
                    "<input name='saturation' type='range' min='" + pTransmitter.ColorSaturation.Min + "' max='" + pTransmitter.ColorSaturation.Max + "'/>" +
                  "</div>");
  }
/*-----* reboot *-------------------------------------------------------------*/
  pParam.append("<div class='reboot'><span><i></i></span><input name='reboot' type='number' value='1' style='display:none'/></div>");
},
/******************************************************************************/
/* nictRaspberryPi.createHtmlOption                                           */
/******************************************************************************/
createHtmlOption : function(pObject)
{
  var strOption = "";

  for (var strName in pObject)
  {
    strOption += "<option value='" + pObject[strName] + "'>" + strName + "</Option>";
  }

  return strOption;
},
/******************************************************************************/
/* nictRaspberryPi.setDisabledStatus                                          */
/******************************************************************************/
setDisabledStatus : function(pLi, pAlive)
{
  if (pAlive)
  {
    if (pLi.data("setDisabledStatus"))
    {
      clearTimeout(pLi.data("setDisabledStatus"));
                   pLi.data("setDisabledStatus", null);
    }

    pLi.removeClass("disabled" );
    pLi.removeClass("disabled2");
  }
  else if (!pLi.hasClass("disabled"))
  {
    if (!pLi.data("setDisabledStatus"))
    {
      pLi.data("setDisabledStatus", setTimeout(function()
      {
        pLi.addClass("disabled2");
        pLi.data    ("setDisabledStatus", null);
      }, 60000));
    }

    pLi.addClass("disabled");
  }
},
/******************************************************************************/
/* nictRaspberryPi.setDistributionStatus                                      */
/******************************************************************************/
setDistributionStatus : function(pLi, pConnect)
{
  if (pLi.find(".connect").length <= 0) return;

  pLi.find("[name='connect']").val(pConnect);

  if (pConnect == 0)
  {
    if (pLi.data("setDistributionStatus"))
    {
      clearTimeout(pLi.data("setDistributionStatus"));
                   pLi.data("setDistributionStatus", null);
    }

    pLi                    .removeClass("distribution");
    pLi.find(".tab .video").removeClass("disabled");
  }
  else if (!pLi.hasClass("distribution"))
  {
    if (!pLi.data("setDistributionStatus"))
    {
      pLi.data("setDistributionStatus", setTimeout(function()
      {
        pLi.find(".tab .video").removeClass("disabled");
        pLi.data("setDistributionStatus", null);
      }, $Env.changeVideoTime));

      pLi.find(".tab .video").addClass("disabled");
    }

    pLi.addClass("distribution");
  }
},
/******************************************************************************/
/* nictRaspberryPi.blinkTransmitterStatus                                     */
/******************************************************************************/
blinkTransmitterStatus : function(pLi, pJson)
{
  var flgChange = false;
/*-----* common *-------------------------------------------------------------*/
  if (parseInt(pLi.find("[name='createImageInterval' ]").val(), 10) != pJson.Configuration.createImageInterval ) { pLi.find(".createImageInterval" ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='createImageQuality'  ]").val(), 10) != pJson.Configuration.createImageQuality  ) { pLi.find(".createImageQuality"  ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='createImageTimeStamp']").val(), 10) != pJson.Configuration.createImageTimeStamp) { pLi.find(".createImageTimeStamp").addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='saveImage'           ]").val(), 10) != pJson              .saveImage           ) { pLi.find(".saveImage"           ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='saveVideoInterval'   ]").val(), 10) != pJson.Configuration.saveVideoInterval   ) { pLi.find(".saveVideo"           ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='saveVideoDuration'   ]").val(), 10) != pJson.Configuration.saveVideoDuration   ) { pLi.find(".saveVideo"           ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='saveVideo'           ]").val(), 10) != pJson.Configuration.saveVideo           ) { pLi.find(".saveVideo"           ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='adaptiveControl'     ]").val(), 10) != pJson.Configuration.adaptiveControl     ) { pLi.find(".adaptiveControl"     ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='fecLevel'            ]").val(), 10) != pJson.Configuration.fecLevel            ) { pLi.find(".fecLevel"            ).addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='heartBeat'           ]").val(), 10) != pJson.Configuration.heartBeat           ) { pLi.find(".heartBeat"           ).addClass("blinking"); flgChange = true; }

  if (pLi.find(".connect").length > 0)
  {
  if (parseInt(pLi.find("[name='connect'             ]").val(), 10) != pJson.Configuration.connect             ) { pLi.find(".connect"             ).addClass("blinking"); flgChange = true; }
  }
/*-----* standard *-----------------------------------------------------------*/
  if (pJson.Configuration.cameraType == "standard")
  {
    var strResolution = pJson.Configuration.width + "x" + pJson.Configuration.height;

    if (         pLi.find("[name='resolution'  ]").val()      != strResolution                   ) { pLi.find(".resolution"  ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='rotation'    ]").val(), 10) != pJson.Configuration.rotation    ) { pLi.find(".rotation"    ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='flip'        ]").val(), 10) != pJson.Configuration.flip        ) { pLi.find(".flip"        ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='bps'         ]").val(), 10) != pJson.Configuration.bps         ) { pLi.find(".bps"         ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='fps'         ]").val(), 10) != pJson.Configuration.fps         ) { pLi.find(".fps"         ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='sharpness'   ]").val(), 10) != pJson.Configuration.sharpness   ) { pLi.find(".sharpness"   ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='contrast'    ]").val(), 10) != pJson.Configuration.contrast    ) { pLi.find(".contrast"    ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='brightness'  ]").val(), 10) != pJson.Configuration.brightness  ) { pLi.find(".brightness"  ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='saturation'  ]").val(), 10) != pJson.Configuration.saturation  ) { pLi.find(".saturation"  ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='iso'         ]").val(), 10) != pJson.Configuration.iso         ) { pLi.find(".iso"         ).addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='exposureMode']").val(), 10) != pJson.Configuration.exposureMode) { pLi.find(".exposureMode").addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='whiteBalance']").val(), 10) != pJson.Configuration.whiteBalance) { pLi.find(".whiteBalance").addClass("blinking"); flgChange = true; }
    if (parseInt(pLi.find("[name='meteringMode']").val(), 10) != pJson.Configuration.meteringMode) { pLi.find(".meteringMode").addClass("blinking"); flgChange = true; }
  }
/*-----* sdi camera *---------------------------------------------------------*/
  else if (pJson.Configuration.cameraType == "sdicamera")
  {
    if (parseInt(pLi.find("[name='zoom']").val(), 10) != pJson.Configuration.zoom) { pLi.find(".zoom").addClass("blinking"); flgChange = true; }
  }
/*-----* ip camera *----------------------------------------------------------*/
  else
  {
    var strResolution     =        pJson.Configuration.width + "x" + pJson.Configuration.height;
    var intFocusSpeed     = typeof pJson.Configuration.focusSpeed     == "number" ? pJson.Configuration.focusSpeed     : parseFloat(pLi.find("[name='focusSpeed'    ]").val());
    var intFocusNearLimit = typeof pJson.Configuration.focusNearLimit == "number" ? pJson.Configuration.focusNearLimit : parseFloat(pLi.find("[name='focusNearLimit']").val());
    var intFocusFarLimit  = typeof pJson.Configuration.focusFarLimit  == "number" ? pJson.Configuration.focusFarLimit  : parseFloat(pLi.find("[name='focusFarLimit' ]").val());

    if (pLi.find(".resolution"    ).length > 0) { if (           pLi.find("[name='resolution'    ]").val()      != strResolution                     ) { pLi.find(".resolution"    ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".quality"       ).length > 0) { if (parseFloat(pLi.find("[name='quality'       ]").val()    ) != pJson.Configuration.quality       ) { pLi.find(".quality"       ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".bps"           ).length > 0) { if (parseInt  (pLi.find("[name='bps'           ]").val(), 10) != pJson.Configuration.bps           ) { pLi.find(".bps"           ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".fps"           ).length > 0) { if (parseInt  (pLi.find("[name='fps'           ]").val(), 10) != pJson.Configuration.fps           ) { pLi.find(".fps"           ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".focusMode"     ).length > 0) { if (           pLi.find("[name='focusMode'     ]").val()      != pJson.Configuration.focusMode     ) { pLi.find(".focusMode"     ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".focusSpeed"    ).length > 0) { if (parseFloat(pLi.find("[name='focusSpeed'    ]").val()    ) !=                  intFocusSpeed    ) { pLi.find(".focusSpeed"    ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".focusNearLimit").length > 0) { if (parseFloat(pLi.find("[name='focusNearLimit']").val()    ) !=                  intFocusNearLimit) { pLi.find(".focusNearLimit").addClass("blinking"); flgChange = true; } }
    if (pLi.find(".focusFarLimit" ).length > 0) { if (parseFloat(pLi.find("[name='focusFarLimit' ]").val()    ) !=                  intFocusFarLimit ) { pLi.find(".focusFarLimit" ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".sharpness"     ).length > 0) { if (parseInt  (pLi.find("[name='sharpness'     ]").val(), 10) != pJson.Configuration.sharpness     ) { pLi.find(".sharpness"     ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".contrast"      ).length > 0) { if (parseInt  (pLi.find("[name='contrast'      ]").val(), 10) != pJson.Configuration.contrast      ) { pLi.find(".contrast"      ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".brightness"    ).length > 0) { if (parseInt  (pLi.find("[name='brightness'    ]").val(), 10) != pJson.Configuration.brightness    ) { pLi.find(".brightness"    ).addClass("blinking"); flgChange = true; } }
    if (pLi.find(".saturation"    ).length > 0) { if (parseInt  (pLi.find("[name='saturation'    ]").val(), 10) != pJson.Configuration.saturation    ) { pLi.find(".saturation"    ).addClass("blinking"); flgChange = true; } }
  }

  return flgChange;
},
/******************************************************************************/
/* nictRaspberryPi.setTransmitterStatus                                       */
/******************************************************************************/
setTransmitterStatus : function(pLi, pJson)
{
/*-----* set ip camera configuration default *--------------------------------*/
  if (pJson.Configuration.cameraType == "ipcamera")
  {
    var objConfigurationDefault = $.extend({}, $Env.transmitter.ipCamera.ConfigurationDefault);

    if (pJson.ConfigurationOptions)
    {
      var objTransmitter = pJson.ConfigurationOptions;

      if (Array.isArray(objTransmitter.ResolutionsAvailable) && objTransmitter.ResolutionsAvailable.length > 0)
      {
        objConfigurationDefault.width  = objTransmitter.ResolutionsAvailable[0].Width;
        objConfigurationDefault.height = objTransmitter.ResolutionsAvailable[0].Height;
      }

      if (objTransmitter.QualityRange    && typeof objTransmitter.QualityRange   .Min == "number" && typeof objTransmitter.QualityRange   .Max == "number") objConfigurationDefault.quality    = Math.round((objTransmitter.QualityRange   .Max - objTransmitter.QualityRange   .Min) / 2) + objTransmitter.QualityRange   .Min;
      if (objTransmitter.FrameRateRange  && typeof objTransmitter.FrameRateRange .Min == "number" && typeof objTransmitter.FrameRateRange .Max == "number") objConfigurationDefault.fps        = Math.round((objTransmitter.FrameRateRange .Max - objTransmitter.FrameRateRange .Min) / 2) + objTransmitter.FrameRateRange .Min;
      if (objTransmitter.Sharpness       && typeof objTransmitter.Sharpness      .Min == "number" && typeof objTransmitter.Sharpness      .Max == "number") objConfigurationDefault.sharpness  = Math.round((objTransmitter.Sharpness      .Max - objTransmitter.Sharpness      .Min) / 2) + objTransmitter.Sharpness      .Min;
      if (objTransmitter.Contrast        && typeof objTransmitter.Contrast       .Min == "number" && typeof objTransmitter.Contrast       .Max == "number") objConfigurationDefault.contrast   = Math.round((objTransmitter.Contrast       .Max - objTransmitter.Contrast       .Min) / 2) + objTransmitter.Contrast       .Min;
      if (objTransmitter.Brightness      && typeof objTransmitter.Brightness     .Min == "number" && typeof objTransmitter.Brightness     .Max == "number") objConfigurationDefault.brightness = Math.round((objTransmitter.Brightness     .Max - objTransmitter.Brightness     .Min) / 2) + objTransmitter.Brightness     .Min;
      if (objTransmitter.ColorSaturation && typeof objTransmitter.ColorSaturation.Min == "number" && typeof objTransmitter.ColorSaturation.Max == "number") objConfigurationDefault.saturation = Math.round((objTransmitter.ColorSaturation.Max - objTransmitter.ColorSaturation.Min) / 2) + objTransmitter.ColorSaturation.Min;

      if (objTransmitter.Focus)
      {
        if (Array.isArray(objTransmitter.Focus.AutoFocusModes) &&        objTransmitter.Focus.AutoFocusModes.length >  1                                                                   ) objConfigurationDefault.focusMode      =             objTransmitter.Focus.AutoFocusModes[0];
        if (              objTransmitter.Focus.DefaultSpeed    && typeof objTransmitter.Focus.DefaultSpeed  .Min    == "number" && typeof objTransmitter.Focus.DefaultSpeed.Max == "number") objConfigurationDefault.focusSpeed     = Math.round((objTransmitter.Focus.DefaultSpeed.Max - objTransmitter.Focus.DefaultSpeed.Min) / 2) + objTransmitter.Focus.DefaultSpeed.Min;
        if (              objTransmitter.Focus.NearLimit       && typeof objTransmitter.Focus.NearLimit     .Min    == "number" && typeof objTransmitter.Focus.NearLimit   .Max == "number") objConfigurationDefault.focusNearLimit = Math.round((objTransmitter.Focus.NearLimit   .Max - objTransmitter.Focus.NearLimit   .Min) / 2) + objTransmitter.Focus.NearLimit   .Min;
        if (              objTransmitter.Focus.FarLimit        && typeof objTransmitter.Focus.FarLimit      .Min    == "number" && typeof objTransmitter.Focus.FarLimit    .Max == "number") objConfigurationDefault.focusFarLimit  = Math.round((objTransmitter.Focus.FarLimit    .Max - objTransmitter.Focus.FarLimit    .Min) / 2) + objTransmitter.Focus.FarLimit    .Min;
      }

      pLi.data("ConfigurationDefault", objConfigurationDefault);
    }

    if (pJson.ConfigurationDefault)
    {
      var objTransmitter = pJson.ConfigurationDefault;

      if ("width"          in objTransmitter) objConfigurationDefault.width          = objTransmitter.width;
      if ("height"         in objTransmitter) objConfigurationDefault.height         = objTransmitter.height;
      if ("quality"        in objTransmitter) objConfigurationDefault.quality        = objTransmitter.quality;
      if ("bps"            in objTransmitter) objConfigurationDefault.bps            = objTransmitter.bps;
      if ("fps"            in objTransmitter) objConfigurationDefault.fps            = objTransmitter.fps;
      if ("focusMode"      in objTransmitter) objConfigurationDefault.focusMode      = objTransmitter.focusMode;
      if ("focusSpeed"     in objTransmitter) objConfigurationDefault.focusSpeed     = objTransmitter.focusSpeed;
      if ("focusNearLimit" in objTransmitter) objConfigurationDefault.focusNearLimit = objTransmitter.focusNearLimit;
      if ("focusFarLimit"  in objTransmitter) objConfigurationDefault.focusFarLimit  = objTransmitter.focusFarLimit;
      if ("sharpness"      in objTransmitter) objConfigurationDefault.sharpness      = objTransmitter.sharpness;
      if ("contrast"       in objTransmitter) objConfigurationDefault.contrast       = objTransmitter.contrast;
      if ("brightness"     in objTransmitter) objConfigurationDefault.brightness     = objTransmitter.brightness;
      if ("saturation"     in objTransmitter) objConfigurationDefault.saturation     = objTransmitter.saturation;

      pLi.data("ConfigurationDefault", objConfigurationDefault);
    }
  }
/*-----* resolution *---------------------------------------------------------*/
  var strResolution;

  if (typeof pJson.Configuration.width == "number" && typeof pJson.Configuration.height == "number") strResolution = pJson.Configuration.width + "x" + pJson.Configuration.height;
  else                                                                                               strResolution = "";
/*-----* set status *---------------------------------------------------------*/
                                                pLi.find("[name='createImageInterval' ]").val(       pJson.Configuration.createImageInterval );
                                                pLi.find("[name='createImageQuality'  ]").val(       pJson.Configuration.createImageQuality  );
                                                pLi.find("[name='createImageTimeStamp']").val(       pJson.Configuration.createImageTimeStamp);
                                                pLi.find("[name='saveImage'           ]").val(       pJson              .saveImage           );
                                                pLi.find("[name='saveVideoInterval'   ]").val(       pJson.Configuration.saveVideoInterval   );
                                                pLi.find("[name='saveVideoDuration'   ]").val(       pJson.Configuration.saveVideoDuration   );
                                                pLi.find("[name='saveVideo'           ]").val(       pJson.Configuration.saveVideo           );
                                                pLi.find("[name='adaptiveControl'     ]").val(       pJson.Configuration.adaptiveControl     );
                                                pLi.find("[name='fecLevel'            ]").val(       pJson.Configuration.fecLevel            );
                                                pLi.find("[name='heartBeat'           ]").val(       pJson.Configuration.heartBeat           );
  if (pLi.find(".resolution"    ).length > 0)   pLi.find("[name='resolution'          ]").val(                        strResolution          );
  if (pLi.find(".quality"       ).length > 0)   pLi.find("[name='quality'             ]").val(       pJson.Configuration.quality             );
  if (pLi.find(".rotation"      ).length > 0)   pLi.find("[name='rotation'            ]").val(       pJson.Configuration.rotation            );
  if (pLi.find(".flip"          ).length > 0)   pLi.find("[name='flip'                ]").val(       pJson.Configuration.flip                );
  if (pLi.find(".focusMode"     ).length > 0)   pLi.find("[name='focusMode'           ]").val(       pJson.Configuration.focusMode           );
  if (pLi.find(".focusSpeed"    ).length > 0)   pLi.find("[name='focusSpeed'          ]").val(typeof pJson.Configuration.focusSpeed     == "number" ? pJson.Configuration.focusSpeed     : pLi.data("ConfigurationDefault").focusSpeed    );
  if (pLi.find(".focusNearLimit").length > 0) { pLi.find("[name='focusNearLimit'      ]").val(typeof pJson.Configuration.focusNearLimit == "number" ? pJson.Configuration.focusNearLimit : pLi.data("ConfigurationDefault").focusNearLimit); pLi.find(".focusNearLimit div label").text((typeof pJson.Configuration.focusNearLimit == "number" ? pJson.Configuration.focusNearLimit : pLi.data("ConfigurationDefault").focusNearLimit).toFixed(1)); }
  if (pLi.find(".focusFarLimit" ).length > 0) { pLi.find("[name='focusFarLimit'       ]").val(typeof pJson.Configuration.focusFarLimit  == "number" ? pJson.Configuration.focusFarLimit  : pLi.data("ConfigurationDefault").focusFarLimit ); pLi.find(".focusFarLimit  div label").text((typeof pJson.Configuration.focusFarLimit  == "number" ? pJson.Configuration.focusFarLimit  : pLi.data("ConfigurationDefault").focusFarLimit ).toFixed(1)); }
  if (pLi.find(".sharpness"     ).length > 0)   pLi.find("[name='sharpness'           ]").val(       pJson.Configuration.sharpness           );
  if (pLi.find(".contrast"      ).length > 0)   pLi.find("[name='contrast'            ]").val(       pJson.Configuration.contrast            );
  if (pLi.find(".brightness"    ).length > 0)   pLi.find("[name='brightness'          ]").val(       pJson.Configuration.brightness          );
  if (pLi.find(".saturation"    ).length > 0)   pLi.find("[name='saturation'          ]").val(       pJson.Configuration.saturation          );
  if (pLi.find(".iso"           ).length > 0)   pLi.find("[name='iso'                 ]").val(       pJson.Configuration.iso                 );
  if (pLi.find(".exposureMode"  ).length > 0)   pLi.find("[name='exposureMode'        ]").val(       pJson.Configuration.exposureMode        );
  if (pLi.find(".whiteBalance"  ).length > 0)   pLi.find("[name='whiteBalance'        ]").val(       pJson.Configuration.whiteBalance        );
  if (pLi.find(".meteringMode"  ).length > 0)   pLi.find("[name='meteringMode'        ]").val(       pJson.Configuration.meteringMode        );
/*-----* set status(bps) *----------------------------------------------------*/
  if (pLi.find(".bps").length > 0)
  {
    if (pLi.find("[name='bps'] option[value='" + pJson.Configuration.bps + "']").length > 0)
      pLi.find("[name='bps']").val(pJson.Configuration.bps);
    else
    {
      var $option;

      if (pJson.Configuration.cameraType == "standard") $option =$("<option value='" + pJson.Configuration.bps + "'>" + (pJson.Configuration.bps < 1000000 ? (pJson.Configuration.bps / 1000).toString() + "Kbps" : (pJson.Configuration.bps / 1000000).toString() + "Mbps") + "</option>");
      else                                              $option =$("<option value='" + pJson.Configuration.bps + "'>" + (pJson.Configuration.bps <    1024 ?  pJson.Configuration.bps        .toString() + "Kbps" : (pJson.Configuration.bps /    1024).toString() + "Mbps") + "</option>");

      if (parseInt(pLi.find("[name='bps'] option:last").attr("value"), 10) < pJson.Configuration.bps)
      {
        pLi.find("[name='bps']").append($option);
        pLi.find("[name='bps']").val   (pJson.Configuration.bps);
      }
      else
      {
        pLi.find("[name='bps'] option").each(function(pIndex, pElement)
        {
          if (parseInt($(pElement).attr("value"), 10) > pJson.Configuration.bps)
          {
            $(pElement).before($option);
            pLi.find("[name='bps']").val(pJson.Configuration.bps);
            return false;
          }
        });
      }
    }
  }
/*-----* set status(fps) *----------------------------------------------------*/
  if (pLi.find(".fps").length > 0)
  {
    if (pLi.find("[name='fps'] option[value='" + pJson.Configuration.fps + "']").length > 0)
      pLi.find("[name='fps']").val(pJson.Configuration.fps);
    else
    {
      var $option =$("<option value='" + pJson.Configuration.fps + "'>" + pJson.Configuration.fps + "fps</option>");

      if (parseInt(pLi.find("[name='fps'] option:last").attr("value"), 10) < pJson.Configuration.fps)
      {
        pLi.find("[name='fps']").append($option);
        pLi.find("[name='fps']").val   (pJson.Configuration.fps);
      }
      else
      {
        pLi.find("[name='fps'] option").each(function(pIndex, pElement)
        {
          if (parseInt($(pElement).attr("value"), 10) > pJson.Configuration.fps)
          {
            $(pElement).before($option);
            pLi.find("[name='fps']").val(pJson.Configuration.fps);
            return false;
          }
        });
      }
    }
  }
/*-----* sdi camera *---------------------------------------------------------*/
  if (pJson.Configuration.cameraType == "sdicamera")
  {
    pLi.find("[name='zoom']").val(pJson.Configuration.zoom);
  }
},
/******************************************************************************/
/* nictRaspberryPi.blinkReceiverStatus                                        */
/******************************************************************************/
blinkReceiverStatus : function(pLi, pJson)
{
  var flgChange = false;

  if (parseInt(pLi.find("[name='display']").val(), 10) != pJson.display) { pLi.find(".display").addClass("blinking"); flgChange = true; }
  if (parseInt(pLi.find("[name='delay'  ]").val(), 10) != pJson.delay  ) { pLi.find(".delay"  ).addClass("blinking"); flgChange = true; }

  return flgChange;
},
/******************************************************************************/
/* nictRaspberryPi.setReceiverStatus                                          */
/******************************************************************************/
setReceiverStatus : function(pLi, pJson)
{
  pLi.find("[name='display']").val(pJson.display);
  pLi.find("[name='delay'  ]").val(pJson.delay  );
},
/******************************************************************************/
/* nictRaspberryPi.isDefaultStatus                                            */
/******************************************************************************/
isDefaultStatus : function(pLi)
{
/*-----* common *-------------------------------------------------------------*/
  if (parseInt(pLi.find("[name='createImageInterval' ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.createImageInterval ) return false;
  if (parseInt(pLi.find("[name='createImageQuality'  ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.createImageQuality  ) return false;
  if (parseInt(pLi.find("[name='createImageTimeStamp']").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.createImageTimeStamp) return false;
  if (parseInt(pLi.find("[name='saveImage'           ]").val(), 10) != $Env.transmitter.ConfigurationDefault              .saveImage           ) return false;
  if (parseInt(pLi.find("[name='saveVideoInterval'   ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.saveVideoInterval   ) return false;
  if (parseInt(pLi.find("[name='saveVideoDuration'   ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.saveVideoDuration   ) return false;
  if (parseInt(pLi.find("[name='saveVideo'           ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.saveVideo           ) return false;
  if (parseInt(pLi.find("[name='adaptiveControl'     ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.adaptiveControl     ) return false;
  if (parseInt(pLi.find("[name='fecLevel'            ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.fecLevel            ) return false;
  if (parseInt(pLi.find("[name='heartBeat'           ]").val(), 10) != $Env.transmitter.ConfigurationDefault.Configuration.heartBeat           ) return false;
/*-----* standard *-----------------------------------------------------------*/
  if (pLi.attr("camera_type") == "standard")
  {
    var strResolution = $Env.transmitter.standardCamera.ConfigurationDefault.width + "x" + $Env.transmitter.standardCamera.ConfigurationDefault.height;

    if (         pLi.find("[name='resolution'  ]").val()      != strResolution                                                    ) return false;
    if (parseInt(pLi.find("[name='rotation'    ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.rotation    ) return false;
    if (parseInt(pLi.find("[name='flip'        ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.flip        ) return false;
    if (parseInt(pLi.find("[name='bps'         ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.bps         ) return false;
    if (parseInt(pLi.find("[name='fps'         ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.fps         ) return false;
    if (parseInt(pLi.find("[name='sharpness'   ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.sharpness   ) return false;
    if (parseInt(pLi.find("[name='contrast'    ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.contrast    ) return false;
    if (parseInt(pLi.find("[name='brightness'  ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.brightness  ) return false;
    if (parseInt(pLi.find("[name='saturation'  ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.saturation  ) return false;
    if (parseInt(pLi.find("[name='iso'         ]").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.iso         ) return false;
    if (parseInt(pLi.find("[name='exposureMode']").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.exposureMode) return false;
    if (parseInt(pLi.find("[name='whiteBalance']").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.whiteBalance) return false;
    if (parseInt(pLi.find("[name='meteringMode']").val(), 10) != $Env.transmitter.standardCamera.ConfigurationDefault.meteringMode) return false;
  }
/*-----* sdi camera *---------------------------------------------------------*/
  else if (pLi.attr("camera_type") == "sdicamera")
  {
    if (parseInt(pLi.find("[name='zoom']").val(), 10) != $Env.transmitter.sdiCamera.ConfigurationDefault.zoom) return false;
  }
/*-----* ip camera *----------------------------------------------------------*/
  else if (pLi.data("ConfigurationDefault"))
  {
    var strResolution = pLi.data("ConfigurationDefault").width + "x" + pLi.data("ConfigurationDefault").height;

    if (pLi.find(".resolution"    ).length > 0) { if (           pLi.find("[name='resolution'    ]").val()      != strResolution                                  ) return false; }
    if (pLi.find(".quality"       ).length > 0) { if (parseFloat(pLi.find("[name='quality'       ]").val()    ) != pLi.data("ConfigurationDefault").quality       ) return false; }
    if (pLi.find(".bps"           ).length > 0) { if (parseInt  (pLi.find("[name='bps'           ]").val(), 10) != pLi.data("ConfigurationDefault").bps           ) return false; }
    if (pLi.find(".fps"           ).length > 0) { if (parseInt  (pLi.find("[name='fps'           ]").val(), 10) != pLi.data("ConfigurationDefault").fps           ) return false; }
    if (pLi.find(".focusMode"     ).length > 0) { if (           pLi.find("[name='focusMode'     ]").val()      != pLi.data("ConfigurationDefault").focusMode     ) return false; }
    if (pLi.find(".focusSpeed"    ).length > 0) { if (parseFloat(pLi.find("[name='focusSpeed'    ]").val()    ) != pLi.data("ConfigurationDefault").focusSpeed    ) return false; }
    if (pLi.find(".focusNearLimit").length > 0) { if (parseFloat(pLi.find("[name='focusNearLimit']").val()    ) != pLi.data("ConfigurationDefault").focusNearLimit) return false; }
    if (pLi.find(".focusFarLimit" ).length > 0) { if (parseFloat(pLi.find("[name='focusFarLimit' ]").val()    ) != pLi.data("ConfigurationDefault").focusFarLimit ) return false; }
    if (pLi.find(".sharpness"     ).length > 0) { if (parseInt  (pLi.find("[name='sharpness'     ]").val(), 10) != pLi.data("ConfigurationDefault").sharpness     ) return false; }
    if (pLi.find(".contrast"      ).length > 0) { if (parseInt  (pLi.find("[name='contrast'      ]").val(), 10) != pLi.data("ConfigurationDefault").contrast      ) return false; }
    if (pLi.find(".brightness"    ).length > 0) { if (parseInt  (pLi.find("[name='brightness'    ]").val(), 10) != pLi.data("ConfigurationDefault").brightness    ) return false; }
    if (pLi.find(".saturation"    ).length > 0) { if (parseInt  (pLi.find("[name='saturation'    ]").val(), 10) != pLi.data("ConfigurationDefault").saturation    ) return false; }
  }
/*-----* receiver *----------------------------------------------------------*/
  if (!pLi.find(".display").hasClass("disconnect"))
  {
    if (parseInt(pLi.find("[name='display']").val(), 10) != $Env.receiver.ConfigurationDefault.display) return false;
    if (parseInt(pLi.find("[name='delay'  ]").val(), 10) != $Env.receiver.ConfigurationDefault.delay  ) return false;
  }

  return true;
},
/******************************************************************************/
/* nictRaspberryPi.getServeIndex                                              */
/******************************************************************************/
getServeIndex : function(pPath, pSuccess, pError)
{
  $.ajax(
  {
    type     : "GET",
    url      : pPath,
    dataType : "html"
  })
  .then(
    function(pHtml) { if (typeof pSuccess == "function") pSuccess($(pHtml).filter("#files").find("li:not(.header)")); },
    function()      { if (typeof pError   == "function") pError  (); }
  );
},
/******************************************************************************/
/* nictRaspberryPi.getYearList                                                */
/******************************************************************************/
getYearList : function(pServeIndex, pCallBack)
{
  var $list = $("<ul list_type='year_list'></ul>");

  $.nictRaspberryPi.getServeIndex(pServeIndex.yearList.path, function(pList)
  {
    var objPrevDate = null;
    var objDate;

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.yearList.pattern, pServeIndex.yearList.replacement));

      if (!objPrevDate || objDate.getFullYear() > objPrevDate.getFullYear())
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y")).attr("date", objDate.getTime()));
      }

      objPrevDate = objDate;
    });

    if (typeof pCallBack == "function") pCallBack($list);
  },
  function()
  {
    if (typeof pCallBack == "function") pCallBack($list);
  });
},
/******************************************************************************/
/* nictRaspberryPi.getMonthList                                               */
/******************************************************************************/
getMonthList : function(pServeIndex, pDate, pCallBack)
{
  var $list         = $("<ul list_type='month_list'></ul>");
  var objTargetDate = new Date($.nictRaspberryPi.formatDate(pDate        , "%y/12/31 23:59:59"));
  var strPath       =          $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.monthList.path);

  $.nictRaspberryPi.getServeIndex(strPath, function(pList)
  {
    var strReplacement = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.monthList.replacement);
    var objPrevDate    = null;
    var objDate;

    $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objTargetDate, "%y")).attr({ type:"header", date:objTargetDate.getTime() }));

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.monthList.pattern, strReplacement));

      if (objDate > objTargetDate) return false;

      if (objDate.getFullYear() == objTargetDate.getFullYear()
      && (!objPrevDate
      ||  objDate.getFullYear() >  objPrevDate  .getFullYear() || objDate.getMonth() > objPrevDate.getMonth()))
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y/%mm")).attr("date", objDate.getTime()));
      }

      objPrevDate = objDate;
    });

    if (typeof pCallBack == "function") pCallBack($list);
  },
  function()
  {
    if (typeof pCallBack == "function") pCallBack($list);
  });
},
/******************************************************************************/
/* nictRaspberryPi.getDayList                                                 */
/******************************************************************************/
getDayList : function(pServeIndex, pDate, pCallBack)
{
  var $list         = $("<ul list_type='day_list'></ul>");
  var objTargetDate = new Date(pDate.getFullYear(), pDate.getMonth() + 1, 0, 23, 59, 59);
  var strPath       = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.dayList.path);

  $.nictRaspberryPi.getServeIndex(strPath, function(pList)
  {
    var strReplacement = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.dayList.replacement);
    var objPrevDate    = null;
    var objDate;

    $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objTargetDate, "%y/%mm")).attr({ type:"header", date:objTargetDate.getTime() }));

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.dayList.pattern, strReplacement));

      if (objDate > objTargetDate) return false;

      if (objDate.getFullYear() == objTargetDate.getFullYear() && objDate.getMonth() == objTargetDate.getMonth()
      && (!objPrevDate
      ||  objDate.getFullYear() >  objPrevDate  .getFullYear() || objDate.getMonth() >  objPrevDate  .getMonth() || objDate.getDate() > objPrevDate.getDate()))
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y/%mm/%dd")).attr("date", objDate.getTime()));
      }

      objPrevDate = objDate;
    });

    if (typeof pCallBack == "function") pCallBack($list);
  },
  function()
  {
    if (typeof pCallBack == "function") pCallBack($list);
  });
},
/******************************************************************************/
/* nictRaspberryPi.getTimeList                                                */
/******************************************************************************/
getTimeList : function(pServeIndex, pDate, pCallBack)
{
  var $list         = $("<ul list_type='time_list'></ul>");
  var objTargetDate = new Date($.nictRaspberryPi.formatDate(pDate        , "%y/%m/%d 23:59:59"));
  var strPath       =          $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.timeList.path);

  $.nictRaspberryPi.getServeIndex(strPath, function(pList)
  {
    var strReplacement = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.timeList.replacement);
    var objDate;

    $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objTargetDate, "%y/%mm/%dd")).attr({ type:"header", date:objTargetDate.getTime() }));

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.timeList.pattern, strReplacement));

      if (objDate > objTargetDate) return false;

      if (objDate.getFullYear() == objTargetDate.getFullYear()
      &&  objDate.getMonth   () == objTargetDate.getMonth   ()
      &&  objDate.getDate    () == objTargetDate.getDate    ())
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y/%mm/%dd %H:%M:%S")).attr({ date:objDate.getTime(), src:strPath + $(pElement).find("a").attr("title") }));
      }
    });

    if (typeof pCallBack == "function") pCallBack($list);
  },
  function()
  {
    if (typeof pCallBack == "function") pCallBack($list);
  });
},
/******************************************************************************/
/* nictRaspberryPi.getFileList                                                */
/******************************************************************************/
getFileList : function(pServeIndex, pDate, pCallBack)
{
  var $list         = $("<ul list_type='file_list'></ul>");
  var objTargetDate = new Date($.nictRaspberryPi.formatDate(pDate        , "%y/%m/%d %H:59:59"));
  var strPath       =          $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.fileList.path);

  $.nictRaspberryPi.getServeIndex(strPath, function(pList)
  {
    var strReplacement = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.fileList.replacement);
    var objDate;

    $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objTargetDate, "%y/%mm/%dd %H:00:00")).attr({ type:"header", date:objTargetDate.getTime() }));

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.fileList.pattern, strReplacement));

      if (objDate > objTargetDate) return false;

      if (objDate.getFullYear() == objTargetDate.getFullYear()
      &&  objDate.getMonth   () == objTargetDate.getMonth   ()
      &&  objDate.getDate    () == objTargetDate.getDate    ()
      &&  objDate.getHours   () == objTargetDate.getHours   ())
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y/%mm/%dd %H:%M:%S")).attr({ date:objDate.getTime(), src:strPath + $(pElement).find("a").attr("title") }));
      }
    });

    if (typeof pCallBack == "function") pCallBack($list);
  },
  function()
  {
    if (typeof pCallBack == "function") pCallBack($list);
  });
},
/******************************************************************************/
/* nictRaspberryPi.searchList                                                 */
/******************************************************************************/
searchList : function(pServeIndex, pDate, pCallBack)
{
  var objDate;
  var flgExist = false;
/*-----* search year list *---------------------------------------------------*/
  $.nictRaspberryPi.getYearList(pServeIndex, function(pYearList)
  {
    pYearList.children().each(function(pIndex, pElement)
    {
      objDate = new Date(parseInt($(pElement).attr("date"), 10));

           if (pDate.getFullYear() == objDate.getFullYear()) { flgExist = true; return false; }
      else if (pDate.getFullYear() <  objDate.getFullYear())                    return false;
    });

    if (!flgExist)
    {
      if (typeof pCallBack == "function") pCallBack(null);
      return;
    }

    flgExist = false;
/*-----* search month list *--------------------------------------------------*/
    $.nictRaspberryPi.getMonthList(pServeIndex, pDate, function(pMonthList)
    {
      pMonthList.children(":not([type='header'])").each(function(pIndex, pElement)
      {
        objDate = new Date(parseInt($(pElement).attr("date"), 10));

             if (pDate.getMonth() == objDate.getMonth()) { flgExist = true; return false; }
        else if (pDate.getMonth() <  objDate.getMonth())                    return false;
      });

      if (!flgExist)
      {
        if (typeof pCallBack == "function") pCallBack(null);
        return;
      }

      flgExist = false;
/*-----* search day list *----------------------------------------------------*/
      $.nictRaspberryPi.getDayList(pServeIndex, pDate, function(pDayList)
      {
        pDayList.children(":not([type='header'])").each(function(pIndex, pElement)
        {
          objDate = new Date(parseInt($(pElement).attr("date"), 10));

               if (pDate.getDate() == objDate.getDate()) { flgExist = true; return false; }
          else if (pDate.getDate() <  objDate.getDate())                    return false;
        });

        if (!flgExist)
        {
          if (typeof pCallBack == "function") pCallBack(null);
          return;
        }

        flgExist = false;
/*-----* search time list *---------------------------------------------------*/
        $.nictRaspberryPi.getTimeList(pServeIndex, pDate, function(pTimeList)
        {
          pTimeList.children(":not([type='header'])").each(function(pIndex, pElement)
          {
            objDate = new Date(parseInt($(pElement).attr("date"), 10));

                 if (pDate.getHours() == objDate.getHours()) { flgExist = true; return false; }
            else if (pDate.getHours() <  objDate.getHours())                    return false;
          });

          if (!flgExist)
          {
            if (typeof pCallBack == "function") pCallBack(null);
            return;
          }
/*-----* search file list *---------------------------------------------------*/
          else
          {
            $.nictRaspberryPi.getFileList(pServeIndex, pDate, function(pFileList)
            {
              if (typeof pCallBack == "function") pCallBack(pFileList);
            });
          }
        });
      });
    });
  });
},
/******************************************************************************/
/* nictRaspberryPi.searchNearItem                                             */
/******************************************************************************/
searchNearItem : function(pList, pDate)
{
  if (pList.length > 0)
  {
    var objResult = { prev : null, match : null, next : null };

    pList.each(function(pIndex, pElement)
    {
      objDate = new Date(parseInt($(pElement).attr("date"), 10));

           if (pDate.getTime() >  objDate.getTime())   objResult.prev  = $(pElement);
      else if (pDate.getTime() == objDate.getTime())   objResult.match = $(pElement);
      else if (pDate.getTime() <  objDate.getTime()) { objResult.next  = $(pElement); return false; }
    });

    return objResult;
  }
  else
    return null;
},
/******************************************************************************/
/* nictRaspberryPi.getFullScreenElement                                       */
/******************************************************************************/
getFullScreenElement : function()
{
       if (document.fullscreenElement      ) return document.fullscreenElement;
  else if (document.webkitFullscreenElement) return document.webkitFullscreenElement;
  else if (document.mozFullScreenElement   ) return document.mozFullScreenElement;
  else                                       return null;
},
/******************************************************************************/
/* nictRaspberryPi.requestFullScreen                                          */
/******************************************************************************/
requestFullScreen : function(pObject)
{
  var aryMethod = ["requestFullscreen", "webkitRequestFullScreen", "mozRequestFullScreen"];

  for(var i01 = 0; i01 < aryMethod.length; i01++)
  {
    if (pObject[aryMethod[i01]])
    {
      pObject[aryMethod[i01]]();
      return true;
    }
  }

  return false;
},
/******************************************************************************/
/* nictRaspberryPi.exitFullScreen                                             */
/******************************************************************************/
exitFullScreen : function()
{
  var aryMethod = ["exitFullscreen", "webkitExitFullscreen", "mozCancelFullScreen"];

  for(var i01 = 0; i01 < aryMethod.length; i01++)
  {
    if (document[aryMethod[i01]])
    {
      document[aryMethod[i01]]();
      return true;
    }
  }

  return false;
},
/******************************************************************************/
/* nictRaspberryPi.download                                                   */
/******************************************************************************/
download : function(pUrl, pFileName)
{
  var strFileName       = typeof pFileName == "string" ? pFileName : pUrl.match(".+/(.+?)([\?#;].*)?$")[1];
  var objXMLHttpRequest = new XMLHttpRequest();

  objXMLHttpRequest.open("GET", pUrl, true);
  objXMLHttpRequest.responseType = "blob";

  objXMLHttpRequest.onload = function()
  {
    if (objXMLHttpRequest.status !== 200 && objXMLHttpRequest.status !== 206) { alert("download error. return code = " + objXMLHttpRequest.status); return false; }

    if (window.navigator.msSaveBlob)
      window.navigator.msSaveBlob(objXMLHttpRequest.response, strFileName);
    else
    {
      var $download = $("<a css='display:none;' href='" + window.URL.createObjectURL(objXMLHttpRequest.response) + "' download='" + strFileName + "'></a>");

      $("body").append($download);

      $download[0].click ();
      $download   .remove();
    }
  };

  objXMLHttpRequest.send();
},
/******************************************************************************/
/** nictSTARSImageViewer.getQueryString                                       */
/******************************************************************************/
getQueryString : function(pParameters)
{
  var objGetQueryString = {};

  for( var i01 = 0; i01 < pParameters.length; i01++)
  {
    objGetQueryString[decodeURIComponent(pParameters[i01].split("=")[0])] = decodeURIComponent(pParameters[i01].split("=")[1]);
  }

  return objGetQueryString;
},
/******************************************************************************/
/* nictRaspberryPi.formatDate                                                 */
/******************************************************************************/
formatDate : function(pDate, pFormatString, pTimeZone)
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
},
/******************************************************************************/
/* nictRaspberryPi.openDialog                                                 */
/******************************************************************************/
openDialog : function(pId, pBody, pOk)
{
/*-----* Variable *-----------------------------------------------------------*/
  var $dialog = $("<div    id='dialog_" + pId + "'></div>");
  var $frame  = $("<div class='dialog_frame'      ></div>");
  var $button = $("<div class='dialog_button'     ></div>");
/*-----* Create Dialog *------------------------------------------------------*/
  $button.append("<div class='dialog_button_ok'    ></div>");
  $button.append("<div class='dialog_button_cancel'></div>");

  $frame             .append(pBody.addClass("dialog_body"));
  $frame             .append($button);
  $dialog            .append($frame);
  $("#dialog_" + pId).remove();
  $("body"          ).append($dialog);
/*-----* Button Event *-------------------------------------------------------*/
  $button.on("click", "> div", function()
  {
    if ($(this).hasClass("dialog_button_ok")) pOk();
    $("#dialog_" + pId).remove();
    return false;
  });

  return $dialog;
},
/******************************************************************************/
/* nictRaspberryPi.putLog                                                     */
/******************************************************************************/
putLog : function(pMessage)
{
  if ($Env.showLogConsole) console.log($.nictRaspberryPi.formatDate(new Date(), "%y/%mm/%dd %H:%M:%S.%N") + " " + pMessage);
},
/******************************************************************************/
/* nictRaspberryPi.isJson                                                     */
/******************************************************************************/
isJson : function(pJson)
{
  return (pJson instanceof Object && !(pJson instanceof Array)) ? true : false;
},
/******************************************************************************/
/* nictRaspberryPi.isMobile                                                   */
/******************************************************************************/
isMobile : function()
{
  return $(window).width() <= 640;
}
};})(jQuery);
