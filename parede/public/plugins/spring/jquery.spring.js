$(function(){
	var winHeight = $(window).height(),
		picno = 0;

	$(function() {
		loadImg();
		loadImg();
		loadImg();

		$(window).scroll(function() {
			var docTop = $(document).scrollTop(),
				contentHeight = $('#albums').height();
				//contentTop = $('#albums').top();
			if (docTop + contentHeight + 500 >= winHeight) {
				loadImg();
			}
		});
	});

	function loadImg() {
		for (var i = 1; i <= 5; i++) {
			if (picno < 43) {
				$('#col' + i).append('<div class="wrap fancybox" data-fancybox-group="gallery" href="./data/origin/' + picno + '.jpg" title="ice,mountain,girl"><img src="./data/thumb/' + picno + '.jpg" class="thumb" alt=""><div class="pic_info"><p class="fb14">Ice,Mountain,Girl</p><p class="fg9">Getting closer.Here is the comming soon / sign up page in the works.Created by driiible.</p>	<p class="bottom_info fg9">21 Mar 2014 - Sysu, Guangzhou</p></div></div>');
				picno++;
			}
		}
	}
});