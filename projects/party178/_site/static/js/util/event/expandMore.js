/*
 * 显示更多数据
 */
define(['zepto.js'], function($, Page, Pageable, gesture) {
	return function(dom) {
		$(dom).click(function(){
			var $list = $(this).closest("dl.list").find('.hide');
			$list.each(function(index, item) {
				$(item).after($(item).html().replace(/\n|    |<!--|-->/g, "")).remove();
			});
			$(this).closest('.db').remove();
		});
	}
});