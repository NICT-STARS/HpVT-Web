;(function($){ $.fn.nictRaspberryPiCalendar = function(pOptions){
/******************************************************************************/
/* NICT RaspberryPi Calendar for JQuery Plugin                                */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* initialize                                                                 */
/******************************************************************************/
  var $base      = this;
  var $calendar  = $("<div class='nict-raspberry-pi-calendar'><table></table></div>");
  var objOptions = $.extend(
  {
    date                : null,
    open                : null,
    close               : null,
    createYearCalendar  : null,
    createMonthCalendar : null,
    createDayCalendar   : null,
    selectYear          : null,
    selectMonth         : null,
    selectDay           : null
  }, pOptions);

  $("body").append($calendar);
/******************************************************************************/
/* $base.open.nictRaspberryPiCalendar                                         */
/******************************************************************************/
  $base.on("open.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    if (!$calendar.hasClass("open"))
    {
      var objDate = pExtra ? pExtra : (typeof objOptions.date == "function" ? objOptions.date() : new Date());
      $base.trigger("createDayCalendar.nictRaspberryPiCalendar", objDate);
      $calendar.addClass("open");
      if (typeof objOptions.open == "function") objOptions.open();
    }
  });
/******************************************************************************/
/* $base.close.nictRaspberryPiCalendar                                        */
/******************************************************************************/
  $base.on("close.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    if ($calendar.hasClass("open"))
    {
      $calendar.removeClass("open");
      if (typeof objOptions.close == "function") objOptions.close();
    }
  });
/******************************************************************************/
/* $base.createYearCalendar.nictRaspberryPiCalendar                           */
/******************************************************************************/
  $base.on("createYearCalendar.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    var objDate      = pExtra ? pExtra : new Date();
    var objStartDate = new Date(objDate.getFullYear() - 9, 0, 1);
    var objEndDate   = new Date(objDate.getFullYear()    , 0, 1);
    var intCols      = 0;
    var intRows      = 0;

    $calendar.find("table > *").remove();

    $calendar.find("table").attr  ("type", "year");
    $calendar.find("table").append("<caption><span class='prev'></span><span class='date'>&nbsp;</span><span class='next'></span></caption>");
    $calendar.find("table").append("<tfoot></tfoot>");
    $calendar.find("table").append("<tbody></tbody>");

    $calendar.find("tfoot").append("<tr><th colspan='4'></th><th class='close'></th></tr>");

    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td></tr>");

    $calendar.find("table caption .date").attr("date", objStartDate.getTime());

    while (objStartDate <= objEndDate)
    {
      $calendar.find("tbody tr").eq(intRows).find("td").eq(intCols).text(objStartDate.getFullYear()).attr("date", objStartDate.getTime());
      objStartDate.setFullYear(objStartDate.getFullYear() + 1);
      intCols++;

      if (intCols > 4)
      {
        intCols = 0;
        intRows++;
      }
    }

    if (typeof objOptions.createYearCalendar == "function") objOptions.createYearCalendar(objEndDate, $calendar.find("tbody"));
  });
/******************************************************************************/
/* $base.createMonthCalendar.nictRaspberryPiCalendar                          */
/******************************************************************************/
  $base.on("createMonthCalendar.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    var objDate      = pExtra ? pExtra : new Date();
    var objStartDate = new Date(objDate.getFullYear(),  0,  1);
    var objEndDate   = new Date(objDate.getFullYear(), 11, 31);
    var intCols      = 0;
    var intRows      = 0;

    $calendar.find("table > *").remove();

    $calendar.find("table").attr  ("type", "month");
    $calendar.find("table").append("<caption><span class='prev'></span><span class='date'></span><span class='next'></span></caption>");
    $calendar.find("table").append("<tfoot></tfoot>");
    $calendar.find("table").append("<tbody></tbody>");

    $calendar.find("tfoot").append("<tr><th colspan='3'></th><th class='close'></th></tr>");

    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td></tr>");

    $calendar.find("table caption .date").text(objStartDate.getFullYear()).attr("date", objStartDate.getTime());

    while (objStartDate <= objEndDate)
    {
      $calendar.find("tbody tr").eq(intRows).find("td").eq(intCols).text(objStartDate.getMonth() + 1).attr("date", objStartDate.getTime());
      objStartDate.setMonth(objStartDate.getMonth() + 1);
      intCols++;

      if (intCols > 3)
      {
        intCols = 0;
        intRows++;
      }
    }

    if (typeof objOptions.createMonthCalendar == "function") objOptions.createMonthCalendar(objEndDate, $calendar.find("tbody"));
  });
