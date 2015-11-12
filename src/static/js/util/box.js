var $$ = function(id) {
	return document.getElementById(id);
}

var addEvent = function(o, e, f) {
	o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on' + e, function() {
		f.call(o)
	});
}

var Box = function() {}
Box.prototype = {
	box: null,
	mask: null,
	BoxWidth: 300,
	BoxHeight: 200,
	Title: "Title",
	Content: "Content here",
	IsBar: 1,
	IsShut: 1,
	init: function(config) {
		if (config) {
			this.BoxWidth = config.width || this.BoxWidth;
			this.BoxHeight = config.height || this.BoxHeight;
			this.Title = config.title || this.Title;
			this.Content = config.content || this.Content;
			this.IsBar = (config.isBar !== undefined) ? config.isBar : this.IsBar;
			this.IsShut = (config.isShut !== undefined) ? config.isShut : this.IsShut;
		}

	},
	open: function(config) {
		this.init(config);
		this.createBox();
		this.createMask();
	},
	close: function() {
		this.removeBox();
		this.removeMask();
	},
	createBox: function() {
		this.box = this.box || document.createElement("div");
		this.setBoxStyle();
		document.body.appendChild(this.box);

		//this.normalIn();
		this.zoomIn();

		if (this.IsBar) {
			this.setDragListener();

			if (this.IsShut) {
				var shut = $$("box_shut"),
					_this = this;
				addEvent(shut, 'click', function(e) {
					_this.fillTitle("");
					_this.zoomOut();
				});
			}
		}else{
			var _this = this;
			addEvent(this.box, 'click', function(e) {
				_this.zoomOut();
			});
		}
	},
	setBoxStyle: function() {
		this.box.id = "box";
		this.box.style.background = "#222";
		this.box.style.position = "absolute";
		this.box.style.border = "4px solid #000";
		this.box.style.width = this.BoxWidth + 'px';
		this.box.style.height = this.BoxHeight + 'px';
		this.box.style.left = this.getLeft(this.BoxWidth) + 'px';
		this.box.style.top = this.getTop(this.BoxHeight) + 'px';
		this.box.style.display = "none";
		this.box.style.textAlign = "left";
		this.box.style.boxShadow = "#000 3px 3px 4px";
		this.box.style.zIndex = 1001;

		var innerString = '';
		if (this.IsBar) {
			innerString += '<div id="bar" style="line-height: 28px;padding-left:1em;background:#000;cursor:move;">' + this.Title;
			if (this.IsShut) {
				innerString += '<a id="box_shut" style="color:#fff;position:absolute;cursor:pointer;font-weight:bold;top:0px;right:10px;text-decoration: none;">×</a>';
			}
			innerString += '</div>';
		}
		innerString += '<div id="content" style="padding: 1em 1em;"></div>';
		this.box.innerHTML = innerString;
	},
	createMask: function() {
		this.mask = this.mask || document.createElement("div");
		this.setMaskStyle();
		document.body.appendChild(this.mask);
	},
	setMaskStyle: function() {
		this.mask.id = "mask";
		this.mask.style.background = "#000";
		this.mask.style.position = "fixed";
		this.mask.style.width = "100%";
		this.mask.style.height = "100%";
		this.mask.style.left = "0";
		this.mask.style.top = "0";
		this.mask.style.display = "block";
		this.mask.style.opacity = "0.5";
		this.mask.style.zIndex = 1000;
	},
	removeBox: function() {
		document.body.removeChild(this.box);
	},
	removeMask: function() {
		document.body.removeChild(this.mask);
	},
	normalIn: function() {
		this.box.style.display = "block";
		this.fillContent(this.Content);
	},
	zoomIn: function() {
		var coe = 1,
			tmpWidth, tmpHeight;
		var zoomInTimer = setInterval(function() {
			tmpWidth = this.BoxWidth * coe / 10,
			tmpHeight = this.BoxHeight * coe / 10;
			if (coe === 10) {
				clearInterval(zoomInTimer);
				this.fillContent(this.Content);
				return;
			} else {
				this.box.style.display = "block";
				this.box.style.width = tmpWidth + 'px';
				this.box.style.height = tmpHeight + 'px';
				this.box.style.left = this.getLeft(tmpWidth) + 'px';
				this.box.style.top = this.getTop(tmpHeight) + 'px';
				coe++;
			}
		}.bind(this), 10);
	},
	zoomOut: function() {
		var coe = 10,
			tmpWidth, tmpHeight;
		this.fillContent("");
		this.removeMask();

		var desX = this.getLeft(this.BoxWidth)-parseInt(this.box.style.left),
			desY = this.getTop(this.BoxHeight)-parseInt(this.box.style.top);

		var zoomOutTimer = setInterval(function() {
			tmpWidth = this.BoxWidth * coe / 10,
			tmpHeight = this.BoxHeight * coe / 10;
			if (coe === 1) {
				clearInterval(zoomOutTimer);
				this.removeBox();
				return;
			} else {
				this.box.style.width = tmpWidth + 'px';
				this.box.style.height = tmpHeight + 'px';
				this.box.style.left = this.getLeft(tmpWidth) - desX + 'px';
				this.box.style.top = this.getTop(tmpHeight) - desY + 'px';
				coe--;
			}
		}.bind(this), 10);
	},
	setDragListener: function() {
		var bar = $$("bar"),
			_this = this;

		var params = {
			startX: 0,
			startY: 0,
			_X: 0,
			_Y: 0,
			isDrag: false
		};
		addEvent(bar, 'mousedown', function(e) {
			var e = e || window.event;
			params.isDrag = true;
			params._X = e.clientX;
			params._Y = e.clientY;
			params.startX = _this.box.style.left;
			params.startY = _this.box.style.top;
		});

		addEvent(document, 'mouseup', function(e) {
			params.isDrag = false;
		});

		addEvent(document, 'mousemove', function(e) {
			var e = e || window.event;

			if (params.isDrag) {
				var currX = e.clientX,
					currY = e.clientY,
					desX = currX - params._X + parseInt(params.startX),
					desY = currY - params._Y + parseInt(params.startY);

				_this.box.style.left = desX + 'px';
				_this.box.style.top = desY + 'px';
			}
		});
	},
	fillContent: function(content) {
		$$("content").innerHTML = content;
	},
	fillTitle: function(title) {
		$$("bar").innerHTML = title;
	},
	getLeft: function(width) {
		return (document.body.offsetWidth - width) / 2;
	},
	getTop: function(height) {
		return (document.body.offsetHeight - height) / 2 + document.body.scrollTop ;
	}
}