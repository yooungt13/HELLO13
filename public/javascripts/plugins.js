var $$ = function(id) {
  return document.getElementById(id);
};

var addEvent = function(o, e, f) {
  o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on' + e, function() {
    f.call(o)
  });
};

/** back to the top**/
(function() {
  var btEle = document.createElement('div');
  btEle.className = 'backToTop';
  btEle.innerHTML = 'Return to the top';
  document.body.appendChild(btEle);

  addEvent(btEle, 'click', function() {
    // var step = 1, tmpTop;
    // var scrollTimer = setTimeout(function(){
    //   tmpTop = document.body.scrollTop - step;
    //   if( tmpTop < 0 ){
    //     document.body.scrollTop = 0;
    //     clearTimeout(scrollTimer);
    //     return;
    //   } 

    //   document.body.scrollTop = tmpTop;
    //   step += 1;

    //   setTimeout(arguments.callee,1);
    // },1);
    document.body.scrollTop = 0;
  });

  addEvent(window, 'scroll', function() {
    var st = document.body.scrollTop;
    if (st > 0) {
      btEle.style.display = 'block';
    } else {
      btEle.style.display = 'none';
    }
  });
})();

/** Baidu 统计 **/
(function() {
  // 百度统计
  var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
  document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F78bbe26f8e0ea4154a3ab176ed98aa8f' type='text/javascript'%3E%3C/script%3E"));
})();