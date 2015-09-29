/*
 *-------------------------------------------------------
 * Tian JavaScript Library v1.0.0
 *
 * 使用原生JavaScript实现的一些常用功能，类似jQuery语法和结构
 * 不断完善中
 *
 * @author: 有田十三 || yooungt@gmail.com
 * @Weibo ：http://weibo.com/yooungt
 * @Github: https://github.com/yooungt13
 * @date  : 2014-04-04
 *
 * Copyright (c) 2014 有田十三
 * -----------------------------------------------------
 */
;
(function() {
	// 缓存初始$使用环境
	var _$ = window.$;

	// 注册到window对象和$
	var Tian = window.Tian = window.$ = function(selector) {
		return new Tian.fn.init(selector);
	};
	// 版本
	Tian.VERSION = '1.0.0';
	// 创建fn的命名空间,该内容为框架基础功能
	// Tian.fn保存Tian.prototype;
	Tian.fn = Tian.prototype = {
		constructor: Tian,
		// 初始化
		init: function(selector) {
			selector = selector || document;
			// 如果selector是DOM对象，则返回该对象
			if (selector.nodeType) {
				// 不可以修改this,用this[0]保存DOM对象
				this[0] = selector;
				return this;
			}
			// 如果selector是string，则当作ID返回DOM对象
			if (typeof selector == "string") {
				this[0] = document.getElementById(selector);
			}
			return this;
		},
		// 页面加载完毕
		ready: function(fn) {
			Tian.Event.readyEvent(fn);
			return this;
		},
		// 读写HTML
		html: function(html) {
			if (typeof html != 'undefined') {
				this[0].innerHTML = html;
				return this;
			} else {
				return this[0].innerHTML;
			}
		},
		// 读写CSS样式
		css: function(prop, value) {
			if (typeof value != 'undefined') {
				Tian.dom.setStyle(this[0], prop, value);
				return this;
			} else {
				if (typeof prop == 'string') {
					return Tian.dom.getStyle(this[0], prop);
				} else if (typeof prop == 'object') {
					Tian.dom.setStyle(this[0], prop);
					return this;
				}
			}
		},
		attr: function(attr, value) {
			if (typeof value == 'undefined') {
				return this[0].getAttribute(attr);
			} else {
				this[0].setAttribute(attr, value);
				return this;
			}
		},
		val: function(value) {
			if (typeof value == 'undefined') {
				return this[0].value;
			} else {
				this[0].value = value;
				return this;
			}
		},
		// 判断样式是否存在
		hasClass: function(selector) {
			return Tian.dom.hasClass(this[0], selector);
		},
		// 添加样式
		addClass: function(selector) {
			Tian.dom.addClass(this[0], selector);
			return this;
		},
		// 移除样式
		removeClass: function(selector) {
			Tian.dom.removeClass(this[0], selector);
			return this;
		},
		// 绑定事件
		bind: function(type, handler) {
			Tian.Event.addEvent(this[0], type, handler);
			return this;
		},
		// 移除事件
		unbind: function(type, handler) {
			Tian.Event.removeEvent(this[0], type, handler);
			return this;
		},
		// 显示元素
		show: function() {
			this.css("display", "block");
			return this;
		},
		// 隐藏元素
		hide: function() {
			this.css("display", "none");
			return this;
		},
		setOpacity: function(number) {
			if (this[0].filters) {
				this[0].style.filter = "alpha(opacity=" + number + ")";
			} else {
				this[0].style.opactiy = number / 100;
			}
			return this;
		},
		// 动画效果
		slide: function(options) {},
	};

	// 内部处理实例创建，定义prototype方法保证多实例共享方法减少资源开支
	Tian.fn.init.prototype = Tian.fn;

	// 扩展Tian.js对象。用来在fn命名空间上增加新函数
	Tian.extend = Tian.fn.extend = function(obj, property) {
		if (!property) {
			property = obj;
			obj = this;
		}
		// obj用以扩展的对象，prop为扩展的函数集。
		// 如果参数只有一个,则扩展新函数到obj对象上
		for (var i in property) {
			obj[i] = property[i];
		}
		return obj;
	};

	// 给fn添加的功能，需要先选择节点，然后才能操作
	// 调用方式： $("id").val();
	Tian.extend(Tian.prototype, {});

	// 添加静态方法
	// 调用方式： $.now();
	Tian.extend({
		// 放弃对$的控制权
		noConflict: function() {
			// 还原$调用环境
			if (window.$ === Tian) {
				window.$ = _$;
			}
			return Tian;
		},
		// 返回本地格式时间：2014年4月5日
		now: function() {
			return new Date().toLocaleString();
		},
		// 获取当前时间：20140405132323
		getTime: function() {
			var now = new Date();
			var year = now.getFullYear(),
				month = now.getMonth() + 1,
				day = now.getDate(),
				hour = now.getHours(),
				minute = now.getMinutes(),
				second = now.getSeconds();
			var clock = year + "";
			if (month < 10) clock += "0";
			clock += month + "";
			if (day < 10) clock += "0";
			clock += (day + hour + minute + second);
			return (clock);
		},
		isType: function(type) {
			return function(obj) {
				return Object.prototype.toString.call(obj) == '[object ' + type + ']';
			};
		},
		isString: function(value) {
			return this.isType('String')(value);
		},
		isNumber: function(value) {
			return this.isType('Number')(value);
		},
		isFunction: function(value) {
			return this.isType('Function')(value);
		},
		isBoolean: function(value) {
			return this.isType('Boolean')(value);
		},
		isArray: function(array) {
			return Array.isArray(array) || this.isType('Array')(array);;
		},
		isNaN: function(obj) {
			return obj !== obj;
		},
		isNull: function(obj) {
			return obj === null;
		},
		isChinese: function(value) {
			return Tian.regExp.isChinese(value);
		},
		setCookie: function(options) {
			Tian.cookie.setCookie(options);
		},
		getCookie: function(cookie) {
			Tian.cookie.getCookie(cookie);
		},
		deleteCookie: function(cookie) {
			Tian.cookie.deleteCookie(cookie);
		},
		createXHR: function() {
			return Tian.ajax.createXHR();
		},
		ajax: function(url, opt) {
			Tian.ajax.send(url, opt);
			return this;
		},
		// 鼠标位置
		getMousePos: function(e) {
			return Tian.Event.getMousePos(e);
		},
		// 屏幕尺寸
		getWindowSize: function() {
			var de = document.documentElement;
			return {
				'width': (
					window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
				'height': (
					window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
			}
		},
		// 解析URL
		parseURL: function(url) {
			var a = document.createElement('a');
			a.href = url;

			return {
				source: url,
				protocol: a.protocol.replace(':', ''),
				host: a.hostname,
				port: a.port,
				query: a.search,
				params: (function() {
					var ret = {}, s,
						seg = a.search.replace(/^\?/, '').split('&');

					for (var i = 0, len = seg.length; i < len; i++) {
						if (!seg[i]) continue;
						s = seg[i].split('=');
						ret[s[0]] = s[1];
					}
					return ret;
				})(),
				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
				hash: a.hash.replace('#', ''),
				path: a.pathname.replace(/^([^\/])/, '/$1'),
				segments: a.pathname.replace(/^\//, '').split('/')
			};
		},
		load: function(url) {
			var script = document.createElement('script');
			script.type = 'text/javascript';

			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == 'completed' || script.readyState == 'loaded')
						callback();
				}
			} else {
				script.onload = function() {
					callback();
				}
			}

			script.src = url;
			document.body.appendChild(script);
		},
		find: function(arr, value) {
			return Tian.algorithm.find.binary(arr, value);
		},
		sort: function(arr) {
			return Tian.algorithm.sort.bubble(arr);
		},
		message: function(config) {
			/* config {
			    width: 600,
			    height: 400,
			    title: 'Hi buddy',
			    content: 'that\'s what I said, hmm?',
			    isBar: 0
			}*/
			var box = Tian.UI.MsgBox();
			if (typeof config == 'string') {
				box.open({
					content: config
				});
			} else {
				box.open(config);
			}
		}
	});

	Tian.Event = {
		readyEvent: function(fn) {
			if (!fn) fn = document;
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
				window.onload = fn;
			} else {
				window.onload = function() {
					oldonload();
					fn();
				}
			}
		},
		addEvent: function(node, type, handler) {
			node.addEventListener ?
				node.addEventListener(type, handler, false) :
				node.attachEvent('on' + type, function() {
					handler.call(node);
				});
		},
		removeEvent: function(node, type, handler) {
			node.removeEventListener ?
				node.removeEventListener(type, handler, false) :
				node.detachEvent('on' + type, function() {
					handler.call(node);
				});
		},
		stopEvent: function(event) {
			this.stopPropagation(event);
			this.preventDefault(event);
		},
		stopPropagation: function(event) {
			event = this.getEvent(event);
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		preventDefault: function(event) {
			event = this.getEvent(event);
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		getEvent: function(event) {
			return event || window.event;
		},
		// 获取事件目标
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		getMousePos: function(event) {
			event = this.getEvent(event);
			var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
				y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
			return {
				'x': x,
				'y': y
			};
		},
		// 鼠标滚轮事件时，滚动的值，让各个浏览器表现一致
		getWheelDelta: function(event) {
			event = this.getEvent(event);
			return event.wheelDelta ?
				event.wheelDelta : -event.detail * 40;
		},
		// 鼠标按键被按下事件捕获
		getButton: function(event) {
			event = this.getEvent(event);
			// 使用适当的属性初始化一个对象变量
			var buttons = {
				'left': false,
				'middle': false,
				'right': false
			};
			// 按照W3C标准检查是否含有toString方法，
			// 若包含toString()并返回MouseEvent，则可以按标准进行
			if (event.toString && event.toString().indexOf('MouseEvent') != -1) {
				switch (event.button) {
					case 0:
						buttons.left = true;
						break;
					case 1:
						buttons.middle = true;
						break;
					case 2:
						buttons.right = true;
						break;
					default:
						break;
				}
			} else if (event.button) {
				// 变态IE的button事件检测方法
				switch (event.button) {
					case 1:
						buttons.left = true;
						break;
					case 2:
						buttons.right = true;
						break;
					case 3:
						buttons.left = true;
						buttons.right = true;
						break;
					case 4:
						buttons.middle = true;
						break;
					case 5:
						buttons.left = true;
						buttons.middle = true;
						break;
					case 6:
						buttons.middle = true;
						buttons.right = true;
						break;
					case 7:
						buttons.left = true;
						buttons.middle = true;
						buttons.right = true;
						break;
					default:
						break;
				}
			} else {
				return false;
			}
			return buttons;
		},
		// 取得Keypress事件时，获取按下键的ASCII编码
		getCharCode: function(event) {
			if (typeof event.charCode == "number") {
				return event.charCode;
			} else {
				return event.keyCode;
			}
		}
	};

	Tian.dom = {
		id: function(id) {
			return document.getElementById(id);
		},
		tag: function(tag, el) {
			return (el || document).getElementsByTagName(tag);
		},
		className: function(className, tag, parent) {
			parent = parent || document;
			var elements = tag ? parent.getElementsByTagName(tag) : parent.all,
				matches = [];
			for (var i = 0, len = elements.length; i < len; i++) {
				if (this.hasClass(elements[i], className)) {
					matches.push(elements[i]);
				}
			}
			return matches;
		},
		getStyle: function(el, prop) {
			if (el.style[prop]) { // 检测元素style属性中的值
				return el.style[prop];
			} else if (el.currentStyle) { // IE方法
				return el.currentStyle[prop];
			} else if (document.defaultView && document.defaultView.getComputedStyle) {
				// DOM方法
				prop = prop.replace(/([A-Z])/g, "-$1");
				prop = prop.toLowerCase();
				var s = document.defaultView.getComputedStyle(el, "");
				return s && s.getPropertyValue(prop);
			} else
				return null;
		},
		setStyle: function(el, prop, value) {
			if (typeof value != 'undefined') {
				if (el.style.setProperty) {
					el.style.setProperty(prop, value);
				} else {
					el.style[camelize(prop)] = value;
				}
			} else {
				// 循环遍历styles对象并应用每个属性
				for (p in prop) {
					// 如果传入样式不存在则跳过
					if (!prop.hasOwnProperty(p)) continue;

					if (el.style.setProperty) {
						el.style.setProperty(p, prop[p]);
					} else {
						el.style[camelize(p)] = prop[p];
					}
				}
			}

			return true;
		},
		hasClass: function(el, className) {
			// 创建一个正则表达式，来判断className是否正确
			className = className.replace(/\-/g, "\\-");
			var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
			if (pattern.test(el.className)) {
				return true;
			} else {
				return false;
			}
		},
		addClass: function(el, className) {
			if (el.className === '') {
				el.className = className;
			} else {
				if (!this.hasClass(el, className)) {
					el.className += ' ' + className;
				}
			}
		},
		removeClass: function(el, className) {
			if (el.className !== '' && this.hasClass(el, className)) {
				var classes = this.getClassNames(el),
					length = classes.length;
				// 循环遍历数组删除匹配的项
				// 因为从数组中删除会使数组变短，所以反向循环
				for (var i = length - 1; i >= 0; i--) {
					if (classes[i] === className) {
						classes.splice(i,1);
					}
				}
				if( classes.length > 1 ){
					el.className = classes.join(' ');
				}else{
					el.className = classes[0];
				}

				return (length == classes.length ? false : true);
			}
		},
		getClassNames: function(element) {
			// 用一个空格替换多个空格，然后基于空格分割类名
			return element.className.replace(/\s+/, ' ').split(' ');
		},
		camelize: function(str) {
			// 修改内嵌样式，如font-size转化为fontSize		
			return str.replace(/-(\w)/g, function(match, word) {
				// match为-s,word为(\w)匹配到的s,转化为S
				return word.toUpperCase();
			});
		},
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		}
	};

	Tian.cookie = {
		setCookie: function(opt) {
			var str = opt.name + '=' + escape(opt.value) + '; ';
			if (opt.days) {
				str += 'expires=' + new Date(new Date().getTime() + opt.days * 24 * 60 * 60 * 1000).toGMTString() + '; ';
			}
			if (opt.domain) {
				str += 'domain=' + opt.domain + '; ';
			}
			if (opt.path) {
				str += 'path=' + opt.path + '; ';
			}
			if (opt.secure) {
				str += 'secure';
			}
			document.cookie = str;
		},
		getCookie: function(name) {
			var pattern = new RegExp('(^|\s*)' + name + "=([^;]*)(;|$)"),
				arr = document.cookie.match(pattern);

			if ( !! arr) {
				return unescape(arr[2]);
			} else {
				return "No cookie!";
			}
		},
		deleteCookie: function(cookie) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 100000);
			var cval = Tian.cookie.getCookie(name);
			if ( !! cval) document.cookie = name + '=;expires=' + exp.toGMTString();
		}
	};

	Tian.ajax = {
		createXHR: function() {
			if (typeof XMLHttpRequest != 'undefined') {
				return new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP"); //在IE中创建XMLHttpRequest对象,新版IE
				} catch (e) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP"); //在IE中创建XMLHttpRequest对象旧版IE
					} catch (e) {}
				}
			} else {
				window.alert("不能创建XMLHttpRequest对象实例");
				return false;
			}
		},
		send: function(url, options) {
			if (!Tian.ajax.createXHR) return;
			var xhr = Tian.ajax.createXHR();
			var _options = {
				method: 'GET',
				querystring: '',
				onerror: function() {},
				onsuccess: function() {}
			};
			for (var key in options) {
				_options[key] = options[key];
			}
			xhr.open(_options.method, url, true);
			xhr.onreadystatechange = onreadystateCallback;
			xhr.send(_options.querystring);

			function onreadystateCallback() {
				if (xhr.readyState == 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						_options.onsuccess(xhr);
					} else {
						_options.onerror(xhr);
					}
				}
			}
		}
	};

	Tian.canvas = {};

	Tian.regExp = {
		// 判断是否是中文
		isChinese: function(word) {
			return /[\u4E00-\uFA29]+|[\uE7C7-\uE7F3]+/.test(word);
		},
		// 判断是否是身份证
		isIdentifier: function(num) {
			return /^[1-9]\d{5}[1|2]\d{3}((0\d)|(1[0-2]))(([0-2]\d)|(3[0-1]))(\d{4}|\d{3}x)$/.test(num);
		},
		// 判断是否符合登录名，数字字母下划线
		isLoginId: function(str) {
			return /[A-Za-z0-9_]/.test(str);
		}
	};

	Tian.UI = {
		MsgBox: function(options) {
			return {
				box: null,
				mask: null,
				BoxWidth: 300,
				BoxHeight: 200,
				Title: 'Hi buddy',
				Content: 'config {<br>&nbsp;&nbsp;width: 300,<br>&nbsp;&nbsp;height: 300,<br>&nbsp;&nbsp;title: "Hi buddy",<br>&nbsp;&nbsp;content: "Content here",<br>&nbsp;&nbsp;isBar: 0<br>}',
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
					} else {
						//console.log('Error: config is not found.')
					}
					return this;
				},
				open: function(config) {
					this.init(config);
					this.createBox();
					this.createMask();
					return this.box;
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
							var shut = Tian.dom.id("box_shut"),
								_this = this;
							Tian.Event.addEvent(shut, 'click', function(e) {
								_this.fillTitle("");
								_this.zoomOut();
							});
						}
					} else {
						var _this = this;
						Tian.Event.addEvent(this.box, 'click', function(e) {
							_this.zoomOut();
						});
					}
				},
				setBoxStyle: function() {
					this.box.id = "box";
					Tian.dom.setStyle(this.box, {
						'background': '#222',
						'position': 'absolute',
						'border': '4px solid #000',
						'width': this.BoxWidth + 'px',
						'height': this.BoxHeight + 'px',
						'left': this.getLeft(this.BoxWidth) + 'px',
						'top': this.getTop(this.BoxHeight) + 'px',
						'display': 'none',
						'test-align': 'left',
						'color': 'white',
						'box-shadow': '#000 3px 3px 4px',
						'z-index': 1001,
						'overflow': 'hidden'
					});

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
					Tian.dom.setStyle(this.mask, {
						'background': '#000',
						'position': 'fixed',
						'width': '100%',
						'height': '100%',
						'left': 0,
						'top': 0,
						'display': 'block',
						'opacity': 0.5,
						'z-index': 1000
					});
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

					var desX = this.getLeft(this.BoxWidth) - parseInt(this.box.style.left),
						desY = this.getTop(this.BoxHeight) - parseInt(this.box.style.top);

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
					var bar = Tian.dom.id("bar"),
						_this = this;

					var params = {
						startX: 0,
						startY: 0,
						_X: 0,
						_Y: 0,
						isDrag: false
					};
					Tian.Event.addEvent(bar, 'mousedown', function(e) {
						var e = e || window.event;
						params.isDrag = true;
						params._X = e.clientX;
						params._Y = e.clientY;
						params.startX = _this.box.style.left;
						params.startY = _this.box.style.top;
					});

					Tian.Event.addEvent(document, 'mouseup', function(e) {
						params.isDrag = false;
					});

					Tian.Event.addEvent(document, 'mousemove', function(e) {
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
					Tian.dom.id("content").innerHTML = content;
				},
				fillTitle: function(title) {
					Tian.dom.id("bar").innerHTML = title;
				},
				getLeft: function(width) {
					return (document.body.offsetWidth - width) / 2;
				},
				getTop: function(height) {
					return (document.body.offsetHeight - height) / 2 + document.documentElement.scrollTop;
				}
			};
		},
		Logger: function() {

		},
		autoComp: function() {

		}
	};

	Tian.algorithm = {
		sort: {
			bubble: function(arr) {
				for (var i = 0, len = arr.length; i < len; i++) {
					for (var j = len - 1; j > 0; j--) {
						if (arr[j - 1] > arr[j]) {
							arr[j - 1] = [arr[j], arr[j] = arr[j - 1]][0];
						}
					}
				}
				return arr;
			},
			insert: function(arr) {
				var p, key;
				for (var i = 0, len = arr.length; i < len; i++) {
					p = i;
					key = arr[p];
					while (--p > -1) {
						if (arr[p] > key) {
							arr[p + 1] = arr[p];
						} else {
							break;
						}
					}
					arr[p + 1] = key;
				}
				return arr;
			}
		},
		find: {
			binary: function(arr, value) {
				var left = 0,
					right = arr.length - 1,
					center;

				while (left <= right) {
					center = Math.floor((left + right) / 2);
					if (arr[center] === value) break;
					else if (arr[center] < value) {
						left = center + 1;
					} else {
						right = center - 1;
					}
				}

				return center;
			}
		},
		shuffle: function(arr) {
			return arr.sort(function() {
				return Math.random() - 0.5;
			});
		},
		random: function(n) {
			var result = '';
			for (; result.length < n; result += Math.random().toString(36).substr(2)) {}
			return result.substr(0, n);
		}
	};
})()