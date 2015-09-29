define(['zepto'], function($) {
	return function (dom) {
		var $dom = $(dom);

		var $tabs = $dom.find('li[tab-target]');
		var $bodys = [];

		for (var i = 0; i < $tabs.length; i++) {
			$bodys.push($("#" + $($tabs[i]).attr("tab-target"))[0]);
		}

		$bodys = $($bodys);

		$tabs.on('click', function () {
			$tabs.removeClass('party-active');
			$(this).addClass('party-active');

			$bodys.hide();
			$("#" + $(this).attr("tab-target")).show();
		});
	}
});
