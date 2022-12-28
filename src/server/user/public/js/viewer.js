/******************************************************************************/
/* Raspberry Pi Camera Web                                                    */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* window.load                                                                */
/******************************************************************************/
$(window).on("load", function()
{
/*-----* get url environment *------------------------------------------------*/
  if(window.location.search.length > 1)
  {
    var objGetQueryString = $.nictRaspberryPi.getQueryString(window.location.search.substring(1).split("&"));
    var strSolutionType   = "image";

    for (var strServeIndex in $Env.serveIndex)
    {
      if ($Env.serveIndex[strServeIndex]. yearList) $Env.serveIndex[strServeIndex]. yearList.path = $Env.serveIndex[strServeIndex]. yearList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex].monthList) $Env.serveIndex[strServeIndex].monthList.path = $Env.serveIndex[strServeIndex].monthList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex].  dayList) $Env.serveIndex[strServeIndex].  dayList.path = $Env.serveIndex[strServeIndex].  dayList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex]. timeList) $Env.serveIndex[strServeIndex]. timeList.path = $Env.serveIndex[strServeIndex]. timeList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex]. fileList) $Env.serveIndex[strServeIndex]. fileList.path = $Env.serveIndex[strServeIndex]. fileList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex].  cutList) $Env.serveIndex[strServeIndex].  cutList.path = $Env.serveIndex[strServeIndex].  cutList.path.replace(/%filename/g, objGetQueryString.filename);
      if ($Env.serveIndex[strServeIndex]. filePath) $Env.serveIndex[strServeIndex].      filePath = $Env.serveIndex[strServeIndex].      filePath.replace(/%filename/g, objGetQueryString.filename);
    }

    $.nictRaspberryPi.getServeIndex($Env.serveIndex.video.yearList.path, function(pVideoList)
    {
      if (pVideoList.length > 0) strSolutionType += "_video";
    },
    null,
    function()
    {
      $.nictRaspberryPi.getServeIndex($Env.serveIndex.oneDayVideo.yearList.path, function(pOneDayVideoList)
      {
        if (pOneDayVideoList.length > 0) strSolutionType += "_oneDayVideo";
      },
      null,
      function()
      {
        $("#caption > span:first").text(objGetQueryString.caption);
        $("body"                 ).attr("solution_type", strSolutionType);

             if (objGetQueryString.media == "video"      ) $("#tab .video"        ).addClass("select");
        else if (objGetQueryString.media == "cutVideo"   ) $("#tab .cut_video"    ).addClass("select");
        else if (objGetQueryString.media == "oneDayVideo") $("#tab .one_day_video").addClass("select");
        else                                               $("#tab .picture"      ).addClass("select");

        if (typeof objGetQueryString.date == "string" && /^\d+$/.test(objGetQueryString.date))
        {
          var objDate = new Date(parseInt(objGetQueryString.date, 10));
          $("#date"       ).attr("date", objDate.getTime());
          $("#tab .select").removeClass("select").trigger("click");
        }
        else
          $("#date i:last").trigger("click");
      });
    });
  }

  $("#image_button").fadeOut(0);
  $("#image_bar"   ).fadeOut(0);
});$(function() {
/******************************************************************************/
/* window.resize                                                              */
/******************************************************************************/
$(window).on("resize", function()
{
  if (!isNaN($Env.aspectRatio))
  {
    if ($("#image").width() / $Env.aspectRatio > $(window).outerHeight(true) * 0.5) $("#video_viewer").css({ paddingTop : "0", height : "50vh", width : $(window).outerHeight(true) * 0.5 * $Env.aspectRatio + "px" });
    else                                                                            $("#video_viewer").css({ paddingTop : "" , height : ""    , width : "" });
  }

  setTimeout(function _sleep()
  {
    var $image = $("#image_viewer .slick-current img");

    if (($image.length > 0 && $image.get(0).naturalWidth > 0 && $image.get(0).naturalHeight > 0)
    ||   $("#tab .video"        ).hasClass("select")
    ||   $("#tab .one_day_video").hasClass("select"))
    {
      if ($image.length > 0) $("#image_bar"            ).css({ left : $image.offset().left + "px", width : $image.width() + "px" });
                             $("#image_list"           ).css("height" , $(window).height() - $("header").outerHeight(true) - $("#tab").outerHeight(true) - $("#view_area").outerHeight(true) - $("#caption").outerHeight(true) - ($("#image_list").outerHeight(true) - $("#image_list").outerHeight()) + "px");
                             $("#image_list_arrow_up"  ).css("bottom" , (parseInt($("#image_list").css("height"), 10) - $("#image_list_arrow_up").height()) + "px");
                             $("#image_list_button"    ).css("height" , $("#image_list").height() + "px");
                             $("#image_list_button > *").css("display", "");

      if ($("#image_list_button").height() < $("#image_list_button > *").height() * 6) $("#image_list_button > *[id*='4h']").css("display", "none");
      if ($("#image_list_button").height() < $("#image_list_button > *").height() * 4) $("#image_list_button > *[id*='6h']").css("display", "none");
      if ($("#image_list_button").height() < $("#image_list_button > *").height() * 2) $("#image_list_button > *[id*='1h']").css("display", "none");
    }
    else
      setTimeout(_sleep, 100);
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
/* date.i:first.click                                                         */
/******************************************************************************/
$("#date i:first").nictRaspberryPiCalendar(
{
/*-----* date *---------------------------------------------------------------*/
  date                : function()
  {
    return new Date(parseInt($("#date").attr("date"), 10));
  },
/*-----* createYearCalendar *-------------------------------------------------*/
  createYearCalendar  : function(pDate, pCalendar)
  {
    var objServeIndex = $("#tab .picture").hasClass("select") ? $Env.serveIndex.thumbnail : ($("#tab .one_day_video").hasClass("select") ? $Env.serveIndex.oneDayVideo : $Env.serveIndex.video);

    pCalendar.find("td").addClass("disabled");

    $.nictRaspberryPi.getYearList(objServeIndex, function(pYearList)
    {
      pYearList.children().each(function(pIndex, pElement)
      {
        var objDate = new Date(parseInt($(pElement).attr("date"), 10));

        pCalendar.find("td").each(function(pIndex2, pElement2)
        {
          var objDate2 = new Date(parseInt($(pElement2).attr("date"), 10));

          if (objDate.getFullYear() == objDate2.getFullYear())
          {
            $(pElement2).removeClass("disabled");
            return false;
          }
        });
      });
    });
  },
/*-----* createMonthCalendar *------------------------------------------------*/
  createMonthCalendar : function(pDate, pCalendar)
  {
    var objServeIndex = $("#tab .picture").hasClass("select") ? $Env.serveIndex.thumbnail : ($("#tab .one_day_video").hasClass("select") ? $Env.serveIndex.oneDayVideo : $Env.serveIndex.video);

    pCalendar.find("td").addClass("disabled");

    $.nictRaspberryPi.getMonthList(objServeIndex, pDate, function(pMonthList)
    {
      pMonthList.children(":not([type='header'])").each(function(pIndex, pElement)
      {
        var objDate  = new Date(parseInt($(pElement).attr("date"), 10));
        pCalendar.find("td").eq(objDate.getMonth()).removeClass("disabled");
      });
    });
  },
/*-----* createDayCalendar *--------------------------------------------------*/
  createDayCalendar   : function(pDate, pCalendar)
  {
    var objServeIndex = $("#tab .picture").hasClass("select") ? $Env.serveIndex.thumbnail : ($("#tab .one_day_video").hasClass("select") ? $Env.serveIndex.oneDayVideo : $Env.serveIndex.video);
    var intIndex      = pCalendar.find("td").index(pCalendar.find("td[date]")) - 1;

    pCalendar.find("td").addClass("disabled");

    $.nictRaspberryPi.getDayList(objServeIndex, pDate, function(pDayList)
    {
      pDayList.children(":not([type='header'])").each(function(pIndex, pElement)
      {
        var objDate  = new Date(parseInt($(pElement).attr("date"), 10));
        pCalendar.find("td").eq(intIndex + objDate.getDate()).removeClass("disabled");
      });
    });
  },
/*-----* selectDay *----------------------------------------------------------*/
  selectDay : function(pDate)
  {
    var objDate = new Date(parseInt($("#date").attr("date"), 10));

    pDate.setHours(objDate.getHours(), objDate.getMinutes(), objDate.getSeconds());

    $("#date"        ).attr("date", pDate.getTime());
    $("#tab .select" ).removeClass("select").trigger("click");
    $("#date i:first").trigger("close.nictRaspberryPiCalendar");
  }
});
/******************************************************************************/
/* date.i:last.click                                                          */
/******************************************************************************/
$("#date i:last").on("click", function()
{
  $("#date"        ).attr("date", (new Date()).getTime());
  $("#tab .select" ).removeClass("select").trigger("click");
});
/******************************************************************************/
/* view_url_button                                                            */
/******************************************************************************/
$("#view_url_button").on("click", function()
{
  var strViewUrl        = window.location.protocol + "//" + window.location.host + window.location.pathname;
  var objGetQueryString = $.nictRaspberryPi.getQueryString(window.location.search.substring(1).split("&"));
  var $dialogBody       = $("<div><a target='_blank'></a></div>");
  var fncSelectText     = function()
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

  strViewUrl += "?caption="  + encodeURIComponent(objGetQueryString.caption);
  strViewUrl += "&filename=" + encodeURIComponent(objGetQueryString.filename);
  strViewUrl += "&media="    + encodeURIComponent($("#tab .picture").hasClass("select") ? "image" : ($("#tab .video").hasClass("select") ? "video" : ($("#tab .cut_video").hasClass("select") ? "cutVideo" : "oneDayVideo")));
  strViewUrl += "&date="     + encodeURIComponent($("#date").attr("date"));

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
/* tab.click                                                                  */
/******************************************************************************/
$("#tab").on("click", "> *", function()
{
  if ($(this).hasClass("select"    )) return;
  if ($(this).data    ("clickEvent")) return; else $(this).data("clickEvent", true);

  var $this           = $(this);
  var objDate         = new Date(parseInt($("#date").attr("date"), 10));
  var objServeIndex;
  var strTargetList;

  $this                .   addClass("select" );
  $this.siblings()     .removeClass("select" );
  $("#wait_message"   ).   addClass("display");
  $("#image_list > li").remove     ();

       if ($("#tab .picture"  ).hasClass("select")) { objServeIndex = $Env.serveIndex.thumbnail;   strTargetList = "file_list"; $("#image_list_button").css("display", ""    ); }
  else if ($("#tab .video"    ).hasClass("select")) { objServeIndex = $Env.serveIndex.video;       strTargetList = "file_list"; $("#image_list_button").css("display", ""    ); }
  else if ($("#tab .cut_video").hasClass("select")) { objServeIndex = $Env.serveIndex.cutVideo;    strTargetList = "cut_list";  $("#image_list_button").css("display", "none"); }
  else                                              { objServeIndex = $Env.serveIndex.oneDayVideo; strTargetList = "day_list";  $("#image_list_button").css("display", "none"); }

  $.nictRaspberryPi.searchList(objServeIndex, objDate, strTargetList, function(pList)
  {
    if (pList.attr("list_type") == strTargetList && pList.children(":not([type='header'])").length > 0)
    {
      $.nictRaspberryPi.addImageList(pList, strTargetList);
      $("#wait_message").removeClass("display");

      var $nearItem = $.nictRaspberryPi.searchNearItem($("#image_list .group li:not(.dummy)"), objDate);
      if ($nearItem) $nearItem.find(".date").trigger("click", true);

      $this.data("clickEvent", false);
    }
    else
    {
      $.nictRaspberryPi.searchPrevList(objServeIndex, objDate, strTargetList, function(pList)
      {
        $.nictRaspberryPi.addImageList(pList, strTargetList);

        $.nictRaspberryPi.searchNextList(objServeIndex, objDate, strTargetList, function(pList)
        {
          $.nictRaspberryPi.addImageList(pList, strTargetList);
          $("#wait_message").removeClass("display");

          var $nearItem = $.nictRaspberryPi.searchNearItem($("#image_list .group li:not(.dummy)"), objDate);
          if ($nearItem) $nearItem.find(".date").trigger("click", true);

          $this.data("clickEvent", false);
        });
      });
    }
  });
});
/******************************************************************************/
/* view_area.mousemove click                                                  */
/******************************************************************************/
$("#view_area").on("mousemove click", function()
{
  if ($("#view_area").data("mousemoveEvent")) clearTimeout($("#view_area").data("mousemoveEvent"));

  $("#image_button").css("display", "");
  $("#image_bar"   ).css("display", $("#tab .picture").hasClass("select") || $("#tab .cut_video").hasClass("select") ? "" : "none");

  $("#view_area").data("mousemoveEvent", setTimeout(function()
  {
    $("#image_button").fadeOut(1000);
    $("#image_bar"   ).fadeOut(1000);
    $("#view_area").data("mousemoveEvent", null);
  }, 3000));
});
/******************************************************************************/
/* image_viewer.slick                                                         */
/******************************************************************************/
$("#image_viewer").slick({ arrows:false, infinite:false }).on("afterChange", function(pEvent, pCurrentSlide, pNextSlide)
{
  if ($("#image_viewer").data("cancelAfterChange")) return;

  var intSlickSpeed = $("#image_viewer").slick("slickGetOption", "speed");
  var $img          = $("#image_viewer .slick-current img");
  var $li           = $("#image_list .group li[date='" + $img.attr("date") + "']" + ($("#tab .cut_video").hasClass("select") ? "[seq='" + $img.attr("seq") + "']" : ""));
  var objDate       = new Date(parseInt($img.attr("date"), 10));

  $("#date"                ).attr       ("date", objDate.getTime());
  $("#date span"           ).text       ($.nictRaspberryPi.formatDate(objDate, $Env.dateFormat + ($("#tab .one_day_video").hasClass("select") ? "" : " " + $Env.timeFormat), $Env.timeZone));
  $("#image_list .group li").removeClass("select");

  if ($img.length > 0)
  {
    setTimeout(function _sleep()
    {
      if ($img.get(0).naturalWidth > 0 && $img.get(0).naturalHeight > 0)
      {
        $Env.aspectRatio = $img.get(0).naturalWidth / $img.get(0).naturalHeight;
        $("body").attr("aspect_ratio" , $Env.aspectRatio.toFixed(1));
      }
      else
        setTimeout(_sleep, 1000);
    }, 1);
  }
/*-----* change slick *-------------------------------------------------------*/
  if ($li.length > 0)
  {
    $li.addClass("select");

    var intIndex  = $("#image_list .group li:not(.dummy)").index($li);
    var intLength = $("#image_list .group li:not(.dummy)").length;

    if (pNextSlide == 1 && 1 < intIndex && intIndex < intLength - 3)
    {
      setTimeout(function()
      {
        var $prev   = $("#image_list .group li:not(.dummy):eq(" + (intIndex - 2) + ")");
        var objDate = new Date(parseInt($prev.attr("date"), 10));
        var strSeq  =                   $prev.attr("seq" );

        $("#image_viewer").slick  ("slickSetOption", "speed", 0, true);
        $("#image_viewer").slick  ("slickRemove"   , 4);
        $("#image_viewer").slick  ("slickAdd"      , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $prev.find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, $Env.serveIndex.picture.filePath)) + "' date='" + objDate.getTime() + "' seq='" + strSeq + "'/></div>", 0, "addBefore");
        $("#image_viewer").slick  ("slickGoTo"     , 2, true);
        $("#image_viewer").slick  ("slickSetOption", "speed", intSlickSpeed, true);
        $("#image_list"  ).trigger("scroll"        , $("#image_list").scrollTop() + ($li.offset().top - $("#image_list").offset().top - 2));
      }, 1);
    }
    else if (pNextSlide == 3 && 2 < intIndex && intIndex < intLength - 2)
    {
      setTimeout(function()
      {
        var $next   = $("#image_list .group li:not(.dummy):eq(" + (intIndex + 2) + ")");
        var objDate = new Date(parseInt($next.attr("date"), 10));
        var strSeq  =                   $next.attr("seq" );

        $("#image_viewer").slick  ("slickSetOption", "speed", 0, true);
        $("#image_viewer").slick  ("slickRemove"   , 0);
        $("#image_viewer").slick  ("slickAdd"      , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $next.find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, $Env.serveIndex.picture.filePath)) + "' date='" + objDate.getTime() + "' seq='" + strSeq + "'/></div>");
        $("#image_viewer").slick  ("slickGoTo"     , 2, true);
        $("#image_viewer").slick  ("slickSetOption", "speed", intSlickSpeed, true);
        $("#image_list"  ).trigger("scroll"        , $("#image_list").scrollTop() + ($li.offset().top - $("#image_list").offset().top - 2));
      }, 1);
    }
  }
/*-----* reload image list *--------------------------------------------------*/
  else
  {
    $("#wait_message"   ).addClass("display");
    $("#image_list > li").remove  ();

    var objServeIndex;
    var strTargetList;

         if ($("#tab .picture"  ).hasClass("select")) { objServeIndex = $Env.serveIndex.thumbnail;   strTargetList = "file_list"; }
    else if ($("#tab .video"    ).hasClass("select")) { objServeIndex = $Env.serveIndex.video;       strTargetList = "file_list"; }
    else if ($("#tab .cut_video").hasClass("select")) { objServeIndex = $Env.serveIndex.cutVideo;    strTargetList = "cut_list";  }
    else                                              { objServeIndex = $Env.serveIndex.oneDayVideo; strTargetList = "day_list";  }

    $.nictRaspberryPi.searchList(objServeIndex, objDate, strTargetList, function(pList)
    {
      if (pList.attr("list_type") == strTargetList && pList.children(":not([type='header'])").length > 0)
      {
        $.nictRaspberryPi.addImageList(pList, strTargetList);
        $li = $("#image_list .group li[date='" + $img.attr("date") + "']" + ($("#tab .cut_video").hasClass("select") ? "[seq='" + $img.attr("seq") + "']" : ""));
        if ($li.length > 0) $li.find(".date").trigger("click", true);
      }

      $("#wait_message").removeClass("display");
    });
  }
});
/******************************************************************************/
/* video_viewer iframe.mousemove click                                        */
/******************************************************************************/
$("#video_viewer iframe").on("load", function()
{
  $(this).contents().on("mousemove touchstart click", function() { $("#view_area").trigger("mousemove"); });
  $(this).contents().on("mouseup   touchend"        , function() { $(document    ).trigger("mouseup"  ); });

  if (typeof $(this).attr("video_src") == "string" && $(this).attr("video_src").length > 0)
  {
    $(this).contents().find("video").attr("src", $(this).attr("video_src"));
    $(this).get(0).contentWindow.playVideo();
  }
});
/******************************************************************************/
/* image_button.click                                                         */
/******************************************************************************/
$("#image_button").on("click", "i", function()
{
  if ($("#image_button").data("execute")) return;

  var $this = $(this);

  $("#image_button").data("execute", setTimeout(function()
  {
    var objDate = new Date(parseInt($("#date").attr("date"), 10));
    var $item   = $("#image_list .group li[date='" + objDate.getTime() + "']" + ($("#tab .cut_video").hasClass("select") ? "[seq='" + $("#image_viewer .slick-current img").attr("seq") + "']" : ""));
    var $list   = $("#image_list .group li:not(.dummy)");
    var $group  = $item.closest(".group");
/*-----* prev *---------------------------------------------------------------*/
    if ($this.attr("id") == "image_button_prev")
    {
      if ($item.length > 0)
      {
        var intIndex = $list.index($item);

        if (intIndex > 0) $list.eq(intIndex - 1).find(".date").trigger("click", true);
        setTimeout(function() { $("#image_button").removeData("execute"); }, 500);
        return;
      }
    }
/*-----* next *---------------------------------------------------------------*/
    else if ($this.attr("id") == "image_button_next")
    {
      if ($item.length > 0)
      {
        var intIndex  = $list.index($item);
        var intLength = $list.length;

        if (intIndex < intLength - 1) $list.eq(intIndex + 1).find(".date").trigger("click", true);
        setTimeout(function() { $("#image_button").removeData("execute"); }, 500);
        return;
      }
    }
/*-----* prevs *--------------------------------------------------------------*/
    else if ($this.attr("id") == "image_button_prevs")
    {
      if ($group.length > 0)
      {
        var intIndex = $("#image_list .group").index($group);

        if (intIndex > 0)
        {
          var $prev = $("#image_list .group").eq(intIndex - 1);
          var $date = $prev.find("li:not(.dummy):first .date");

          if ($date.length > 0) $date                                    .trigger("click", true);
          else                  $group.find("li:not(.dummy):first .date").trigger("click", true);
        }
        else
          $group.find("li:not(.dummy):first .date").trigger("click", true);

        setTimeout(function() { $("#image_button").removeData("execute"); }, 500);
        return;
      }
    }
/*-----* nexts *--------------------------------------------------------------*/
    else if ($this.attr("id") == "image_button_nexts")
    {
      if ($group.length > 0)
      {
        var intIndex  = $("#image_list .group").index($group);
        var intLength = $("#image_list .group").length;

        if (intIndex < intLength - 1)
        {
          var $next = $("#image_list .group").eq(intIndex + 1);
          var $date = $next.find("li:not(.dummy):first .date");

          if ($date.length > 0) $date                                   .trigger("click", true);
          else                  $group.find("li:not(.dummy):last .date").trigger("click", true);
        }
        else
          $group.find("li:not(.dummy):last .date").trigger("click", true);

        setTimeout(function() { $("#image_button").removeData("execute"); }, 500);
        return;
      }
    }
/*-----* reload image list *--------------------------------------------------*/
    $("#wait_message"   ).addClass("display");
    $("#image_list > li").remove  ();

    var objServeIndex;
    var strTargetList;

         if ($("#tab .picture"  ).hasClass("select")) { objServeIndex = $Env.serveIndex.thumbnail;   strTargetList = "file_list"; }
    else if ($("#tab .video"    ).hasClass("select")) { objServeIndex = $Env.serveIndex.video;       strTargetList = "file_list"; }
    else if ($("#tab .cut_video").hasClass("select")) { objServeIndex = $Env.serveIndex.cutVideo;    strTargetList = "cut_list";  }
    else                                              { objServeIndex = $Env.serveIndex.oneDayVideo; strTargetList = "day_list";  }

    $.nictRaspberryPi.searchList(objServeIndex, objDate, strTargetList, function(pList)
    {
      if (pList.attr("list_type") == strTargetList && pList.children(":not([type='header'])").length > 0)
      {
        $.nictRaspberryPi.addImageList(pList, strTargetList);
      }

      $.nictRaspberryPi.searchPrevList(objServeIndex, objDate, strTargetList, function(pList)
      {
        $.nictRaspberryPi.addImageList(pList, strTargetList, true);

        $.nictRaspberryPi.searchNextList(objServeIndex, objDate, strTargetList, function(pList)
        {
          $.nictRaspberryPi .addImageList(pList, strTargetList);
          $("#wait_message").removeClass ("display");
          $("#image_button").removeData  ("execute");
          $this             .trigger     ("click"  );
        });
      });
    });
  }, 50));
});
/******************************************************************************/
/* image_bar_download.click                                                   */
/******************************************************************************/
$("#image_bar_download").on("click", function()
{
  var strSrc = "";

  if ($("#tab .picture").hasClass("select")) strSrc = $.nictRaspberryPi.formatDate(new Date(parseInt($("#date").attr("date"), 10)), $Env.serveIndex.fullPicture.filePath, $Env.timeZone);
  else                                       strSrc = $("#image_viewer .slick-current img").attr("src");

  $.nictRaspberryPi.download(strSrc);
});
/******************************************************************************/
/* image_bar_fullscreen.click                                                 */
/******************************************************************************/
$("#image_bar_fullscreen").on("click", function()
{
  if (!$.nictRaspberryPi.getFullScreenElement() && !$("#fullscreen_area").hasClass("fullscreen"))
  {
    if ($("#tab .picture").hasClass("select")) $("#fullscreen_viewer").attr("src", $.nictRaspberryPi.formatDate(new Date(parseInt($("#date").attr("date"), 10)), $Env.serveIndex.fullPicture.filePath, $Env.timeZone));
    else                                       $("#fullscreen_viewer").attr("src", $("#image_viewer .slick-current img").attr("src"));

    setTimeout(function _sleep()
    {
      if ($("#fullscreen_viewer").get(0).naturalWidth > 0 && $("#fullscreen_viewer").get(0).naturalHeight > 0)
      {
        $("#fullscreen_viewer").nictImageViewer(
        {
          maxWidth   : $("#fullscreen_viewer").get(0).naturalWidth  * 10,
          maxHeight  : $("#fullscreen_viewer").get(0).naturalHeight * 10,
          minWidth   : $("#fullscreen_viewer").get(0).naturalWidth  /  2,
          minHeight  : $("#fullscreen_viewer").get(0).naturalHeight /  2,
          moveBefore : function(pThis){ $("#fullscreen_area").trigger("mousemove"); }
        });

        $("#fullscreen_area").addClass("fullscreen");
        $.nictRaspberryPi.requestFullScreen($("#fullscreen_area").get(0));
      }
      else
        setTimeout(_sleep, 100);
    }, 1);
  }
});
/******************************************************************************/
/* fullscreen_area.mousemove click                                            */
/******************************************************************************/
$("#fullscreen_area").on("mousemove click", function()
{
  if ($("#fullscreen_area").data("mousemoveEvent")) clearTimeout($("#fullscreen_area").data("mousemoveEvent"));

  $("#fullscreen_bar").css("display", "");

  $("#fullscreen_area").data("mousemoveEvent", setTimeout(function()
  {
    $("#fullscreen_bar" ).fadeOut(1000);
    $("#fullscreen_area").data   ("mousemoveEvent", null);
  }, 3000));
});
/******************************************************************************/
/* fullscreen_bar_download.click                                              */
/******************************************************************************/
$("#fullscreen_bar_download").on("click", function()
{
  $.nictRaspberryPi.download($("#fullscreen_viewer").attr("src"));
});
/******************************************************************************/
/* fullscreen_bar_fullscreen.click                                            */
/******************************************************************************/
$("#fullscreen_bar_fullscreen").on("click", function()
{
  if ($.nictRaspberryPi.getFullScreenElement() || $("#fullscreen_area").hasClass("fullscreen"))
  {
    $("#fullscreen_area"  ).removeClass    ("fullscreen");
    $("#fullscreen_viewer").nictImageViewer("destroy"   );
    $.nictRaspberryPi.exitFullScreen();
  }
});
/******************************************************************************/
/* image_list.scroll                                                          */
/******************************************************************************/
$("#image_list").on("scroll", function(pEvent, pScroll)
{
  if ($("#image_list").data("scrollEvent")) clearTimeout($("#image_list").data("scrollEvent"));

  $("#image_list").data("scrollEvent", setTimeout(function()
  {
    if (pScroll)
    {
      $("#image_list").scrollTop (pScroll);
      $("#image_list").removeData("scrollEvent");
      $("#image_list").trigger   ("scroll");
      return;
    }
/*-----* load image *---------------------------------------------------------*/
    var intTop    = $("#image_list").offset().top;
    var intBottom = $("#image_list").outerHeight(true) + intTop;

    $("#image_list .group li:not(.dummy):not([load])").each(function(pIndex, pElement)
    {
      if ((intTop <= $(pElement).offset().top                        && $(pElement).offset().top                        <= intBottom)
      ||  (intTop <= $(pElement).offset().top + $(pElement).height() && $(pElement).offset().top + $(pElement).height() <= intBottom))
      {
        $(pElement).attr("load", "complete").children("img").attr("src", $(pElement).children("img").attr("_src"));
      }
      else if ($(pElement).offset().top > intBottom)
      {
        return false;
      }
    });
/*-----* add image list *-----------------------------------------------------*/
    if ($("#wait_message").hasClass("display"))
    {
      $("#image_list").removeData("scrollEvent");
      return;
    }
    else
      $("#wait_message").addClass("display");

    var $li     = null;
    var $group;
    var objServeIndex;
    var strTargetList;

    $("#image_list .group li[date]").each(function(pIndex, pElement)
    {
      if ((intTop <= $(pElement).offset().top                        && $(pElement).offset().top                        <= intBottom)
      &&  (intTop <= $(pElement).offset().top + $(pElement).height() && $(pElement).offset().top + $(pElement).height() <= intBottom))
      {
        $li     = $(pElement);
        $group  = $li.closest(".group");
        return false;
      }
    });

    if ($li == null)
    {
      $("#wait_message").removeClass("display"    );
      $("#image_list"  ).removeData ("scrollEvent");
      return;
    }

         if ($("#tab .picture"  ).hasClass("select")) { objServeIndex = $Env.serveIndex.thumbnail;   strTargetList = "file_list"; }
    else if ($("#tab .video"    ).hasClass("select")) { objServeIndex = $Env.serveIndex.video;       strTargetList = "file_list"; }
    else if ($("#tab .cut_video").hasClass("select")) { objServeIndex = $Env.serveIndex.cutVideo;    strTargetList = "cut_list";  }
    else                                              { objServeIndex = $Env.serveIndex.oneDayVideo; strTargetList = "day_list";  }

    function _searchImageList()
    {
      var intIndex  = $("#image_list .group").index($group);
      var intLength = $("#image_list .group").length;

      if (intIndex == 0)
      {
        var objDate = new Date(parseInt($group.find("li:not(.dummy):first").attr("date"), 10));

        $.nictRaspberryPi.searchPrevList(objServeIndex, objDate, strTargetList, function(pList)
        {
          var intDiffTop = $li.offset().top;

          $.nictRaspberryPi.addImageList(pList, strTargetList, true);
          if ($("#image_list .group").length > 5) $("#image_list .group:last").remove();
          $("#image_list").scrollTop($("#image_list").scrollTop() + ($li.offset().top - intDiffTop));
          _searchImageList();
        });
      }
      else if (intIndex == 1 && $("#image_list .group:first li:not(.dummy)").length > 0)
      {
        var objDate = new Date(parseInt($("#image_list .group:first li:not(.dummy):first").attr("date"), 10));

        $.nictRaspberryPi.searchPrevList(objServeIndex, objDate, strTargetList, function(pList)
        {
          var intDiffTop = $li.offset().top;

          $.nictRaspberryPi.addImageList(pList, strTargetList, true);
          if ($("#image_list .group").length > 5) $("#image_list .group:last").remove();
          $("#image_list").scrollTop($("#image_list").scrollTop() + ($li.offset().top - intDiffTop));
          _searchImageList();
        });
      }
      else if (intIndex == intLength - 2 && $("#image_list .group:last li:not(.dummy)").length > 0)
      {
        var objDate = new Date(parseInt($("#image_list .group:last li:not(.dummy):last").attr("date"), 10));

        $.nictRaspberryPi.searchNextList(objServeIndex, objDate, strTargetList, function(pList)
        {
          var intDiffTop = $li.offset().top;

          $.nictRaspberryPi.addImageList(pList, strTargetList);
          if ($("#image_list .group").length > 5) $("#image_list .group:first").remove();
          $("#image_list").scrollTop($("#image_list").scrollTop() + ($li.offset().top - intDiffTop));
          _searchImageList();
        });
      }
      else if (intIndex == intLength - 1)
      {
        var objDate = new Date(parseInt($group.find("li:not(.dummy):last").attr("date"), 10));

        $.nictRaspberryPi.searchNextList(objServeIndex, objDate, strTargetList, function(pList)
        {
          var intDiffTop = $li.offset().top;

          $.nictRaspberryPi.addImageList(pList, strTargetList);
          if ($("#image_list .group").length > 5) $("#image_list .group:first").remove();
          $("#image_list").scrollTop($("#image_list").scrollTop() + ($li.offset().top - intDiffTop));
          _searchImageList();
        });
      }
      else
      {
        if ($("#image_list .group:first li:not(.dummy)").length == 0
        &&  $("#image_list .group:first").next().find("li:not(.dummy)").length > 0
        &&  $("#image_list .group:first").next().find("li:not(.dummy):first").offset().top + $("#image_list .group:first").next().find("li:not(.dummy):first").height() >= intTop
        &&  $("#image_list .group:first").next().find("li:not(.dummy):first").offset().top + $("#image_list .group:first").next().find("li:not(.dummy):first").height() <= intBottom)
        {
          $("#image_list_arrow_up").css("display", "none");
        }
        else
        {
          $("#image_list_arrow_up").css("display", "");
        }

        if ($("#image_list .group:last li:not(.dummy)").length == 0
        &&  $("#image_list .group:last").prev().find("li:not(.dummy)").length > 0
        &&  $("#image_list .group:last").prev().find("li:not(.dummy):last").offset().top >= intTop
        &&  $("#image_list .group:last").prev().find("li:not(.dummy):last").offset().top <= intBottom)
        {
          $("#image_list_arrow_down").css("display", "none");
        }
        else
        {
          $("#image_list_arrow_down").css("display", "");
        }

        $("#wait_message").removeClass("display"    );
        $("#image_list"  ).removeData ("scrollEvent");
      }
    }

    _searchImageList();
  }, 100));
});
/******************************************************************************/
/* image_list.click                                                           */
/******************************************************************************/
$("#image_list").on("click", ".group li > .date", function(pEvent, pScroll)
{
  var objServeIndex;
  var $li           = $(this).parent();
  var $img          = $li    .find  ("img");
  var objDate       = new Date(parseInt($li.attr("date"), 10));

       if ($("#tab .picture"  ).hasClass("select")) objServeIndex = $Env.serveIndex.picture;
  else if ($("#tab .video"    ).hasClass("select")) objServeIndex = $Env.serveIndex.video;
  else if ($("#tab .cut_video").hasClass("select")) objServeIndex = $Env.serveIndex.cutVideo;
  else                                              objServeIndex = $Env.serveIndex.oneDayVideo;

  $("#image_list .group li").removeClass("select");
  $li                       .   addClass("select");
  $("#date"                ).attr       ("date"  , objDate.getTime());
  $("#date span"           ).text       ($.nictRaspberryPi.formatDate(objDate, $Env.dateFormat + ($("#tab .one_day_video").hasClass("select") ? "" : " " + $Env.timeFormat), $Env.timeZone));
/*-----* aspect ratio *-------------------------------------------------------*/
  if ($img.length > 0)
  {
    setTimeout(function _sleep()
    {
      if ($img.get(0).naturalWidth > 0 && $img.get(0).naturalHeight > 0)
      {
        $Env.aspectRatio = $img.get(0).naturalWidth / $img.get(0).naturalHeight;
        $("body").attr   ("aspect_ratio" , $Env.aspectRatio.toFixed(1));
        $(window).trigger("resize");
      }
      else
        setTimeout(_sleep, 100);
    }, 1);
  }
/*-----* picture cut_video *--------------------------------------------------*/
  if ($("#tab .picture").hasClass("select") || $("#tab .cut_video").hasClass("select"))
  {
    var $imageLoader = $("<img></img>");

    $imageLoader.on("load error", function()
    {
      while ($("#image_viewer img").length > 0) $("#image_viewer").slick("slickRemove", 0);

      $("#video_viewer").css ("display"          , "none").find("iframe").attr({ src : "", video_src : "" });
      $("#image_viewer").css ("display"          , ""    );
      $("#image_viewer").data("cancelAfterChange", true  );

      var $list     = $("#image_list .group li:not(.dummy)");
      var intIndex  = $list.index($li);
      var intLength = $list.length;

      if (intIndex == 0)
      {
                             objDate = new Date(parseInt($li                   .attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $li                   .find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $li                   .attr("seq") + "'/></div>");
        if (intLength > 1) { objDate = new Date(parseInt($list.eq(intIndex + 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 1).attr("seq") + "'/></div>"); }
        if (intLength > 2) { objDate = new Date(parseInt($list.eq(intIndex + 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 2).attr("seq") + "'/></div>"); }
        if (intLength > 3) { objDate = new Date(parseInt($list.eq(intIndex + 3).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 3).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 3).attr("seq") + "'/></div>"); }
        if (intLength > 4) { objDate = new Date(parseInt($list.eq(intIndex + 4).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 4).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 4).attr("seq") + "'/></div>"); }
                                                                                                    $("#image_viewer").slick("slickGoTo", 0, true);
      }
      else if (intIndex == intLength - 1)
      {
        if (intLength > 4) { objDate = new Date(parseInt($list.eq(intIndex - 4).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 4).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 4).attr("seq") + "'/></div>"); }
        if (intLength > 3) { objDate = new Date(parseInt($list.eq(intIndex - 3).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 3).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 3).attr("seq") + "'/></div>"); }
        if (intLength > 2) { objDate = new Date(parseInt($list.eq(intIndex - 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 2).attr("seq") + "'/></div>"); }
                             objDate = new Date(parseInt($list.eq(intIndex - 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 1).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($li                   .attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $li                   .find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $li                   .attr("seq") + "'/></div>");
                                                                                                    $("#image_viewer").slick("slickGoTo", intLength > 4 ? 4 : intLength > 3 ? 3 : intLength > 2 ? 2 : 1, true);
      }
      else
      {
        if (intIndex == 1)
        {
                             objDate = new Date(parseInt($list.eq(intIndex - 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 1).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($li                   .attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $li                   .find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $li                   .attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex + 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 1).attr("seq") + "'/></div>");
        if (intLength > 3) { objDate = new Date(parseInt($list.eq(intIndex + 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 2).attr("seq") + "'/></div>"); }
        if (intLength > 4) { objDate = new Date(parseInt($list.eq(intIndex + 3).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 3).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 3).attr("seq") + "'/></div>"); }
                                                                                                    $("#image_viewer").slick("slickGoTo", 1, true);
        }
        else if (intLength - intIndex == 2)
        {
        if (intLength > 4) { objDate = new Date(parseInt($list.eq(intIndex - 3).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 3).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 3).attr("seq") + "'/></div>"); }
                             objDate = new Date(parseInt($list.eq(intIndex - 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 2).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex - 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 1).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($li                   .attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $li                   .find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $li                   .attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex + 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 1).attr("seq") + "'/></div>");
                                                                                                    $("#image_viewer").slick("slickGoTo", intLength > 4 ? 3 : 2, true);
        }
        else
        {
                             objDate = new Date(parseInt($list.eq(intIndex - 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 2).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex - 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex - 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex - 1).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($li                   .attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $li                   .find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $li                   .attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex + 1).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 1).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 1).attr("seq") + "'/></div>");
                             objDate = new Date(parseInt($list.eq(intIndex + 2).attr("date"), 10)); $("#image_viewer").slick("slickAdd" , "<div><img src='" + ($("#tab .cut_video").hasClass("select") ? $list.eq(intIndex + 2).find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath)) + "' date='" + objDate.getTime() + "' seq='" + $list.eq(intIndex + 2).attr("seq") + "'/></div>");
                                                                                                    $("#image_viewer").slick("slickGoTo", 2, true);
        }
      }

      if (pScroll) $("#image_list").trigger("scroll", $("#image_list").scrollTop() + ($li.offset().top - $("#image_list").offset().top - 2));
      setTimeout(function() { $("#image_viewer").data("cancelAfterChange", null); }, 1000);
    });

    $imageLoader.attr("src", $("#tab .cut_video").hasClass("select") ? $li.find("img").attr("_src") : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath));
  }
/*-----* video one_day_video *------------------------------------------------*/
  else
  {
    while ($("#image_viewer img").length > 0) $("#image_viewer").slick("slickRemove", 0);

    $("#image_bar"   ).fadeOut(0);
    $("#image_viewer").css    ("display", "none");
    $("#video_viewer").css    ("display", ""    ).find("iframe").attr({ src : "video.html", video_src : $.nictRaspberryPi.formatDate(objDate, objServeIndex.filePath) });

    if (pScroll) $("#image_list").trigger("scroll", $("#image_list").scrollTop() + ($li.offset().top - $("#image_list").offset().top - 2));
  }
});
/******************************************************************************/
/* image_list_button.click                                                    */
/******************************************************************************/
$("#image_list_button").on("click", "> *", function()
{
  if ($("#image_list_button").data("execute")) return;

  var $this = $(this);

  $("#image_list_button").data("execute", setTimeout(function()
  {
/*-----* search current item *------------------------------------------------*/
    var intTop    = $("#image_list").offset().top;
    var intBottom = $("#image_list").outerHeight(true) + intTop;
    var $li       = null;

    $("#image_list .group li[date]").each(function(pIndex, pElement)
    {
      if ((intTop <= $(pElement).offset().top                        && $(pElement).offset().top                        <= intBottom)
      ||  (intTop <= $(pElement).offset().top + $(pElement).height() && $(pElement).offset().top + $(pElement).height() <= intBottom))
      {
        $li = $(pElement);
        return false;
      }
    });

    if ($li == null)
    {
      $("#image_list_button").removeData("execute");
      return;
    }
/*-----* exist near item *----------------------------------------------------*/
    var intDiffTime = 0;

         if ($this.attr("id") == "image_list_button_6h_minus") intDiffTime = 1000 * 60 * 60 * -6;
    else if ($this.attr("id") == "image_list_button_4h_minus") intDiffTime = 1000 * 60 * 60 * -4;
    else if ($this.attr("id") == "image_list_button_1h_minus") intDiffTime = 1000 * 60 * 60 * -1;
    else if ($this.attr("id") == "image_list_button_1h_plus" ) intDiffTime = 1000 * 60 * 60 *  1;
    else if ($this.attr("id") == "image_list_button_4h_plus" ) intDiffTime = 1000 * 60 * 60 *  4;
    else if ($this.attr("id") == "image_list_button_6h_plus" ) intDiffTime = 1000 * 60 * 60 *  6;

    var objCrntTime = new Date(parseInt($li.attr("date"), 10)              );
    var objDiffTime = new Date(parseInt($li.attr("date"), 10) + intDiffTime);
    var $nearItem   = $.nictRaspberryPi.searchNearItem($("#image_list .group li:not(.dummy)"), objDiffTime);

    if ($nearItem)
    {
      var objNearTime = new Date(parseInt($nearItem.attr("date"), 10));

      if (intDiffTime > 0) objDiffTime.setMinutes( 0,  0,   0);
      else                 objDiffTime.setMinutes(59, 59, 999);

      if ((intDiffTime > 0 && objNearTime.getTime() >= objDiffTime.getTime())
      ||  (intDiffTime < 0 && objNearTime.getTime() <= objDiffTime.getTime()))
      {
        $("#image_list").trigger("scroll", $("#image_list").scrollTop() + ($nearItem.offset().top - $("#image_list").offset().top - 2));
        setTimeout(function() { $("#image_list_button").removeData("execute"); }, 1000);
        return;
      }
    }
/*-----* not exist near item *------------------------------------------------*/
    $("#wait_message"   ).addClass("display");
    $("#image_list > li").remove  ();

    objDiffTime = new Date(parseInt($li.attr("date"), 10) + intDiffTime);

    var objServeIndex;
    var strTargetList;

         if ($("#tab .picture"  ).hasClass("select")) { objServeIndex = $Env.serveIndex.thumbnail;   strTargetList = "file_list"; }
    else if ($("#tab .video"    ).hasClass("select")) { objServeIndex = $Env.serveIndex.video;       strTargetList = "file_list"; }
    else if ($("#tab .cut_video").hasClass("select")) { objServeIndex = $Env.serveIndex.cutVideo;    strTargetList = "cut_list";  }
    else                                              { objServeIndex = $Env.serveIndex.oneDayVideo; strTargetList = "day_list";  }

    $.nictRaspberryPi.searchList(objServeIndex, objDiffTime, strTargetList, function(pList)
    {
      if (pList.attr("list_type") == strTargetList && pList.children(":not([type='header'])").length > 0)
      {
        $.nictRaspberryPi.addImageList(pList, strTargetList);
        $("#wait_message").removeClass("display");

        var $nearItem = $.nictRaspberryPi.searchNearItem($("#image_list .group li:not(.dummy)"), objDiffTime);
        if ($nearItem) $("#image_list").trigger("scroll", $("#image_list").scrollTop() + ($nearItem.offset().top - $("#image_list").offset().top - 2));
        $("#image_list_button").removeData("execute");
      }
      else
      {
        $.nictRaspberryPi.searchPrevList(objServeIndex, objDiffTime, strTargetList, function(pList)
        {
          $.nictRaspberryPi.addImageList(pList, strTargetList);

          $.nictRaspberryPi.searchNextList(objServeIndex, objDiffTime, strTargetList, function(pList)
          {
            $.nictRaspberryPi .addImageList(pList, strTargetList);
            $("#wait_message").removeClass ("display");

            var $nearItem = $.nictRaspberryPi.searchNearItem($("#image_list .group li:not(.dummy)"), objDiffTime);
            if ($nearItem) $("#image_list").trigger("scroll", $("#image_list").scrollTop() + ($nearItem.offset().top - $("#image_list").offset().top - 2));
            $("#image_list_button").removeData("execute");
          });
        });
      }
    });
  }, 50));
});
});
