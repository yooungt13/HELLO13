/** back to the top**/
(function() {
  var $backToTopTxt = "Return to the top",
    $backToTopEle = $('<div class="backToTop"></div>').appendTo($("body"))
      .text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
        $("html, body").animate({
          scrollTop: 0
        }, 120);
      }),
    $backToTopFun = function() {
      var st = $(document).scrollTop(),
        winh = $(window).height();
      (st > 0) ? $backToTopEle.show() : $backToTopEle.hide();
      //In IE6
      if (!window.XMLHttpRequest) {
        $backToTopEle.css("top", st + winh - 166);
      }
    };
  $(window).bind("scroll", $backToTopFun);
  $(function() {
    $backToTopFun();
  });
})();

/** list open/toggle **/
(function() {
  var $maki = $('.maki');

  // Create Makisus
  $maki.makisu({
    selector: 'dd',
    overlap: 0.6,
    speed: 0.85
  });
  var ispost = false,
    isproj = false;
  $('#posts > dt').hover(function() {
    if (!ispost) {
      $('#posts').makisu('open');
      ispost = true;
    }
  });
  $('#posts').hover(function() {}, function() {
    if (ispost) {
      $('#posts').makisu('toggle');
      ispost = false;
    }
  });
  $('#projects > dt').hover(function() {
    if (!isproj) {
      $('#projects').makisu('open');
      isproj = true;
    }
  });
  $('#projects').hover(function() {}, function() {
    if (isproj) {
      $('#projects').makisu('toggle');
      isproj = false;
    }
  });
})();

/** Baidu 统计 **/
(function() {
  // 百度统计
  var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
  document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F78bbe26f8e0ea4154a3ab176ed98aa8f' type='text/javascript'%3E%3C/script%3E"));
})();

/** Duoshuo comments **/
(function() {
  var duoshuoQuery = {
    short_name: "hello13"
  };
  (function() {
    var ds = document.createElement('script');
    ds.type = 'text/javascript';
    ds.async = true;
    ds.src = 'http://static.duoshuo.com/embed.js';
    ds.charset = 'UTF-8';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
  })();
})();