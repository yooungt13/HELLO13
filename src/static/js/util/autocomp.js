var $$ = function(id) {
	return document.getElementById(id);
}

var addEvent = function(o, e, f) {
	o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on' + e, function() {
		f.call(o)
	});
}

var Input = function() {};
Input.prototype = {
	input: null,
	wrap: null,
	list: null,
	active: null,
	options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
		'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
		'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
		'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
		'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
		'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
		'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
		'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
		'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
	],

	inputX: 0,
	inputY: 0,
	inputWidth: 300,
	inputHeight: 30,

	init: function(config) {
		if (config) {
			this.input = $$(config.inputId);
			this.wrap = $$(config.wrapId);
			this.options = config.data || this.options;
			this.inputWidth = config.width || this.inputWidth;
			this.inputHeight = config.height || this.inputHeight;
			this.visible = false;
		}

		this.clearScreen();
		this.setStyle();
		this.autoComplete();
	},
	setStyle: function() {
		this.input.style.width = this.inputWidth + 'px';
		this.input.style.height = this.inputHeight + 'px';
		this.input.style.padding = '8px 12px';
		this.input.style.fontSize = '24px';
		this.input.style.lineHeight = '30px';
		this.input.style.border = '2px solid #ccc';
		this.input.style.borderRadius = '5px';
		this.input.style.outline = 'none';
	},
	autoComplete: function() {
		var that = this;

		addEvent(this.input, 'input', function() {
			that.clearScreen();

			if (this.value) { // 若input值不为空，则进行匹配
				var pattern = new RegExp("^" + this.value + "", "i");
				var str = [];

				for (var i = 0, len = that.options.length; i < len; i++) {
					if (pattern.test(that.options[i]))
						str.push(that.options[i]);
				}

				if (str.length > 0) {
					var ul = document.createElement('div');
					ul.id = 'list';
					ul.style.position = 'absolute';
					ul.style.width = that.inputWidth + 25 + 'px';
					ul.style.listStyleType = 'none';
					ul.style.border = '1px solid #ccc';
					//ul.style.boxShadow = '2px 2px 5px #000';
					ul.style.lineHeight = '30px';
					ul.style.color = '#aaa';
					ul.style.top = this.offsetTop + that.inputHeight + 22 + 'px';
					ul.style.left = this.offsetLeft + 'px';
					ul.style.textAlign = 'left';
					ul.style.textIndent = '8px';
					ul.style.backgroundColor = '#fff';
					ul.style.cursor = 'default';

					var _this = this;
					for (var i = 0, len = str.length; i < len; i++) {
						var li = document.createElement('div');

						li.innerHTML = str[i];
						(function() {
							var p = i;
							addEvent(li, 'mousedown', function() {
								_this.value = str[p];
								wrap.removeChild($$('list'));
							});

							addEvent(li, 'mouseover', function() {
								this.style.backgroundColor = '#eee';
							});

							addEvent(li, 'mouseout', function() {
								this.style.backgroundColor = '#fff';
							});
						})();

						ul.appendChild(li);
						that.list = ul;
					}
					wrap.appendChild(ul);
					that.visible = true;
				}
			}
		});

		addEvent(this.input, 'focus', function() {
			this.style.borderColor = '#000';
		});

		addEvent(this.input, 'blur', function() {
			this.style.borderColor = '#ccc';
		});

		addEvent(this.input, 'keydown', function(e) {
			if (that.visible) {
				switch (e.keyCode) {
					case 13: // Enter
						if (that.active) {
							this.value = that.active.firstChild.data;
							that.clearScreen();
						}
						return;
					case 38: // 向上
						if (!that.active) {
							that.active = that.list.lastChild;
							this.value = that.active.lastChild.data;
							that.active.style.backgroundColor = '#ccc';
						} else {
							that.active.style.backgroundColor = '#fff';
							if ( !! that.active.previousSibling) {
								that.active = that.active.previousSibling;
								this.value = that.active.firstChild.data;
								that.active.style.backgroundColor = '#ccc';
							} else {
								that.active = that.list.lastChild;
								this.value = that.active.firstChild.data;
								that.active.style.backgroundColor = '#ccc';
							}
						}
						return;
					case 40: // 向下
						if (!that.active) {
							that.active = that.list.firstChild;
							this.value = that.active.firstChild.data;
							that.active.style.backgroundColor = '#ccc';
						} else {
							that.active.style.backgroundColor = '#fff';
							if ( !! that.active.nextSibling) {
								that.active = that.active.nextSibling;
								this.value = that.active.firstChild.data;
								that.active.style.backgroundColor = '#ccc';
							} else {
								that.active = that.list.firstChild;
								this.value = that.active.firstChild.data;
								that.active.style.backgroundColor = '#ccc';
							}
						}
						return;
				}
			}
		});

		addEvent(window, 'mousedown', function() {
			that.clearScreen();
		});
	},
	clearScreen: function() {
		var list = $$('list');
		// 清除之前的选项框
		if ( !! list) {
			wrap.removeChild(list);
			this.visible = false;
			this.active = null;
		}
	}
};

window.onload = new Input().init({
	inputId: 'search',
	wrapId: 'wrap'
});