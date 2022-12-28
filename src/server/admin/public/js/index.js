$(function() {
/******************************************************************************/
/* Raspberry Pi Camera Web                                                    */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* initialize                                                                 */
/******************************************************************************/
/*-----* thumbnail *----------------------------------------------------------*/
$("#list").sortable(
{
  items                : "> *[mac_address]",
  helper               : "clone",
  handle               : ".caption",
  tolerance            : "pointer",
  forceHelperSize      : true,
  forcePlaceholderSize : true,
  distance             : 20,
  start                : function(pEvnet, pUi)
  {
    pUi.item.find(".caption").data("cancelMouseUp", true);
  },
  stop                 : function(pEvnet, pUi)
  {
    $(window).trigger("unload");

    if ($Env.localStorage && Array.isArray($Env.localStorage.orderThumbnail))
    {
      $socket.emit("transmitter.setOrderThumbnail", $Env.localStorage.orderThumbnail);
      $.nictRaspberryPi.putLog("send transmitter.setOrderThumbnail [ " + JSON.stringify($Env.localStorage.orderThumbnail) + " ]");
    }
  }
});
/*-----* get user environment *-----------------------------------------------*/
if (typeof localStorage != "undefined")
{
  try      { $Env.localStorage = JSON.parse(localStorage.getItem($Env.appName)); }
  catch(e) { /* DO NOTHING (For Local Browsing) */  }
}
/*-----* thumbnail columns *--------------------------------------------------*/
if ($Env.localStorage && typeof $Env.localStorage.countThumbnail == "number")
{
  $("#list"              ).addClass("cols" + $Env.localStorage.countThumbnail);
  $("#select_cols select").val     (         $Env.localStorage.countThumbnail);
}
else
{
  $("#list"              ).addClass("cols" + $Env.countThumbnail);
  $("#select_cols select").val     (         $Env.countThumbnail);
}
/*-----* get url environment *------------------------------------------------*/
if(window.location.search.length > 1)
{
  var objGetQueryString = $.nictRaspberryPi.getQueryString(window.location.search.substring(1).split("&"));

  if (typeof objGetQueryString.caption == "string" && objGetQueryString.caption.length > 0)
  {
    $("#list").css("display", "none");

    setTimeout(function _loop()
    {
      if ($("#list > li[caption='" + objGetQueryString.caption + "']").length > 0)
      {
        $("#list > li[caption='" + objGetQueryString.caption + "'] .caption").trigger("mouseup");
        $("#list"                                                           ).css    ("display", "");
        return;
      }

      setTimeout(_loop, 500);
    }, 500);
  }
}
/*-----* web socket *---------------------------------------------------------*/
var $socket = io.connect(location.protocol + "//" + location.host + $Env.webSocketPath, { path:location.pathname + "socket.io" });
/******************************************************************************/
/* #date update                                                               */
/******************************************************************************/
setInterval(function()
{
  $("#date").text($.nictRaspberryPi.formatDate(new Date(), $Env.dateFormat, $Env.timeZone));
}, 1000);
/******************************************************************************/
/* socket event                                                               */
/******************************************************************************/
/*-----* connect *------------------------------------------------------------*/
$socket.on("connect", function()
{
  $.nictRaspberryPi.putLog("begin connection");

  $socket.emit("transmitter.getOrderThumbnail");
  $.nictRaspberryPi.putLog("send transmitter.getOrderThumbnail");
});
/*-----* recv(transmitter.orderThumbnail) *-----------------------------------*/
$socket.on("transmitter.orderThumbnail", function(pJson)
{
  if (!Array.isArray(pJson)) return;
  $.nictRaspberryPi.putLog("recv transmitter.orderThumbnail [ " + JSON.stringify(pJson) + " ]");

  if (!($Env.localStorage && Array.isArray($Env.localStorage.orderThumbnail)))
  {
    $Env.localStorage = { orderThumbnail : pJson };
  }

  $socket.emit("transmitter.getStatus");
  $socket.emit("transmitter.getImage" );
  $socket.emit("transmitter.getVideo" );
  $socket.emit(   "receiver.getStatus");

  $.nictRaspberryPi.putLog("send transmitter.getStatus");
  $.nictRaspberryPi.putLog("send transmitter.getImage");
  $.nictRaspberryPi.putLog("send transmitter.getVideo");
  $.nictRaspberryPi.putLog("send receiver.getStatus");
});
/*-----* recv(transmitter.status) *-------------------------------------------*/
$socket.on("transmitter.status", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)       ) return;
  if (typeof pJson.macAddress     != "string") return;
  if (typeof pJson.Configuration  != "object") return;

  var $li = $.nictRaspberryPi.getList(pJson);

  if ((pJson.Configuration.connect != 1 || pJson.alive != 1) && $li.find("#video-player").length > 0) $li.find(".picture span").trigger("click");

  if (!$li.data("newTransmitter") && $li.hasClass("select"))
  {
    if ($.nictRaspberryPi.blinkTransmitterStatus($li, pJson) && $("#dialog_result *[result_id='" + pJson.macAddress + "']").length == 0)
    {
      $.nictRaspberryPi.openDialog("change", $("<div><i></i></div>"), function()
      {
        $li.find(".blinking").removeClass("blinking");
      });

      if (pJson.Configuration.adaptiveControl == 1)
      {
        var flgAdaptiveControl = false;

        $li.find(".blinking").each(function(pIndex, pElement)
        {
          flgAdaptiveControl = $(pElement).hasClass("bps") || $(pElement).hasClass("fps");
          return flgAdaptiveControl;
        });

        if (flgAdaptiveControl)
        {
          $("#dialog_change .dialog_frame").css("display", "none");
          setTimeout(function() { $("#dialog_change .dialog_button_ok").trigger("click"); }, 2000);
        }
      }
    }
  }

  $.nictRaspberryPi.setTransmitterStatus($li, pJson);

  $li.find("[name='saveVideoInterval']").toggleClass("disabled"   ,        pJson.Configuration.saveVideo      != 0);
  $li.find("[name='saveVideoDuration']").toggleClass("disabled"   ,        pJson.Configuration.saveVideo      != 0);
  $li.find(".video_files span"         ).toggleClass("disabled"   ,        pJson.Configuration.saveVideo      != 2);
  $li.find(".focusSpeed"               ).toggleClass("disabled"   , typeof pJson.Configuration.focusSpeed     != "number");
  $li.find(".focusNearLimit"           ).toggleClass("disabled"   , typeof pJson.Configuration.focusNearLimit != "number");
  $li.find(".focusFarLimit"            ).toggleClass("disabled"   , typeof pJson.Configuration.focusFarLimit  != "number");
  $li.find(".reset span"               ).toggleClass("disabled"   , $.nictRaspberryPi.isDefaultStatus($li));
  $li.find(".rec_status"               ).toggleClass("rec_picture",        pJson              .saveImage      == 1);
  $li.find(".rec_status"               ).toggleClass("rec_video"  ,        pJson.Configuration.saveVideo      >  0);
  $li                                   .toggleClass("stoped"     ,        pJson              .alive          == 0);

  $.nictRaspberryPi.setDistributionStatus($li, pJson.Configuration.connect);
  $.nictRaspberryPi.setDisabledStatus    ($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog               ("recv transmitter.status [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(transmitter.image) *--------------------------------------------*/
$socket.on("transmitter.image", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                   ) return;
  if (typeof pJson.macAddress != "string"                                ) return;
  if ($("#list > li[mac_address='" + pJson.macAddress + "']").length == 0) return;

  var $li        = $.nictRaspberryPi.getList(pJson);
  var objImage   = new Blob([pJson.image], { type:"image/jpeg" });
  var intNewDate = parseInt(pJson.date, 10);
  var intOldDate = parseInt($li.find("img").attr("date"), 10);

  if (intNewDate != intOldDate)
  {
    if (!isNaN(intNewDate))
    {
      $li.find("img").animate({ opacity:0 }, 600, "linear", function()
      {
        $li.find("img"  ).attr({ src:window.URL.createObjectURL(objImage), date:pJson.date });
        $li.find(".date").text($.nictRaspberryPi.formatDate(new Date(intNewDate), $Env.dateFormat, $Env.timeZone));
      });
    }
    else
    {
      $li.find("img"  ).attr({ src:$Env.noImagePath, date:"" });
      $li.find(".date").text("");
    }

    $li.find(".date"                 ).fadeOut(500, function(){ $(this).fadeIn(500); });
    $li.find(".saveImage .file_count").text   (pJson.fileCount);
  }

  $.nictRaspberryPi.getServeIndex($Env.preview.savePath.picture.parent, function(pList)
  {
    var strFileName = $Env.preview.savePath.picture.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_picture").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_picture").attr       ("href"    , $Env.preview.urlPath + "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=image");
  },
  function()
  {
    $li.find(".history_picture").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.preview.savePath.video.parent, function(pList)
  {
    var strFileName = $Env.preview.savePath.video.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_video").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_video").attr       ("href"    , $Env.preview.urlPath + "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=video");
  },
  function()
  {
    $li.find(".history_video").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.preview.savePath.cutVideo.parent, function(pList)
  {
    var strFileName = $Env.preview.savePath.cutVideo.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_cut_video").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_cut_video").attr       ("href"    , $Env.preview.urlPath + "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=cutVideo");
  },
  function()
  {
    $li.find(".history_cut_video").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.preview.savePath.oneDayVideo.parent, function(pList)
  {
    var strFileName = $Env.preview.savePath.oneDayVideo.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_time_lapse").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_time_lapse").attr       ("href"    , $Env.preview.urlPath + "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=oneDayVideo");
  },
  function()
  {
    $li.find(".history_time_lapse").toggleClass("disabled", true);
  });

  pJson.image = "size=" + pJson.image.byteLength;

  $.nictRaspberryPi.setDisabledStatus($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog           ("recv transmitter.image [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(transmitter.video) *--------------------------------------------*/
$socket.on("transmitter.video", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                   ) return;
  if (typeof pJson.macAddress != "string"                                ) return;
  if ($("#list > li[mac_address='" + pJson.macAddress + "']").length == 0) return;

  var $li = $.nictRaspberryPi.getList(pJson);

  $li.find(".saveVideo .file_count").text(pJson.fileCount);
  $.nictRaspberryPi.putLog("recv transmitter.video [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(transmitter.videoFiles) *---------------------------------------*/
$socket.on("transmitter.videoFiles", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                                                    ) return;
  if (typeof pJson.macAddress                                                                  != "string") return;
  if ($("#dialog_video_files[macAddress='" + pJson.macAddress + "'][status='loading']").length ==        0) return;

  if (Array.isArray(pJson.files) && pJson.files.length > 0)
  {
    $("#dialog_video_files").removeAttr("status");

    var $li             = $.nictRaspberryPi.getList(pJson);
    var $videoFiles     = $("<ul></ul>");
    var objServerIndex  = $.extend(true, {}, $Env.preview.savePath.thumbnail);
    var strSaveFileName = $li.attr("save_file_name");

    if (objServerIndex. yearList) objServerIndex. yearList.path = objServerIndex. yearList.path.replace(/%filename/g, strSaveFileName);
    if (objServerIndex.monthList) objServerIndex.monthList.path = objServerIndex.monthList.path.replace(/%filename/g, strSaveFileName);
    if (objServerIndex.  dayList) objServerIndex.  dayList.path = objServerIndex.  dayList.path.replace(/%filename/g, strSaveFileName);
    if (objServerIndex. timeList) objServerIndex. timeList.path = objServerIndex. timeList.path.replace(/%filename/g, strSaveFileName);
    if (objServerIndex. fileList) objServerIndex. fileList.path = objServerIndex. fileList.path.replace(/%filename/g, strSaveFileName);
    if (objServerIndex. filePath) objServerIndex.      filePath = objServerIndex.      filePath.replace(/%filename/g, strSaveFileName);

    function _getThumbnail(pLi, pStartTime, pEndTime)
    {
      $.nictRaspberryPi.searchList(objServerIndex, pStartTime, function(pList)
      {
        if (pList != null)
        {
          var objNearItem = $.nictRaspberryPi.searchNearItem(pList.children(":not([type='header'])"), pStartTime);

          if (objNearItem != null)
          {
            var objNearTime = null;

                 if (objNearItem.match != null) objNearTime = new Date(parseInt(objNearItem.match.attr("date"), 10));
            else if (objNearItem.next  != null) objNearTime = new Date(parseInt(objNearItem.next .attr("date"), 10));

            if (objNearTime != null && objNearTime.getTime() <= pEndTime.getTime())
            {
              pLi.find("img").attr("src", $.nictRaspberryPi.formatDate(objNearTime, objServerIndex.filePath, $Env.timeZone));
              return;
            }
          }
        }

        var objDate = new Date(pStartTime.getFullYear(), pStartTime.getMonth(), pStartTime.getDate(), pStartTime.getHours() + 1, 0, 0);

        if (objDate.getTime() <= pEndTime.getTime()) _getThumbnail(pLi, objDate, pEndTime);
        else                                         pLi.find("span:last").addClass("no_image");
      });
    }

    for (var i01 = 0; i01 < pJson.files.length; i01++)
    {
      var objStartTime = new Date(parseInt(pJson.files[i01].createTime, 10));
      var objEndTime   = new Date(objStartTime.getTime() + (typeof pJson.files[i01].duration == "number" ? pJson.files[i01].duration : parseInt($li.find("[name='saveVideoDuration']").val(), 10)) * 1000);
      var $videoFile   = $("<li><span>" + $.nictRaspberryPi.formatDate(objStartTime, $Env.dateFormat, $Env.timeZone) + "</span><span><img src='img/no_image.png'></span></li>");

      $videoFile .attr  ("file", pJson.files[i01].fileName).toggleClass("select", pJson.files[i01].select);
      $videoFiles.append($videoFile);

      _getThumbnail($videoFile, objStartTime, objEndTime);
    }

    $videoFiles.on("click", "li", function(pEvent)
    {
      if ($(this).hasClass("select"))
      {
        $(this).removeClass("select");
      }
      else
      {
        var $this    = $(this);
        var $parent  = $this.parent();
        var $prev    = $this.prevAll(".select:first");
        var intStart = $parent.children().index($this.get(0));
        var intEnd   = intStart + 1;

        if (pEvent.shiftKey)
        {
          intStart = $prev.length > 0 ? $parent.children().index($prev.get(0)) + 1 : 0;
        }

        $parent.children().slice(intStart, intEnd).addClass("select");
      }
    });

    $("#dialog_video_files .dialog_body").append($videoFiles);
  }
  else
    $("#dialog_video_files").attr("status", "not_found");

  $.nictRaspberryPi.putLog("recv transmitter.videoFiles [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(transmitter.result) *-------------------------------------------*/
$socket.on("transmitter.result", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                              ) return;
  if (typeof pJson.macAddress                                            != "string") return;
  if (typeof pJson.result                                                != "string") return;
  if ($("#dialog_result *[result_id='" + pJson.macAddress + "']").length ==        0) return;

  var $li       = $.nictRaspberryPi.getList(pJson);
  var aryResult = pJson.result.split("=");

  if ($Env.resultTimeout) { clearTimeout($Env.resultTimeout); $Env.resultTimeout = null; }

  $li.find(".blinking").removeClass("blinking");
  $li                  .removeClass("change"  );

  if (aryResult.length == 2)
  {
    if (aryResult[0] == "error")
    {
      $("#dialog_result"             ).addClass(aryResult[0]);
      $("#dialog_result .dialog_body").html    ("<i></i>" + aryResult[1]);
    }
    else
      $("#dialog_result"             ).remove  ();
  }

  $.nictRaspberryPi.putLog("recv transmitter.result [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(transmitter.exit) *---------------------------------------------*/
$socket.on("transmitter.exit", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                   ) return;
  if (typeof pJson.macAddress != "string"                                ) return;
  if ($("#list > li[mac_address='" + pJson.macAddress + "']").length == 0) return;

  var $li = $.nictRaspberryPi.getList(pJson);

  if ($li.find("#video-player").length > 0) $li.find(".picture span").trigger("click");
  if ($("#dialog_result"      ).length > 0) $("#dialog_result"      ).remove ();

  $.nictRaspberryPi.setDisabledStatus($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog           ("recv transmitter.exit [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(receiver.status) *----------------------------------------------*/
$socket.on("receiver.status", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)) return;

  $Env.receiver.Configuration.display = pJson.display;
  $Env.receiver.Configuration.delay   = pJson.delay;

  $("#list").children("[mac_address]").each(function(pIndex, pElement)
  {
    if ($(pElement).hasClass("select") && $(pElement).attr("solution_type").indexOf("video") > -1 && !$(pElement).find(".display").hasClass("disconnect"))
    {
      if ($.nictRaspberryPi.blinkReceiverStatus($(pElement), pJson))
      {
        $.nictRaspberryPi.openDialog("change", $("<div><i></i></div>"), function()
        {
          $(pElement).find(".blinking").removeClass("blinking");
        });
      }
    }

    $.nictRaspberryPi.setReceiverStatus($(pElement), pJson);

    $(pElement).find(".display"   ).removeClass("disconnect");
    $(pElement).find(".delay"     ).removeClass("disconnect");
    $(pElement).find(".reset span").toggleClass("disabled", $.nictRaspberryPi.isDefaultStatus($(pElement)));
  });

  $.nictRaspberryPi.putLog("recv receiver.status [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(receiver.result) *----------------------------------------------*/
$socket.on("receiver.result", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                              ) return;
  if (typeof pJson.result                                != "string") return;
  if ($("#dialog_result *[result_id='receiver']").length ==        0) return;

  var aryResult = pJson.result.split("=");

  if ($Env.resultTimeout) { clearTimeout($Env.resultTimeout); $Env.resultTimeout = null; }

  $("#list li .blinking").removeClass("blinking");
  $("#list li"          ).removeClass("change"  );

  if (aryResult.length == 2)
  {
    if (aryResult[0] == "error")
    {
      $("#dialog_result"             ).addClass(aryResult[0]);
      $("#dialog_result .dialog_body").html    ("<i></i>" + aryResult[1]);
    }
    else
      $("#dialog_result"             ).remove  ();
  }

  $.nictRaspberryPi.putLog("recv receiver.result [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(receiver.exit) *------------------------------------------------*/
$socket.on("receiver.exit", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)) return;

  $Env.receiver.Configuration.display = null;
  $Env.receiver.Configuration.delay   = null;

  $("#list").children("[mac_address]").each(function(pIndex, pElement)
  {
    $(pElement).find(".display").addClass("disconnect");
    $(pElement).find(".delay"  ).addClass("disconnect");
  });

  $.nictRaspberryPi.putLog("recv receiver.exit [ " + JSON.stringify(pJson) + " ]");
});
/*-----* recv(server.diskSpace) *---------------------------------------------*/
$socket.on("server.diskSpace", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)) return;

  var strAvailable;

       if (pJson.available > 1000000) strAvailable = Math.round(pJson.available / 1000000) + "GB";
  else if (pJson.available >    1000) strAvailable = Math.round(pJson.available /    1000) + "MB";
  else                                strAvailable =            pJson.available            + "KB";

  $("#list").children("[mac_address]").each(function(pIndex, pElement)
  {
    $(pElement).find(".disk_space").text(strAvailable).toggleClass("alert", pJson.available <= $Env.alertDiskSpace);
  });

  $.nictRaspberryPi.putLog("recv server.diskSpace [ " + JSON.stringify(pJson) + " ]");
});
/*-----* disconnect *---------------------------------------------------------*/
$socket.on("disconnect", function()
{
  setTimeout(function()
  {
    $("#list > li[mac_address]").remove     ();
    $("#list"                  ).removeClass("select");
    $("body"                   ).removeClass("select");
    $.nictRaspberryPi.putLog("end connection");
  }, 100);
});
/******************************************************************************/
/* document.fullscreenchange                                                  */
/******************************************************************************/
$(document).on("fullscreenchange webkitfullscreenchange mozfullscreenchange", function()
{
  if (!$.nictRaspberryPi.getFullScreenElement())
  {
    $(".fullscreen .nictImageViewer").nictImageViewer("destroy"   );
    $(".fullscreen"                 ).removeClass    ("fullscreen");
  }
});
/******************************************************************************/
/* select_cols.change                                                         */
/******************************************************************************/
$("#select_cols select").on("change", function()
{
  $("#list").removeClass("cols2 cols3 cols4 cols5");
  $("#list").addClass   ("cols" + $(this).val());
});
/******************************************************************************/
/* caption.click                                                              */
/******************************************************************************/
$("#list").on("mousedown", "li:not(.select) .caption", function() { $(this).data("cancelMouseUp", false); });
$("#list").on("mouseup"  , "li:not(.select) .caption", function()
{
  var $this         = $(this);
  var strMacAddress = $this.parents("li").attr("mac_address");
  var $li           = $("#list > li[mac_address='" + strMacAddress + "']:not(.ui-sortable-helper)");

  if ($li.find(".caption").data("cancelMouseUp")) return;

  $("#list")              .sortable ("disable");
  $this     .parents("li").addClass ("select");
  $("#list")              .addClass ("select");
  $("body" )              .addClass ("select");
  $(window )              .scrollTop(0);

  setTimeout(function(){ $this.parents("li").find(".bar").fadeOut(1000); }, 3000);
});
/******************************************************************************/
/* img.mousemove                                                              */
/******************************************************************************/
$("#list").on("mousemove", "li.select img", function()
{
  var $this = $(this);

  if ($this.parents("li").find(".bar").data("mousemoveEvent")) clearTimeout($this.parents("li").find(".bar").data("mousemoveEvent"));

  $this.parents("li").find(".bar").css("display", "");

  $this.parents("li").find(".bar").data("mousemoveEvent", setTimeout(function()
  {
    $this.parents("li").find(".bar").fadeOut(1000);
    $this.parents("li").find(".bar").data("mousemoveEvent", null);
  }, 3000));
});
/******************************************************************************/
/* bar_download.click                                                         */
/******************************************************************************/
$("#list").on("click", "li.select .bar_download", function()
{
  var strCaption =                   $(this).parents("li")                       .attr("caption");
  var strSrc     =                   $(this).parents("li").find(".view_area img").attr("src"    );
  var objDate    = new Date(parseInt($(this).parents("li").find(".view_area img").attr("date"   ), 10));

  $.nictRaspberryPi.download($(this).parents("li").find(".view_area img").attr("src"), $.nictRaspberryPi.formatDate(objDate, strCaption + "_%y%mm%dd%H%M%S.jpg"));
});
/******************************************************************************/
/* bar_fullscreen.click                                                       */
/******************************************************************************/
$("#list").on("click", "li.select .bar_fullscreen", function()
{
  if ($.nictRaspberryPi.getFullScreenElement() || $(this).parents("li").find(".image").hasClass("fullscreen"))
  {
    $(this).parents("li").find(".image"           ).removeClass    ("fullscreen");
    $(this).parents("li").find(".image .view_area").nictImageViewer("destroy"   );
    $.nictRaspberryPi.exitFullScreen();
  }
  else
  {
    $(this).parents("li").find(".image"           ).addClass       ("fullscreen");
    $(this).parents("li").find(".image .view_area").nictImageViewer({ moveBefore : function(pThis){ $(pThis).find("img").trigger("mousemove"); } });
    $.nictRaspberryPi.requestFullScreen($(this).parents("li").find(".image").get(0));
  }
});
/******************************************************************************/
/* tab.click                                                                  */
/******************************************************************************/
$("#list").on("click", "li[solution_type*='rtmp'].select.distribution:not(.stoped):not(.disabled) .tab > *:not(.disabled) > span", function()
{
  if ($(this).hasClass("select"    )) return;
  if ($(this).data    ("clickEvent")) return; else $(this).data("clickEvent", true);
/*-----* video *--------------------------------------------------------------*/
  if ($(this).parent().hasClass("video"))
  {
    $(this)                                      .toggleClass("select", true );
    $(this).parents(".tab").find(".picture span").toggleClass("select", false);

    $(this).parents("li").find("img").animate({ opacity:0 }, 600, "linear", function()
    {
      var $video = $("<div id='video-player'></div>");

      $video .append("<iframe src='" + $Env.videoPath + "' frameborder='no' scrolling='no' allowfullscreen></iframe>");
      $video .css   ("opacity", "0");
      $(this).css   ("display", "none");
      $(this).after ($video);

      $video.animate({ opacity:1 }, 600, "linear");

      $(this).parents("li").find(".date"      ).css({ textIndent:"100%", whiteSpace:"nowrap", overflow:"hidden" });
      $(this).parents("li").find(".video span").data("clickEvent", false);
    });
  }
/*-----* picture *------------------------------------------------------------*/
  if ($(this).parent().hasClass("picture"))
  {
    $(this)                                    .toggleClass("select", true );
    $(this).parents(".tab").find(".video span").toggleClass("select", false);

    $(this).parents("li").find("#video-player").animate({ opacity:0 }, 600, "linear", function()
    {
      $(this).parents("li").find("img"          ).css("display", "").animate({ opacity:1 }, 600, "linear");
      $(this).parents("li").find(".date"        ).css({ textIndent:"", whiteSpace:"", overflow:"" });
      $(this).parents("li").find(".picture span").data("clickEvent", false);
      $(this).remove();
    });
  }
});
/******************************************************************************/
/* view_url.click                                                             */
/******************************************************************************/
$("#list").on("click", "li .view_url", function()
{
  var strViewUrl    = window.location.protocol + "//" + window.location.host + window.location.pathname;
  var $dialogBody   = $("<div><a target='_blank'></a></div>");
  var fncSelectText = function()
  {
    var $element = $("#dialog_view_url .dialog_body");

    if ($element.length > 0 && $element.css("visibility") != "hidden")
    {
      var objRange = document.createRange();
      objRange.selectNodeContents($element.find("a").get(0));
      if (window.getSelection().empty          ) window.getSelection().empty();
      if (window.getSelection().removeAllRanges) window.getSelection().removeAllRanges();
                                                 window.getSelection().addRange(objRange);
    }
    else
      setTimeout(fncSelectText, 100);
  };

  strViewUrl += "?caption=" + encodeURIComponent($(this).parents("li").attr("caption"));

  $dialogBody.find("a").attr ("href"      , strViewUrl)
  $dialogBody.find("a").text (              strViewUrl);
  $dialogBody.find("a").ready(              fncSelectText);
  $dialogBody.find("a").on   ("mousedown" , fncSelectText);
  $dialogBody.find("a").on   ("mouseenter", fncSelectText);

  var $dialog = $.nictRaspberryPi.openDialog("view_url", $dialogBody, function(){});

  $dialog.find(".dialog_body"  ).css({ visibility : "hidden", padding : "10px" });
  $dialog.find(".dialog_button").css({ display    : "none" });

  setTimeout(function()
  {
    $dialog.find(".dialog_body"  ).css({ visibility : "", overflowY : "scroll", height : ($dialog.find(".dialog_frame").outerHeight() - $dialog.find(".dialog_button").outerHeight() - 20) + "px", WebkitOverflowScrolling : "touch" });
    $dialog.find(".dialog_button").css({ display    : "" });
  }, 300);
});
/******************************************************************************/
/* list.click                                                                 */
/******************************************************************************/
$("#list").on("click", "li .list", function()
{
  var $this   = $(this);
  var intTime = 0;

  if ($this.parents("li").find("#video-player").length > 0)
  {
    $this.parents("li").find(".picture span").trigger("click");
    intTime = 500;
  }

  setTimeout(function()
  {
    $this.parents("li").find(".bar").css("display", "");

    $("#list"     ).sortable   ("enable");
    $("#list > li").removeClass("select");
    $("#list"     ).removeClass("select");
    $("body"      ).removeClass("select");
    $(window      ).scrollTop  (0);
  }, intTime);
});
/******************************************************************************/
/* video_files.click                                                          */
/******************************************************************************/
$("#list").on("click", "li .video_files > span", function()
{
  var objJson = { macAddress:$(this).parents("li").attr("mac_address") };

  var $dialog = $.nictRaspberryPi.openDialog("video_files", $("<div></div>"), function()
  {
    objJson.files = [];
    $dialog.find(".dialog_body li.select").each(function(pIndex, pElement) { objJson.files.push($(pElement).attr("file")); });
    $socket.emit("transmitter.setVideoFiles", objJson);
    $.nictRaspberryPi.putLog("send transmitter.setVideoFiles [ " + JSON.stringify(objJson) + " ]");
  });

  $dialog                       .attr({ macAddress : objJson.macAddress, status  : "loading" });
  $dialog.find(".dialog_body"  ).css ({ visibility : "hidden"          , padding : "10px" });
  $dialog.find(".dialog_button").css ({ display    : "none" });

  setTimeout(function()
  {
    $dialog.find(".dialog_body"  ).css({ visibility : "", overflowY : "scroll", height : ($dialog.find(".dialog_frame").outerHeight() - $dialog.find(".dialog_button").outerHeight() - 20) + "px", WebkitOverflowScrolling : "touch" });
    $dialog.find(".dialog_button").css({ display    : "" });
  }, 300);

  $socket.emit("transmitter.getVideoFiles", objJson);
  $.nictRaspberryPi.putLog("send transmitter.getVideoFiles [ " + JSON.stringify(objJson) + " ]");
});
/******************************************************************************/
/* reboot.click                                                               */
/******************************************************************************/
$("#list").on("click", "li .reboot > span", function()
{
  var $reboot = $(this).parents(".reboot").find("input[name='reboot']");

  $.nictRaspberryPi.openDialog("reboot", $("<div><i></i></div>"), function()
  {
    $reboot.trigger("change");
  });
});
/******************************************************************************/
/* reset.click                                                                */
/******************************************************************************/
$("#list").on("click", "li .reset > span", function()
{
  var $li = $(this).parents("li");

  $.nictRaspberryPi.openDialog("reset", $("<div><i></i></div>"), function()
  {
    var objJson = $.extend({ macAddress : $li.attr("mac_address") }, $Env.transmitter.ConfigurationDefault);

         if ($li.attr("camera_type") == "standard" ) $.extend(true, objJson.Configuration, $Env.transmitter.standardCamera.ConfigurationDefault);
    else if ($li.attr("camera_type") == "sdicamera") $.extend(true, objJson.Configuration, $Env.transmitter.     sdiCamera.ConfigurationDefault);
    else if ($li.data("ConfigurationDefault")      ) $.extend(true, objJson.Configuration, $li.data("ConfigurationDefault"));

    $.nictRaspberryPi.blinkTransmitterStatus($li, objJson);
    $.nictRaspberryPi.  setTransmitterStatus($li, objJson);

    $socket.emit("transmitter.setStatus", objJson);
    $.nictRaspberryPi.putLog("send transmitter.setStatus [ " + JSON.stringify(objJson) + " ]");

    if (!$li.find(".display").hasClass("disconnect"))
    {
      $.nictRaspberryPi.blinkReceiverStatus($li, $Env.receiver.ConfigurationDefault);
      $.nictRaspberryPi.  setReceiverStatus($li, $Env.receiver.ConfigurationDefault);

      $socket.emit("receiver.setStatus", $Env.receiver.ConfigurationDefault);
      $.nictRaspberryPi.putLog("send receiver.setStatus [ " + JSON.stringify($Env.receiver.ConfigurationDefault) + " ]");
    }

    $.nictRaspberryPi.openDialog("result", $("<div result_id='" + objJson.macAddress + "'><i></i></div>"), function()
    {
      $("#list li .blinking").removeClass("blinking");
      $("#list li"          ).removeClass("change"  );
    });

    $Env.resultTimeout = setTimeout(function()
    {
      $("#list li .blinking").removeClass("blinking");
      $("#list li"          ).removeClass("change"  );
      $("#dialog_result"    ).remove     ();

      $Env.resultTimeout = null;
    }, 15000);
  });
});
/******************************************************************************/
/* param.change                                                               */
/******************************************************************************/
$("#list").on("click", "li button", function() { $(this).trigger("change"); });
$("#list").on("input", "li input" , function()
{
       if ($(this).attr("name") == "focusNearLimit") $(this).parents(".focusNearLimit").find("div label"         ).text( parseFloat($(this).val()    )        .toFixed(1));
  else if ($(this).attr("name") == "focusFarLimit" ) $(this).parents(".focusFarLimit" ).find("div label"         ).text( parseFloat($(this).val()    )        .toFixed(1));
  else if ($(this).attr("name") == "panTiltSpeed"  ) $(this).parents(".panTilt"       ).find("label.panTiltSpeed").text( parseFloat($(this).val()    )        .toFixed(1));
  else if ($(this).attr("name") == "panTiltTime"   ) $(this).parents(".panTilt"       ).find("label.panTiltTime" ).text((parseInt  ($(this).val(), 10) / 1000).toFixed(1));
  else if ($(this).attr("name") == "zoomSpeed"     ) $(this).parents(".zoom"          ).find("label.zoomSpeed"   ).text( parseFloat($(this).val()    )        .toFixed(1));
  else if ($(this).attr("name") == "zoomTime"      ) $(this).parents(".zoom"          ).find("label.zoomTime"    ).text((parseInt  ($(this).val(), 10) / 1000).toFixed(1));
});
$("#list").on("change", "li select, li input, li button", function()
{
  var objJson     = { macAddress:$(this).parents("li").attr    ("mac_address") };
  var strResultId =              $(this).parents("li").attr    ("mac_address");
  var intTime     =              $(this).parents("li").hasClass("disabled"   ) || $(this).parents("li").hasClass("stoped") ? 3000 : 1000;
  var strName     =              $(this)              .attr    ("name"       );
/*-----* receiver *-----------------------------------------------------------*/
  if (strName == "display" || strName == "delay")
  {
         if (strName == "display") objJson.display = parseInt($(this).val(), 10);
    else if (strName == "delay"  ) objJson.delay   = parseInt($(this).val(), 10);

    setTimeout(function()
    {
      $socket.emit("receiver.setStatus", objJson);
      $.nictRaspberryPi.putLog("send receiver.setStatus [ " + JSON.stringify(objJson) + " ]");
    }, intTime);

    strResultId = "receiver";
  }
/*-----* transmitter(connect) *-----------------------------------------------*/
  else if (strName == "connect")
  {
    if (parseInt($(this).val(), 10) != 1) objJson.macAddress = "----------";

    setTimeout(function()
    {
      $socket.emit("transmitter.select", objJson);
      $.nictRaspberryPi.putLog("send transmitter.select [ " + JSON.stringify(objJson) + " ]");
    }, intTime);
  }
/*-----* transmitter(ptz) *-----------------------------------------------------*/
  else
  {
    objJson.Configuration = {};

         if (strName == "panTiltUpLeft")
    {
      objJson.Configuration.tiltUp   = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.panLeft  = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltUp")
    {
      objJson.Configuration.tiltUp   = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltUpRight")
    {
      objJson.Configuration.tiltUp   = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.panRight = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltLeft")
    {
      objJson.Configuration.panLeft  = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltRight")
    {
      objJson.Configuration.panRight = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltDownLeft")
    {
      objJson.Configuration.tiltDown = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.panLeft  = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltDown")
    {
      objJson.Configuration.tiltDown = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "panTiltDownRight")
    {
      objJson.Configuration.tiltDown = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.panRight = parseFloat($(this).parents(".panTilt").find("[name='panTiltSpeed']").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".panTilt").find("[name='panTiltTime' ]").val(), 10);
    }
    else if (strName == "zoomOut")
    {
      objJson.Configuration.zoomOut  = parseFloat($(this).parents(".zoom"   ).find("[name='zoomSpeed'   ]").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".zoom"   ).find("[name='zoomTime'    ]").val(), 10);
    }
    else if (strName == "zoomIn")
    {
      objJson.Configuration.zoomIn   = parseFloat($(this).parents(".zoom"   ).find("[name='zoomSpeed'   ]").val());
      objJson.Configuration.ptzTime  = parseInt  ($(this).parents(".zoom"   ).find("[name='zoomTime'    ]").val(), 10);
    }
/*-----* transmitter(resolution) *--------------------------------------------*/
    else if (strName == "resolution")
    {
      aryResolution = $(this).val().split("x");

      if (aryResolution.length == 2)
      {
        objJson.Configuration.width  = parseInt(aryResolution[0], 10);
        objJson.Configuration.height = parseInt(aryResolution[1], 10);
      }
    }
/*-----* transmitter(saveVideo) *---------------------------------------------*/
    else if (strName == "saveVideo")
    {
      var intSaveVideo         = parseInt($(this)                                                         .val(), 10);
      var intSaveVideoInterval = parseInt($(this).parents(".saveVideo").find("[name='saveVideoInterval']").val(), 10);
      var intSaveVideoDuration = parseInt($(this).parents(".saveVideo").find("[name='saveVideoDuration']").val(), 10);

      if (intSaveVideo > 0)
      {
        if (intSaveVideoInterval >= intSaveVideoDuration)
        {
          objJson.Configuration.saveVideo         = intSaveVideo;
          objJson.Configuration.saveVideoInterval = intSaveVideoInterval;
          objJson.Configuration.saveVideoDuration = intSaveVideoDuration;
        }
        else
        {
          $(this).val(0);
          $.nictRaspberryPi.openDialog("save_video_param_error", $("<div><i></i></div>"), function(){});
          return;
        }
      }
      else
        objJson.Configuration.saveVideo = intSaveVideo;
    }
/*-----* transmitter(other) *-------------------------------------------------*/
    else if (strName == "createImageInterval" ) objJson.Configuration.createImageInterval  = parseInt  ($(this).val(), 10);
    else if (strName == "createImageQuality"  ) objJson.Configuration.createImageQuality   = parseInt  ($(this).val(), 10);
    else if (strName == "createImageTimeStamp") objJson.Configuration.createImageTimeStamp = parseInt  ($(this).val(), 10);
    else if (strName == "saveImage"           ) objJson              .saveImage            = parseInt  ($(this).val(), 10);
    else if (strName == "adaptiveControl"     ) objJson.Configuration.adaptiveControl      = parseInt  ($(this).val(), 10);
    else if (strName == "fecLevel"            ) objJson.Configuration.fecLevel             = parseInt  ($(this).val(), 10);
    else if (strName == "heartBeat"           ) objJson.Configuration.heartBeat            = parseInt  ($(this).val(), 10);
    else if (strName == "rotation"            ) objJson.Configuration.rotation             = parseInt  ($(this).val(), 10);
    else if (strName == "flip"                ) objJson.Configuration.flip                 = parseInt  ($(this).val(), 10);
    else if (strName == "quality"             ) objJson.Configuration.quality              = parseFloat($(this).val()    );
    else if (strName == "bps"                 ) objJson.Configuration.bps                  = parseInt  ($(this).val(), 10);
    else if (strName == "fps"                 ) objJson.Configuration.fps                  = parseInt  ($(this).val(), 10);
    else if (strName == "focusMode"           ) objJson.Configuration.focusMode            =            $(this).val();
    else if (strName == "focusSpeed"          ) objJson.Configuration.focusSpeed           = parseFloat($(this).val()    );
    else if (strName == "focusNearLimit"      ) objJson.Configuration.focusNearLimit       = parseFloat($(this).val()    );
    else if (strName == "focusFarLimit"       ) objJson.Configuration.focusFarLimit        = parseFloat($(this).val()    );
    else if (strName == "sharpness"           ) objJson.Configuration.sharpness            = parseInt  ($(this).val(), 10);
    else if (strName == "contrast"            ) objJson.Configuration.contrast             = parseInt  ($(this).val(), 10);
    else if (strName == "brightness"          ) objJson.Configuration.brightness           = parseInt  ($(this).val(), 10);
    else if (strName == "saturation"          ) objJson.Configuration.saturation           = parseInt  ($(this).val(), 10);
    else if (strName == "iso"                 ) objJson.Configuration.iso                  = parseInt  ($(this).val(), 10);
    else if (strName == "exposureMode"        ) objJson.Configuration.exposureMode         = parseInt  ($(this).val(), 10);
    else if (strName == "whiteBalance"        ) objJson.Configuration.whiteBalance         = parseInt  ($(this).val(), 10);
    else if (strName == "meteringMode"        ) objJson.Configuration.meteringMode         = parseInt  ($(this).val(), 10);
    else if (strName == "zoom"                ) objJson.Configuration.zoom                 = parseInt  ($(this).val(), 10);
    else if (strName == "reboot"              ) objJson.Configuration.reboot               = parseInt  ($(this).val(), 10);
    else
      return;

    setTimeout(function()
    {
      $socket.emit("transmitter.setStatus", objJson);
      $.nictRaspberryPi.putLog("send transmitter.setStatus [ " + JSON.stringify(objJson) + " ]");
    }, intTime);
  }
/*-----* open result dialog *-------------------------------------------------*/
  if ($(this).parents("." + strName).length > 0) $(this).parents("." + strName).addClass("blinking");
  else                                           $(this)                       .addClass("blinking");

  $(this).parents("li").addClass("change");

  $.nictRaspberryPi.openDialog("result", $("<div result_id='" + strResultId + "'><i></i></div>"), function()
  {
    $("#list li .blinking").removeClass("blinking");
    $("#list li"          ).removeClass("change"  );
  });

  $Env.resultTimeout = setTimeout(function()
  {
    $("#list li .blinking").removeClass("blinking");
    $("#list li"          ).removeClass("change"  );
    $("#dialog_result"    ).remove     ();

    $Env.resultTimeout = null;
  }, 15000);
});
/******************************************************************************/
/** window.unload                                                             */
/******************************************************************************/
$(window).on("unload", function()
{
  if (typeof localStorage != "undefined")
  {
    $Env.localStorage = { orderThumbnail : [], countThumbnail : parseInt($("#select_cols select").val(), 10) };

    $("#list").children("[mac_address]").each(function(pIndex, pElement)
    {
      $Env.localStorage.orderThumbnail.push($(pElement).attr("mac_address"));
    });

    try      { localStorage.setItem($Env.appName, JSON.stringify($Env.localStorage)); }
    catch(e) { /* DO NOTHING (For Local Browsing) */  }
  }
});
});
