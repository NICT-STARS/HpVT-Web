;(function($){ var objMethods = {
/******************************************************************************/
/* NICT ImageViewer for JQuery Plugin                                         */
/* Copyright 2022 National Institute of Information and Communication Technology (NICT)                                                    */
/******************************************************************************/
/******************************************************************************/
/* initialize                                                                 */
/******************************************************************************/
  initialize : function(pOptions)
  {
/*-----* variable *-----------------------------------------------------------*/
    var flgTouch      = "ontouchstart"      in window;
    var flgEvent      = flgTouch && "event" in window;
    var strMouseWheel = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
    var $this         = this;

    $this.addClass("nict-image-viewer");
    $this.css     ({ position : "absolute", top : "0px", left : "0px", width : "100%", cursor : "pointer" });
    $this.on      ("contextmenu.nictImageViewer", function(){ return false; });
/*-----* options *------------------------------------------------------------*/
    $this.data("options.nictImageViewer", $.extend(true,
    {
      rate       : 0.1,
      maxWidth   : $this.width () * 10,
      maxHeight  : $this.height() * 10,
      minWidth   : $this.width () /  2,
      minHeight  : $this.height() /  2
    }, pOptions));
/******************************************************************************/
/* this.wheel                                                                 */
/******************************************************************************/
    $this.on(strMouseWheel + ".nictImageViewer", function(pEvent)
    {
      if (flgEvent                          ) { if(event.cancelable) event.preventDefault(); } else { if(pEvent.cancelable) pEvent.preventDefault(); }
      if ($this.data("lock.nictImageViewer")) return;                                          else $this.data("lock.nictImageViewer", true);

      var intX      = pEvent.pageX;
      var intY      = pEvent.pageY;
      var intDelta  = pEvent.originalEvent.deltaY ? -(pEvent.originalEvent.deltaY) : pEvent.originalEvent.wheelDelta ? pEvent.originalEvent.wheelDelta : -(pEvent.originalEvent.detail);
      var intWidth  = $this.width ();
      var intHeight = $this.height();

      if (intDelta < 0) { intWidth = intWidth / (1 + $this.data("options.nictImageViewer").rate); intHeight = intHeight / (1 + $this.data("options.nictImageViewer").rate); }
      else              { intWidth = intWidth * (1 + $this.data("options.nictImageViewer").rate); intHeight = intHeight * (1 + $this.data("options.nictImageViewer").rate); }

      _zoom({ x : intX, y : intY, width : intWidth, height : intHeight });

      $this.data("lock.nictImageViewer", false);
    });
/******************************************************************************/
/* this.drag                                                                  */
/******************************************************************************/
/*-----* start *--------------------------------------------------------------*/
    $.each(["touchstart", "mousedown"], function()
    {
      var flgTouch = this == "touchstart" ? true : false;

      $this.on((flgTouch ? "touchstart" : "mousedown") + ".nictImageViewer", function(pEvent)
      {
        try
        {
          if (flgEvent) { if(event.cancelable) event.preventDefault(); } else { if(pEvent.cancelable) pEvent.preventDefault(); }
          if ($this.data("lock.nictImageViewer")) return;

          var flgSingle     = flgEvent ? (event.touches.length == 1 ? true : false) : flgTouch ? (pEvent.originalEvent.touches.length == 1 ? true : false) : true;
          var flgDouble     = flgEvent ? (event.touches.length == 2 ? true : false) : flgTouch ? (pEvent.originalEvent.touches.length == 2 ? true : false) : false;
          var objBase1      = { x:0, y:0 };
          var objBase2      = { x:0, y:0 };
          var objMove1      = { x:0, y:0 };
          var objMove2      = { x:0, y:0 };
          var intBaseDis    = 0;
          var intMoveDis    = 0;
          var intWidth      = $this.width ();
          var intHeight     = $this.height();
          var intBaseWidth;
          var intBaseHeight;
          var intX;
          var intY;

          if (flgSingle)
          {
            objBase1.x = flgEvent ? event.changedTouches[0].pageX : flgTouch ? pEvent.originalEvent.touches.item(0).pageX : pEvent.pageX;
            objBase1.y = flgEvent ? event.changedTouches[0].pageY : flgTouch ? pEvent.originalEvent.touches.item(0).pageY : pEvent.pageY;

            if ($this.data("dblTap.nictImageViewer"))
            {
              $(document).off ((flgTouch ? "touchend" : "mouseup") + ".nictImageViewer");
              $this      .data("lock.nictImageViewer", true);

              var intCounter = 0;

              setTimeout(function _loop()
              {
                if ((flgTouch ? 1 : (pEvent.which == 3 ? -1 : 1)) == -1) { intWidth = intWidth / (1 + $this.data("options.nictImageViewer").rate); intHeight = intHeight / (1 + $this.data("options.nictImageViewer").rate); }
                else                                                     { intWidth = intWidth * (1 + $this.data("options.nictImageViewer").rate); intHeight = intHeight * (1 + $this.data("options.nictImageViewer").rate); }

                _zoom({ x : objBase1.x, y : objBase1.y, width : intWidth, height : intHeight });
                intCounter++;

                if (intCounter < 10) setTimeout(_loop, 50); else $this.data("lock.nictImageViewer", false);
              }, 1);

              $this.data("dblTap.nictImageViewer", false);
              return;
            }
            else
            {
              $this.data("dblTap.nictImageViewer", true);
              if (typeof $this.data("options.nictImageViewer").moveBefore == "function") setTimeout(function() { $this.data("options.nictImageViewer").moveBefore($this); }, 1);
            }

            setTimeout(function(){ $this.data("dblTap.nictImageViewer", false); }, 300);
          }
          else if (flgDouble)
          {
            objBase1      = (flgEvent ? { x : event.touches[0].pageX, y : event.touches[0].pageY } : flgTouch ? { x : pEvent.originalEvent.touches.item(0).pageX, y : pEvent.originalEvent.touches.item(0).pageY } : { x : pEvent.touches[0].pageX, y : pEvent.touches[0].pageY });
            objBase2      = (flgEvent ? { x : event.touches[1].pageX, y : event.touches[1].pageY } : flgTouch ? { x : pEvent.originalEvent.touches.item(1).pageX, y : pEvent.originalEvent.touches.item(1).pageY } : { x : pEvent.touches[1].pageX, y : pEvent.touches[1].pageY });
            intBaseDis    = Math.sqrt(Math.pow(objBase1.x - objBase2.x, 2) + Math.pow(objBase1.y - objBase2.y, 2));
            intBaseWidth  = intWidth;
            intBaseHeight = intHeight;
          }
          else
            return;
/*-----* move *---------------------------------------------------------------*/
          var fncMove = function(pEvent)
          {
            try
            {
              if (flgEvent) { if(event.cancelable) event.preventDefault(); } else { if(pEvent.cancelable) pEvent.preventDefault(); }

              flgSingle = flgEvent ? (event.touches.length == 1 ? true : false) : flgTouch ? (pEvent.originalEvent.touches.length == 1 ? true : false) : true;
              flgDouble = flgEvent ? (event.touches.length == 2 ? true : false) : flgTouch ? (pEvent.originalEvent.touches.length == 2 ? true : false) : false;

              if (flgSingle)
              {
                objMove1.x = (flgEvent ? event.changedTouches[0].pageX : flgTouch ? pEvent.originalEvent.touches.item(0).pageX : pEvent.pageX) - objBase1.x;
                objMove1.y = (flgEvent ? event.changedTouches[0].pageY : flgTouch ? pEvent.originalEvent.touches.item(0).pageY : pEvent.pageY) - objBase1.y;
                objBase1.x = (flgEvent ? event.changedTouches[0].pageX : flgTouch ? pEvent.originalEvent.touches.item(0).pageX : pEvent.pageX);
                objBase1.y = (flgEvent ? event.changedTouches[0].pageY : flgTouch ? pEvent.originalEvent.touches.item(0).pageY : pEvent.pageY);
                _move({ left : objMove1.x, top : objMove1.y });
              }
              else if (flgDouble)
              {
                objMove1   = flgEvent ? { x : event.touches[0].pageX, y : event.touches[0].pageY } : flgTouch ? { x : pEvent.originalEvent.touches.item(0).pageX, y : pEvent.originalEvent.touches.item(0).pageY } : { x : pEvent.touches[0].pageX, y : pEvent.touches[0].pageY };
                objMove2   = flgEvent ? { x : event.touches[1].pageX, y : event.touches[1].pageY } : flgTouch ? { x : pEvent.originalEvent.touches.item(1).pageX, y : pEvent.originalEvent.touches.item(1).pageY } : { x : pEvent.touches[1].pageX, y : pEvent.touches[1].pageY };
                intMoveDis = Math.sqrt (Math.pow(objMove1.x - objMove2.x, 2) + Math.pow(objMove1.y - objMove2.y, 2));
                intWidth   = Math.floor(intBaseWidth  * (intMoveDis / intBaseDis));
                intHeight  = Math.floor(intBaseHeight * (intMoveDis / intBaseDis));
                intX       = Math.floor((objMove1.x + objMove2.x) / 2);
                intY       = Math.floor((objMove1.y + objMove2.y) / 2);

                if (!$this.data("lock.nictImageViewer"))
                {
                  $this.data("lock.nictImageViewer", true);
                  _zoom({ x : intX, y : intY, width : intWidth, height : intHeight });
                  $this.data("lock.nictImageViewer", false);
                }
              }
            }
            catch(pError)
            {
              console.error("jQuery.nictImageViewer mousemove error: " + pError);
            }
          };

          document.addEventListener(flgTouch ? "touchmove" : "mousemove", fncMove, { passive: false });
/*-----* end *----------------------------------------------------------------*/
          $(document).one((flgTouch ? "touchend" : "mouseup") + ".nictImageViewer", function(pEvent)
          {
            try
            {
              if (flgEvent) { if(event.cancelable) event.preventDefault(); } else { if(pEvent.cancelable) pEvent.preventDefault(); }

                document .removeEventListener( flgTouch ? "touchmove" : "mousemove", fncMove, { passive: false });
              $(document).off                ((flgTouch ? "touchend"  : "mouseup"  ) + ".nictImageViewer");

              if (flgSingle)
              {
                if (typeof $this.data("options.nictImageViewer").moveAfter == "function") setTimeout(function() { $this.data("options.nictImageViewer").moveAfter($this); }, 1);
              }
              else if (flgDouble)
              {
                _zoom({ x : intX, y : intY, width : intWidth, height : intHeight });
              }
            }
            catch(pError)
            {
              console.error("jQuery.nictImageViewer mouseup error: " + pError);
            }
          });
        }
        catch(pError)
        {
          console.error("jQuery.nictImageViewer mousedown error: " + pError);
        }
      });
    });
  },
/******************************************************************************/
/* destroy                                                                    */
/******************************************************************************/
  destroy : function()
  {
    var $this         = $(".nict-image-viewer");
    var strMouseWheel = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";

    $this.off        (     "contextmenu.nictImageViewer");
    $this.off        (strMouseWheel + ".nictImageViewer");
    $this.off        (      "touchstart.nictImageViewer mousedown.nictImageViewer");
    $this.css        ({ position : "", left : "", top : "", width : "", height : "", cursor : "" });
    $this.removeClass("nict-image-viewer");
  }
};
/******************************************************************************/
/* _move                                                                      */
/******************************************************************************/
function _move(pPosition)
{
  var $this       = $(".nict-image-viewer");
  var objPosition = $.extend(true, { left : 0, top : 0 }, pPosition);

  $this.css({ left:"+=" + objPosition.left, top:"+=" + objPosition.top });

  if (typeof $this.data("options.nictImageViewer").move == "function") setTimeout(function() { $this.data("options.nictImageViewer").move($this); }, 1);
}
/******************************************************************************/
/* _zoom                                                                      */
/******************************************************************************/
function _zoom(pPosition)
{
  var $this       = $(".nict-image-viewer");
  var objPosition = $.extend(true, { x : null, y : null, width : null, height : null }, pPosition);
  var intLeft     = $this.offset().left;
  var intTop      = $this.offset().top;
  var intWidth    = $this.width ();
  var intHeight   = $this.height();

  if (typeof $this.data("options.nictImageViewer").zoomBefore == "function") setTimeout(function() { $this.data("options.nictImageViewer").zoomBefore($this); }, 1);

  if (objPosition.x == null                          ) objPosition.x      = intLeft + intWidth  / 2;
  if (objPosition.y == null                          ) objPosition.y      = intTop  + intHeight / 2;
  if ($this.data("options.nictImageViewer").maxWidth ) objPosition.width  = objPosition.width  <= $this.data("options.nictImageViewer").maxWidth  ? objPosition.width  : $this.data("options.nictImageViewer").maxWidth;
  if ($this.data("options.nictImageViewer").maxHeight) objPosition.height = objPosition.height <= $this.data("options.nictImageViewer").maxHeight ? objPosition.height : $this.data("options.nictImageViewer").maxHeight;
  if ($this.data("options.nictImageViewer").minWidth ) objPosition.width  = objPosition.width  >= $this.data("options.nictImageViewer").minWidth  ? objPosition.width  : $this.data("options.nictImageViewer").minWidth;
  if ($this.data("options.nictImageViewer").minHeight) objPosition.height = objPosition.height >= $this.data("options.nictImageViewer").minHeight ? objPosition.height : $this.data("options.nictImageViewer").minHeight;

  var intDiffX = (objPosition.x - intLeft) * (objPosition.width  / intWidth  - 1);
  var intDiffY = (objPosition.y - intTop ) * (objPosition.height / intHeight - 1);

  if (objPosition.width != intWidth || objPosition.height != intHeight)
  {
    $this.css({ left : "-=" + intDiffX, top : "-=" + intDiffY, width : objPosition.width + "px", height : objPosition.height+ "px" });
    if (typeof $this.data("options.nictImageViewer").zoom == "function") setTimeout(function() { $this.data("options.nictImageViewer").zoom($this); }, 1);
  }

  if (typeof $this.data("options.nictImageViewer").zoomAfter == "function") setTimeout(function() { $this.data("options.nictImageViewer").zoomAfter($this); }, 1);
}
/******************************************************************************/
/* entry point                                                                */
/******************************************************************************/
$.fn.nictImageViewer = function(pMethod)
{
       if (typeof pMethod == "object" || !pMethod) return objMethods["initialize"].apply(this, arguments);
  else if (objMethods[pMethod]                   ) return objMethods[pMethod     ].apply(this, Array.prototype.slice.call(arguments, 1));
  else                                             $.error("Method " +  pMethod + " does not exist on jQuery.nictImageViewer");
};})(jQuery);
