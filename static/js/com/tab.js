define(["lib/zepto.js", 'util/mjs.js', 'util/url.js'], function($, mjs, Url) {
	// 显示loading
	function showLoading() {
		$('.loading-spin').css('top', $(window).scrollTop() + 40);
		$('.loading').removeClass('hide');
	}

	// 隐藏loading
	function hideLoading() {
		$('.loading').addClass('hide');
	}
	return function (dom) {
		var $dom = $(dom);
		if ($dom.is('.taba')) {
			var $slide = $('<div class="slide"></div>');
			resize();
			$slide.appendTo($dom);
			$dom.addClass('noslide');
		}
		var $tabs = $dom.find('li[tab-target]');
		var $bodys = [];
		for (var i = 0; i < $tabs.length; i++) {
			$bodys.push($("#" + $($tabs[i]).attr("tab-target"))[0]);
		}
		$bodys = $($bodys);
		$tabs.click(function () {
			$tabs.removeClass('active');
			$(this).addClass('active');

			$bodys.hide();
			$("#" + $(this).attr("tab-target")).show();
			if ($slide) {
				$slide.css("left", $(this).position().left);
			}

			$(this).trigger('refreshview');
			var _this = this;
			var href = $(this).data('href');
			var status = $(this).data('status');
			if (status) {
				status = Url.parseQueryString(status);
			}
			if (href) {
				showLoading()
				mjs.getData({
					url: href,
					dataType: "html",
					s: function (data) {
						hideLoading();
						$("#" + $(_this).attr("tab-target")).html(data);
						if (status) {
							try {
								var url = location.href;
								for(var key in status) {
									url = Url.addQueryStingArg(url, key, status[key]);
								}
								history.replaceState({}, '', url);
							} catch (e) {}
						}
					},
					e: function (message) {
						hideLoading();
						alert(message);
					}
				})
			}
		});
		function resize () {
			if($slide){
				var $current = $dom.find(".active");
				var left = $current.position().left;
				var w = $current.width();
				$slide.css("left", left).width(w);
			}
		}
		$(window).on("resize", resize);
	}
});