/******************************************************************************/
/* $base.createDayCalendar.nictRaspberryPiCalendar                            */
/******************************************************************************/
  $base.on("createDayCalendar.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    var objDate      = pExtra ? pExtra : new Date();
    var objStartDate = new Date(objDate.getFullYear(), objDate.getMonth()    , 1);
    var objEndDate   = new Date(objDate.getFullYear(), objDate.getMonth() + 1, 0);
    var intCols      = objStartDate.getDay();
    var intRows      = 0;

    $calendar.find("table > *").remove();

    $calendar.find("table").attr  ("type", "day");
    $calendar.find("table").append("<caption><span class='prev'></span><span class='date'><span class='year'></span><span class='month'></span></span><span class='next'></span></caption>");
    $calendar.find("table").append("<thead></thead>");
    $calendar.find("table").append("<tfoot></tfoot>");
    $calendar.find("table").append("<tbody></tbody>");

    $calendar.find("thead").append("<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>");
    $calendar.find("tfoot").append("<tr><th colspan='5'></th><th colspan='2' class='close'></th></tr>");

    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
    $calendar.find("tbody").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");

    $calendar.find("table caption .date" ).attr("date", objStartDate.getTime    ()    );
    $calendar.find("table caption .year" ).text(        objStartDate.getFullYear()    );
    $calendar.find("table caption .month").text(        objStartDate.getMonth   () + 1);

    while (objStartDate <= objEndDate)
    {
      $calendar.find("tbody tr").eq(intRows).find("td").eq(intCols).text(objStartDate.getDate()).attr("date", objStartDate.getTime());
      objStartDate.setDate(objStartDate.getDate() + 1);
      intCols++;

      if (intCols > 6)
      {
        intCols = 0;
        intRows++;
      }
    }

    if (typeof objOptions.createDayCalendar == "function") objOptions.createDayCalendar(objEndDate, $calendar.find("tbody"));
  });
/******************************************************************************/
/* $base.click.nictRaspberryPiCalendar                                        */
/******************************************************************************/
  $base.on("click.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    if ($calendar.hasClass("open")) $base.trigger("close.nictRaspberryPiCalendar", pExtra);
    else                            $base.trigger( "open.nictRaspberryPiCalendar", pExtra);
  });
/******************************************************************************/
/* $calendar.click.nictRaspberryPiCalendar                                    */
/******************************************************************************/
/*-----* close *--------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", function(pEvent, pExtra)
  {
    $base.trigger("close.nictRaspberryPiCalendar", pExtra);
  });

  $calendar.on("click.nictRaspberryPiCalendar", ".close", function(pEvent, pExtra)
  {
    $base.trigger("close.nictRaspberryPiCalendar", pExtra);
  });
/*-----* prev *---------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", ".prev", function(pEvent, pExtra)
  {
    var objDate = new Date(parseInt($calendar.find("caption .date").attr("date"), 10));

    if ($calendar.find("table").attr("type") == "year")
    {
      objDate.setFullYear(objDate.getFullYear() - 1);
      $base.trigger("createYearCalendar.nictRaspberryPiCalendar", objDate);
    }
    else if ($calendar.find("table").attr("type") == "month")
    {
      objDate.setFullYear(objDate.getFullYear() - 1);
      $base.trigger("createMonthCalendar.nictRaspberryPiCalendar", objDate);
    }
    else if ($calendar.find("table").attr("type") == "day")
    {
      objDate.setMonth(objDate.getMonth() - 1);
      $base.trigger("createDayCalendar.nictRaspberryPiCalendar", objDate);
    }

    return false;
  });
/*-----* next *---------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", ".next", function(pEvent, pExtra)
  {
    var objDate = new Date(parseInt($calendar.find("caption .date").attr("date"), 10));

    if ($calendar.find("table").attr("type") == "year")
    {
      objDate.setFullYear(objDate.getFullYear() + 19);
      $base.trigger("createYearCalendar.nictRaspberryPiCalendar", objDate);
    }
    else if ($calendar.find("table").attr("type") == "month")
    {
      objDate.setFullYear(objDate.getFullYear() + 1);
      $base.trigger("createMonthCalendar.nictRaspberryPiCalendar", objDate);
    }
    else if ($calendar.find("table").attr("type") == "day")
    {
      objDate.setMonth(objDate.getMonth() + 1);
      $base.trigger("createDayCalendar.nictRaspberryPiCalendar", objDate);
    }

    return false;
  });
/*-----* date *---------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", ".date", function(pEvent, pExtra)
  {
    var objDate = new Date(parseInt($(this).attr("date"), 10));

         if ($calendar.find("table").attr("type") == "month") $base.trigger( "createYearCalendar.nictRaspberryPiCalendar", objDate);
    else if ($calendar.find("table").attr("type") == "day"  ) $base.trigger("createMonthCalendar.nictRaspberryPiCalendar", objDate);

    return false;
  });
/*-----* th *-----------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", "th", function(pEvent, pExtra)
  {
    return false;
  });
/*-----* td *-----------------------------------------------------------------*/
  $calendar.on("click.nictRaspberryPiCalendar", "td", function(pEvent, pExtra)
  {
    if ($(this).attr("date") && !$(this).hasClass("disabled"))
    {
      var objDate = new Date(parseInt($(this).attr("date"), 10));

      if ($calendar.find("table").attr("type") == "year")
      {
        $base.trigger("createMonthCalendar.nictRaspberryPiCalendar", objDate);
        if (typeof objOptions.selectYear == "function") objOptions.selectYear(objDate);
      }
      else if ($calendar.find("table").attr("type") == "month")
      {
        $base.trigger("createDayCalendar.nictRaspberryPiCalendar", objDate);
        if (typeof objOptions.selectMonth == "function") objOptions.selectMonth(objDate);
      }
      else if ($calendar.find("table").attr("type") == "day")
      {
        if (typeof objOptions.selectDay == "function") objOptions.selectDay(objDate);
      }
    }

    return false;
  });
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

  return this;
};})(jQuery);
