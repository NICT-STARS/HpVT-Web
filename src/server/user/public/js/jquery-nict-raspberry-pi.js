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
    var strCaption      = typeof pJson.caption      == "string" ? pJson.caption      : "";
    var strSolutionType = typeof pJson.solutionType == "string" ? pJson.solutionType : "";
    var $image          = $("<div class='image'></div>");
    var $param          = $("<div class='param'></div>");
/*-----* image *--------------------------------------------------------------*/
    $image.append("<div class='view_area'><img src='" + $Env.noImagePath + "'/></div>");
    $image.append("<div class='bar'      >"                +
                    "<span class='bar_download'  ></span>" +
                    "<span class='bar_fullscreen'></span>" +
                  "</div>");
    $image.append("<div class='caption'  ><i></i>" + strCaption + "<i></i></div>");
    $image.append("<div class='date'     >&nbsp;</div>");
    $image.append("<div class='logo'     ></div>");
    $image.append("<div class='tab'      >"                                          +
                    "<div class='picture'><span class='select'><i></i></span></div>" +
                    "<div class='video'  ><span               ><i></i></span></div>" +
                  "</div>");

    $image.find("img").on("load", function()
    {
      $(this)              .animate({ opacity:1 }, { duration:600, easing: "swing" });
      $(this).parents("li").attr   ("aspect_ratio", (this.naturalWidth / this.naturalHeight).toFixed(1));
    });
