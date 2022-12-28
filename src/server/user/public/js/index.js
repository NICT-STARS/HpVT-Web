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
  start                : function(pEvnet, pUi) { pUi.item.find(".caption").data("cancelMouseUp", true); },
  stop                 : function(pEvnet, pUi) { $(window).trigger("unload"); }
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
var $socket = io.connect(location.protocol + "//" + location.host, { path:location.pathname + "socket.io" });
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

  $.nictRaspberryPi.putLog("send transmitter.getStatus");
  $.nictRaspberryPi.putLog("send transmitter.getImage");
});
/*-----* recv(transmitter.status) *-------------------------------------------*/
$socket.on("transmitter.status", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)       ) return;
  if (typeof pJson.macAddress     != "string") return;
  if (typeof pJson.Configuration  != "object") return;

  var $li = $.nictRaspberryPi.getList(pJson);

  if ((pJson.Configuration.connect != 1 || pJson.alive != 1) && $li.find("#video-player").length > 0) $li.find(".picture span").trigger("click");

  $li.toggleClass("stoped", pJson.alive == 0);

  $.nictRaspberryPi.setDistributionStatus($li, pJson.Configuration.connect);
  $.nictRaspberryPi.setDisabledStatus    ($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog               ("recv transmitter.status from " + pJson.macAddress);
});
/*-----* recv(transmitter.image) *--------------------------------------------*/
$socket.on("transmitter.image", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)       ) return;
  if (typeof pJson.macAddress     != "string") return;

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

    $li.find(".date").fadeOut(500, function(){ $(this).fadeIn(500); });
  }

  $.nictRaspberryPi.getServeIndex($Env.savePath.picture.parent, function(pList)
  {
    var strFileName = $Env.savePath.picture.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_picture").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_picture").attr       ("href"    , "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=image");
  },
  function()
  {
    $li.find(".history_picture").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.savePath.video.parent, function(pList)
  {
    var strFileName = $Env.savePath.video.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_video").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_video").attr       ("href"    , "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=video");
  },
  function()
  {
    $li.find(".history_video").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.savePath.cutVideo.parent, function(pList)
  {
    var strFileName = $Env.savePath.cutVideo.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_cut_video").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_cut_video").attr       ("href"    , "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=cutVideo");
  },
  function()
  {
    $li.find(".history_cut_video").toggleClass("disabled", true);
  });

  $.nictRaspberryPi.getServeIndex($Env.savePath.oneDayVideo.parent, function(pList)
  {
    var strFileName = $Env.savePath.oneDayVideo.folder.replace("%filename", pJson.saveFileName);
    $li.find(".history_time_lapse").toggleClass("disabled", pList.filter("*:has(a[title='" + strFileName + "'])").length < 1);
    $li.find(".history_time_lapse").attr       ("href"    , "viewer.html?caption=" + encodeURIComponent(pJson.caption) + "&filename=" + encodeURIComponent(pJson.saveFileName) + "&media=oneDayVideo");
  },
  function()
  {
    $li.find(".history_time_lapse").toggleClass("disabled", true);
  });

  if ($li.find(".graph iframe").length > 0)
  {
    $.ajax({ type:"GET", url:$Env.graph.jsonPath.replace(/%filename/g, pJson.saveFileName), dataType:"json" }).then(function(pGraphJson)
    {
      $li.find(".graph_table tbody tr").remove();

      for (var i01 = 0; i01 < pGraphJson[0].length; i01++)
      {
        var $tr     = $("<tr></tr>");
        var $date   = $("<td class='graph_date' ></td>");
        var $time   = $("<td class='graph_time' ></td>");
        var $arrow  = $("<td class='graph_arrow'></td>");
        var $value  = $("<td class='graph_value'></td>");
        var objDate = new Date(pGraphJson[0][i01].date.replace(/-/g, "/"));

        $date                         .text    ($.nictRaspberryPi.formatDate(objDate, "%y/%mm/%dd"));
        $time                         .text    ($.nictRaspberryPi.formatDate(objDate, "%H:%M:%S"));
        $value                        .text    (pGraphJson[0][i01].v1.toFixed(2));
        $arrow                        .addClass(i01 > 0 ? (pGraphJson[0][i01].v1 > pGraphJson[0][i01 - 1].v1 ? "gt" : (pGraphJson[0][i01].v1 < pGraphJson[0][i01 - 1].v1 ? "lt" : "eq")) : "");
        $tr                           .append  ($date);
        $tr                           .append  ($time);
        $tr                           .append  ($arrow);
        $tr                           .append  ($value);
        $li.find(".graph_table tbody").append  ($tr);
      }

      if (typeof $li.find(".graph iframe").get(0).contentWindow.loop_update == "function") $li.find(".graph iframe").get(0).contentWindow.loop_update();
    });
  }

  $.nictRaspberryPi.setDisabledStatus($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog           ("recv transmitter.image from " + pJson.macAddress);
});
/*-----* recv(transmitter.exit) *---------------------------------------------*/
$socket.on("transmitter.exit", function(pJson)
{
  if (!$.nictRaspberryPi.isJson(pJson)                                   ) return;
  if (typeof pJson.macAddress != "string"                                ) return;
  if ($("#list > li[mac_address='" + pJson.macAddress + "']").length == 0) return;

  var $li = $.nictRaspberryPi.getList(pJson);

  if ($li.find("#video-player").length > 0) $li.find(".picture span").trigger("click");

  $.nictRaspberryPi.setDistributionStatus($li, 0);
  $.nictRaspberryPi.setDisabledStatus    ($li, pJson.alive > -1);
  $.nictRaspberryPi.putLog               ("transmitter.exit from " + pJson.macAddress);
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
$socket.on("_disconnect", function()
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