/*-----* param *--------------------------------------------------------------*/
    $param.append("<h2  class='history'><i></i></h2>");
    $param.append("<div class='history_button'>"                                          +
                     "<a class='history_picture    disabled' target='_blank'><i></i></a>" +
                     "<a class='history_video      disabled' target='_blank'><i></i></a>" +
                     "<a class='history_cut_video  disabled' target='_blank'><i></i></a>" +
                     "<a class='history_time_lapse disabled' target='_blank'><i></i></a>" +
                  "</div>");

    if (pJson.graph && pJson.graph.flg)
    {
      var strGraphParam = $Env.graph.jsonPath.replace(/%filename/g, pJson.saveFileName);
      $param.append  ("<div   class='graph'      ><iframe src='" + $Env.graph.htmlPath.replace(/%json_path/g, encodeURIComponent(strGraphParam)) + "' frameborder='no' scrolling='no' allowfullscreen></iframe></div>");
      $param.append  ("<table class='graph_table'><thead><tr><th class='graph_date'></th><th class='graph_time'></th><th class='graph_arrow'></th><th class='graph_value'></th></tr></thead><tbody></tbody></table>");
      $li   .addClass("graph");
    }

    $param.append("<i class='view_url'></i>");
    if ($Env.showThumbnail)
    $param.append("<div class='list'></div>");

    $li = $("<li mac_address='" + pJson.macAddress + "' caption='" + strCaption + "' solution_type='" + strSolutionType + "'></li>");
    $li.append($image);
    $li.append($param);
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

  return $li;
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
/* nictRaspberryPi.getServeIndex                                              */
/******************************************************************************/
getServeIndex : function(pPath, pSuccess, pError, pAlways)
{
  $.ajax(
  {
    type     : "GET",
    url      : pPath,
    dataType : "html"
  })
  .then (function(pHtml) { if (typeof pSuccess == "function") pSuccess($(pHtml).filter("#files").find("li:not(.header)")); })
  .catch(function(pErr ) { if (typeof pError   == "function") pError  (); })
  .then (function(     ) { if (typeof pAlways  == "function") pAlways (); });
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
/* nictRaspberryPi.getCutList                                                 */
/******************************************************************************/
getCutList : function(pServeIndex, pDate, pCallBack)
{
  var $list         = $("<ul list_type='cut_list'></ul>");
  var objTargetDate = new Date($.nictRaspberryPi.formatDate(pDate        , "%y/%m/%d %H:%M:%S"));
  var strPath       =          $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.cutList.path);

  $.nictRaspberryPi.getServeIndex(strPath, function(pList)
  {
    var strReplacement = $.nictRaspberryPi.formatDate(objTargetDate, pServeIndex.cutList.replacement);
    var intIndex       = 0;
    var objDate;

    $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objTargetDate, "%y/%mm/%dd %H:%M:%S")).attr({ type:"header", date:objTargetDate.getTime() }));

    pList.each(function(pIndex, pElement)
    {
      if ($(pElement).find("a").attr("title") == "..") return true;

      objDate = new Date($(pElement).find("a").attr("title").replace(pServeIndex.cutList.pattern, strReplacement));

      if (objDate > objTargetDate) return false;
      intIndex++;

      if (objDate.getFullYear() == objTargetDate.getFullYear()
      &&  objDate.getMonth   () == objTargetDate.getMonth   ()
      &&  objDate.getDate    () == objTargetDate.getDate    ()
      &&  objDate.getHours   () == objTargetDate.getHours   ()
      &&  objDate.getMinutes () == objTargetDate.getMinutes ()
      &&  objDate.getSeconds () == objTargetDate.getSeconds ())
      {
        $list.append($("<li/>").text($.nictRaspberryPi.formatDate(objDate, "%y/%mm/%dd %H:%M:%S") + " " + ("0" + intIndex).slice(-2)).attr({ date:objDate.getTime(), seq:intIndex, src:strPath + $(pElement).find("a").attr("title") }));
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
searchList : function(pServeIndex, pDate, pTarget, pCallBack)
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

    if (!flgExist || pTarget == "year_list")
    {
      if (typeof pCallBack == "function") pCallBack(pYearList);
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

      if (!flgExist || pTarget == "month_list")
      {
        if (typeof pCallBack == "function") pCallBack(pMonthList);
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

        if (!flgExist || pTarget == "day_list")
        {
          if (typeof pCallBack == "function") pCallBack(pDayList);
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

          if (!flgExist || pTarget == "time_list")
          {
            if (typeof pCallBack == "function") pCallBack(pTimeList);
            return;
          }
/*-----* search file list *---------------------------------------------------*/
          if (pTarget == "file_list")
          {
            $.nictRaspberryPi.getFileList(pServeIndex, pDate, function(pFileList)
            {
              if (typeof pCallBack == "function") pCallBack(pFileList);
            });
          }
/*-----* search cut list *---------------------------------------------------*/
          else
          {
            $.nictRaspberryPi.getCutList(pServeIndex, pDate, function(pCutList)
            {
              if (typeof pCallBack == "function") pCallBack(pCutList);
            });
          }
        });
      });
    });
  });
},
/******************************************************************************/
/* nictRaspberryPi.searchPrevList                                             */
/******************************************************************************/
searchPrevList : function(pServeIndex, pDate, pTarget, pCallBack)
{
/*-----* initialize *---------------------------------------------------------*/
  var objTargetDate;
  var objDate;

       if (pTarget == "month_list") objTargetDate = new Date(pDate.getFullYear() - 1,               11,                  31,                   23, 59, 59, 999);
  else if (pTarget == "day_list"  ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth(),                   0,                   23, 59, 59, 999);
  else if (pTarget == "time_list" ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth(), pDate.getDate() - 1,                   23, 59, 59, 999);
  else if (pTarget == "file_list" ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth(), pDate.getDate()    , pDate.getHours() - 1, 59, 59, 999);
  else                              objTargetDate = new Date(pDate.getTime() - 1);
/*-----* search year list *---------------------------------------------------*/
  $.nictRaspberryPi.getYearList(pServeIndex, function(pYearList)
  {
    var intYear = null;

    pYearList.children().each(function(pIndex, pElement)
    {
      objDate = new Date(parseInt($(pElement).attr("date"), 10));
      if (objTargetDate.getFullYear() >= objDate.getFullYear()) intYear = objDate.getFullYear(); else return false;
    });

    if (intYear == null || pTarget == "year_list")
    {
      if (typeof pCallBack == "function") pCallBack(pYearList);
      return;
    }

    if (objTargetDate.getFullYear() != intYear) objTargetDate = new Date(intYear, 11, 31, 23, 59, 59, 999);
/*-----* search month list *--------------------------------------------------*/
    $.nictRaspberryPi.getMonthList(pServeIndex, objTargetDate, function(pMonthList)
    {
      var intMonth = null;

      pMonthList.children(":not([type='header'])").each(function(pIndex, pElement)
      {
        objDate = new Date(parseInt($(pElement).attr("date"), 10));
        if (objTargetDate.getMonth() >= objDate.getMonth()) intMonth = objDate.getMonth(); else return false;
      });

      if (pTarget == "month_list")
      {
        if (typeof pCallBack == "function") pCallBack(pMonthList);
        return;
      }
      else if (intMonth == null)
      {
        objTargetDate = new Date(objTargetDate.getFullYear(), 0, 1, 0, 0, 0, 0);
        $.nictRaspberryPi.searchPrevList(pServeIndex, objTargetDate, pTarget, pCallBack);
        return;
      }

      if (objTargetDate.getMonth() != intMonth) objTargetDate = new Date(objTargetDate.getFullYear(), intMonth + 1, 0, 23, 59, 59, 999);
/*-----* search day list *----------------------------------------------------*/
      $.nictRaspberryPi.getDayList(pServeIndex, objTargetDate, function(pDayList)
      {
        var intDay = null;

        pDayList.children(":not([type='header'])").each(function(pIndex, pElement)
        {
          objDate = new Date(parseInt($(pElement).attr("date"), 10));
          if (objTargetDate.getDate() >= objDate.getDate()) intDay = objDate.getDate(); else return false;
        });

        if (pTarget == "day_list")
        {
          if (typeof pCallBack == "function") pCallBack(pDayList);
          return;
        }
        else if (intDay == null)
        {
          objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth(), 1, 0, 0, 0, 0);
          $.nictRaspberryPi.searchPrevList(pServeIndex, objTargetDate, pTarget, pCallBack);
          return;
        }

        if (objTargetDate.getDate() != intDay) objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth(), intDay, 23, 59, 59, 999);
/*-----* search time list *---------------------------------------------------*/
        $.nictRaspberryPi.getTimeList(pServeIndex, objTargetDate, function(pTimeList)
        {
          var intTime = null;

          pTimeList.children(":not([type='header'])").each(function(pIndex, pElement)
          {
            objDate = new Date(parseInt($(pElement).attr("date"), 10));
            if (objTargetDate.getTime() >= objDate.getTime()) intTime = objDate.getTime(); else return false;
          });

          if (pTarget == "time_list")
          {
            if (typeof pCallBack == "function") pCallBack(pTimeList);
            return;
          }
          else if (intTime == null)
          {
            objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth(), objTargetDate.getDate(), 0, 0, 0, 0);
            $.nictRaspberryPi.searchPrevList(pServeIndex, objTargetDate, pTarget, pCallBack);
            return;
          }

          objTargetDate = new Date(intTime);
/*-----* search file list *---------------------------------------------------*/
          if (pTarget == "file_list")
          {
            $.nictRaspberryPi.getFileList(pServeIndex, objTargetDate, function(pFileList)
            {
              if (typeof pCallBack == "function") pCallBack(pFileList);
            });
          }
/*-----* search cut list *---------------------------------------------------*/
          else
          {
            $.nictRaspberryPi.getCutList(pServeIndex, objTargetDate, function(pCutList)
            {
              if (typeof pCallBack == "function") pCallBack(pCutList);
            });
          }
        });
      });
    });
  });
},
/******************************************************************************/
/* nictRaspberryPi.searchNextList                                             */
/******************************************************************************/
searchNextList : function(pServeIndex, pDate, pTarget, pCallBack)
{
/*-----* initialize *---------------------------------------------------------*/
  var objTargetDate;
  var objDate;

       if (pTarget == "month_list") objTargetDate = new Date(pDate.getFullYear() + 1,                    0,                   1,                    0, 0, 0, 0);
  else if (pTarget == "day_list"  ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth() + 1,                   1,                    0, 0, 0, 0);
  else if (pTarget == "time_list" ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth()    , pDate.getDate() + 1,                    0, 0, 0, 0);
  else if (pTarget == "file_list" ) objTargetDate = new Date(pDate.getFullYear()    , pDate.getMonth()    , pDate.getDate()    , pDate.getHours() + 1, 0, 0, 0);
  else                              objTargetDate = new Date(pDate.getTime() + 1);
/*-----* search year list *---------------------------------------------------*/
  $.nictRaspberryPi.getYearList(pServeIndex, function(pYearList)
  {
    var intYear = null;

    pYearList.children().each(function(pIndex, pElement)
    {
      objDate = new Date(parseInt($(pElement).attr("date"), 10));
      if (objTargetDate.getFullYear() <= objDate.getFullYear()) { intYear = objDate.getFullYear(); return false; }
    });

    if (intYear == null || pTarget == "year_list")
    {
      if (typeof pCallBack == "function") pCallBack(pYearList);
      return;
    }

    if (objTargetDate.getFullYear() != intYear) objTargetDate = new Date(intYear, 0, 1, 0, 0, 0, 0);
/*-----* search month list *--------------------------------------------------*/
    $.nictRaspberryPi.getMonthList(pServeIndex, objTargetDate, function(pMonthList)
    {
      var intMonth = null;

      pMonthList.children(":not([type='header'])").each(function(pIndex, pElement)
      {
        objDate = new Date(parseInt($(pElement).attr("date"), 10));
        if (objTargetDate.getMonth() <= objDate.getMonth()) { intMonth = objDate.getMonth(); return false; }
      });

      if (pTarget == "month_list")
      {
        if (typeof pCallBack == "function") pCallBack(pMonthList);
        return;
      }
      else if (intMonth == null)
      {
        objTargetDate = new Date(objTargetDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        $.nictRaspberryPi.searchNextList(pServeIndex, objTargetDate, pTarget, pCallBack);
        return;
      }

      if (objTargetDate.getMonth() != intMonth) objTargetDate = new Date(objTargetDate.getFullYear(), intMonth, 1, 0, 0, 0, 0);
/*-----* search day list *----------------------------------------------------*/
      $.nictRaspberryPi.getDayList(pServeIndex, objTargetDate, function(pDayList)
      {
        var intDay = null;

        pDayList.children(":not([type='header'])").each(function(pIndex, pElement)
        {
          objDate = new Date(parseInt($(pElement).attr("date"), 10));
          if (objTargetDate.getDate() <= objDate.getDate()) { intDay = objDate.getDate(); return false; }
        });

        if (pTarget == "day_list")
        {
          if (typeof pCallBack == "function") pCallBack(pDayList);
          return;
        }
        else if (intDay == null)
        {
          objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth() + 1, 0, 23, 59, 59, 999);
          $.nictRaspberryPi.searchNextList(pServeIndex, objTargetDate, pTarget, pCallBack);
          return;
        }

        if (objTargetDate.getDate() != intDay) objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth(), intDay, 0, 0, 0, 0);
/*-----* search time list *---------------------------------------------------*/
        $.nictRaspberryPi.getTimeList(pServeIndex, objTargetDate, function(pTimeList)
        {
          var intTime = null;

          pTimeList.children(":not([type='header'])").each(function(pIndex, pElement)
          {
            objDate = new Date(parseInt($(pElement).attr("date"), 10));
            if (objTargetDate.getTime() <= objDate.getTime()) { intTime = objDate.getTime(); return false; }
          });

          if (pTarget == "time_list")
          {
            if (typeof pCallBack == "function") pCallBack(pTimeList);
            return;
          }
          else if (intTime == null)
          {
            objTargetDate = new Date(objTargetDate.getFullYear(), objTargetDate.getMonth(), objTargetDate.getDate(), 23, 59, 59, 999);
            $.nictRaspberryPi.searchNextList(pServeIndex, objTargetDate, pTarget, pCallBack);
            return;
          }

          objTargetDate = new Date(intTime);
/*-----* search file list *---------------------------------------------------*/
          if (pTarget == "file_list")
          {
            $.nictRaspberryPi.getFileList(pServeIndex, objTargetDate, function(pFileList)
            {
              if (typeof pCallBack == "function") pCallBack(pFileList);
            });
          }
/*-----* search cut list *---------------------------------------------------*/
          else
          {
            $.nictRaspberryPi.getCutList(pServeIndex, objTargetDate, function(pCutList)
            {
              if (typeof pCallBack == "function") pCallBack(pCutList);
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
searchNearItem : function(pList, pDate, pListType)
{
  if (pList.length > 0)
  {
    var $Prev       = null;
    var $Match      = null;
    var $Next       = null;
    var objPrevDate;
    var objNextDate;

    pList.each(function(pIndex, pElement)
    {
      objDate = new Date(parseInt($(pElement).attr("date"), 10));
/*-----* search year *--------------------------------------------------------*/
      if (pListType == "year_list")
      {
             if (pDate.getFullYear() == objDate.getFullYear()) { $Match = $(pElement); return false; }
        else if (pDate.getFullYear() <  objDate.getFullYear())                         return false;
      }
/*-----* search month *-------------------------------------------------------*/
      else if (pListType == "month_list")
      {
        if (pDate.getFullYear() == objDate.getFullYear())
        {
               if (pDate.getMonth() == objDate.getMonth()) { $Match = $(pElement); return false; }
          else if (pDate.getMonth() <  objDate.getMonth())                         return false;
        }
        else if (pDate.getFullYear() < objDate.getFullYear())
        {
          return false;
        }
      }
/*-----* search day *---------------------------------------------------------*/
      else if (pListType == "day_list")
      {
        if (pDate.getFullYear() == objDate.getFullYear())
        {
          if (pDate.getMonth() == objDate.getMonth())
          {
                 if (pDate.getDate() == objDate.getDate()) { $Match = $(pElement); return false; }
            else if (pDate.getDate() <  objDate.getDate())                         return false;
          }
          else if (pDate.getMonth() <  objDate.getMonth())
          {
            return false;
          }
        }
        else if (pDate.getFullYear() < objDate.getFullYear())
        {
          return false;
        }
      }
/*-----* search hour *--------------------------------------------------------*/
      else if (pListType == "hour_list")
      {
        if (pDate.getFullYear() == objDate.getFullYear())
        {
          if (pDate.getMonth() == objDate.getMonth())
          {
            if (pDate.getDate() == objDate.getDate())
            {
                   if (pDate.getHours() == objDate.getHours()) { $Match = $(pElement); return false; }
              else if (pDate.getHours() <  objDate.getHours())                         return false;
            }
            else if (pDate.getDate() <  objDate.getDate())
            {
              return false;
            }
          }
          else if (pDate.getMonth() <  objDate.getMonth())
          {
            return false;
          }
        }
        else if (pDate.getFullYear() < objDate.getFullYear())
        {
          return false;
        }
      }
/*-----* other *--------------------------------------------------------------*/
      else
      {
             if (pDate.getTime() >  objDate.getTime()) { $Prev  = $(pElement); objPrevDate = objDate; }
        else if (pDate.getTime() == objDate.getTime()) { $Match = $(pElement);                        return false; }
        else if (pDate.getTime() <  objDate.getTime()) { $Next  = $(pElement); objNextDate = objDate; return false; }
      }
    });
/*-----* get item *-----------------------------------------------------------*/
         if ($Match         ) return $Match;
    else if ($Prev && !$Next) return $Prev;
    else if ($Next && !$Prev) return $Next;
    else if ($Next &&  $Prev)
    {
      if (Math.abs(pDate - objPrevDate) < Math.abs(pDate - objNextDate)) return $Prev;
      else                                                               return $Next;
    }
  }
  else
    return null;
},
/******************************************************************************/
/* nictRaspberryPi.addImageList                                               */
/******************************************************************************/
addImageList : function(pList, pTargetList, pBefore)
{
  var $group = $("<li class='group'><ul><li class='dummy'/><li class='dummy'/><li class='dummy'/><li class='dummy'/><li class='dummy'/></ul></li>");

  if (pList.attr("list_type") == pTargetList)
  {
    pList.children(":not([type='header'])").each(function(pIndex, pElement)
    {
      var intDate = parseInt($(pElement).attr("date"), 10);
      var $li     = $("<li></li>");

      if ($("#tab .one_day_video").hasClass("select"))
      {
        $li.attr  ("date", intDate);
        $li.append("<img src='" + $Env.noImagePath + "' _src='" + $.nictRaspberryPi.formatDate(new Date(intDate), $Env.serveIndex.thumbnail.filePath, $Env.timeZone) + "'/>"   );
        $li.append("<div class='date'>"                         + $.nictRaspberryPi.formatDate(new Date(intDate), $Env.dateFormat                   , $Env.timeZone) + "</div>");
      }
      else if ($("#tab .cut_video").hasClass("select"))
      {
        var strIndex = ("0" + $(pElement).attr("seq")).slice(-2);

        $li.attr  ({ date : intDate, seq : strIndex });
        $li.append("<img src='" + $Env.noImagePath + "' _src='" + $(pElement).attr("src") + "'/>");
        $li.append("<div class='date'>"                         + $.nictRaspberryPi.formatDate(new Date(intDate), $Env.dateFormat + " " + $Env.timeFormat + " " + strIndex, $Env.timeZone) + "</div>");
      }
      else
      {
        var strFilePath = $("#tab .picture").hasClass("select") ? $Env.serveIndex.thumbnail.filePath : $Env.serveIndex.cutVideo.filePath.replace("%sq", "01");

        $li.attr  ("date", intDate);
        $li.append("<img src='" + $Env.noImagePath + "' _src='" + $.nictRaspberryPi.formatDate(new Date(intDate), strFilePath                            , $Env.timeZone) + "'/>"   );
        $li.append("<div class='date'>"                         + $.nictRaspberryPi.formatDate(new Date(intDate), $Env.dateFormat + " " + $Env.timeFormat, $Env.timeZone) + "</div>");
      }

      $group.find(".dummy:first").before($li);
    });
  }

  if (pBefore) $("#image_list").prepend($group);
  else         $("#image_list").append ($group);
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
