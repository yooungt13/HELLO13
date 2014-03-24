(function() {
	if (!window.TIAN) {
		window['TIAN'] = {};
	}

	/* 在构造函数的原型对象上添加方法 */
	Function.prototype.method = function(name, func) {
		if (!this.prototype[name]) {
			this.prototype[name] = func;
			return this;
		}
	};

	/** 
	 * 使构造函数“继承”其他构造函数
	 * 实际上是将构造函数的原型对象替换为另外构造函数产生的对象
	 */
	Function.method('inherit', function(Parent) {
		this.prototype = new Parent();
		return this;
	});

	function isCompatible(other) {
		// 使用能力检测来检查必要条件
		if (other === false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName) return false;

		return true;
	}
	window['TIAN']['isCompatible'] = isCompatible;

	function $() {
		var elements = [];

		// 查找作为参数提供的所有元素
		for (var i = 0; i < arguments.length; i++) {
			var element = arguments[i];

			// 如果该参数是一个字符串那假设它是一个id
			if (typeof element == 'string') {
				element = document.getElementById(element);
			}
			// 如果只提供了一个参数， 即返回这个元素
			if (arguments.length == 1) return element;
			// 否则，将它添加到数组中
			elements.push(element);
		}

		return elements;
	}
	window['TIAN']['$'] = $;

	function addEvent(node, type, handler) {
		// 检查兼容性以保证平稳退化
		if (!isCompatible()) return;

		node.addEventListener ?
			node.addEventListener(type, handler, false) :
			node.attachEvent('on' + type, function() {
				handler.call(node);
			});
	}
	window['TIAN']['addEvent'] = addEvent;

	function removeEvent(node, type, handler) {
		// 检查兼容性以保证平稳退化
		if (!isCompatible()) return;

		node.removeEventListener ?
			node.removeEventListener(type, handler, false) :
			node.detachEvent('on' + type, function() {
				handler.call(node);
			});

	}
	window['TIAN']['removeEvent'] = removeEvent;

	function bindFunction(obj, func) {
		return function() {
			func.apply(obj, arguments);
		}
	};
	window['TIAN']['bindFunction'] = bindFunction;

	function getElementByClassName(className, tag, parent) {
		parent = parent || document;

		// 查找所有匹配的标签
		var allTags = (tag == '*' && parent.all) ?
			parent.all : parent.getElementByTagName(tag);
		var matchingElements = [];

		// 创建一个正则表达式，来判断className是否正确
		className = className.replace(/\-/g, "\\-");
		var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");

		var element;
		// 检查每个元素
		for (var i = 0, len = allTags.length; i < len; i++) {
			element = allTags[i];
			if (pattern.test(element)) {
				matchingElements.push(element);
			}
		}

		return matchingElements;
	}
	window['TIAN']['getElementByClassName'] = getElementByClassName;

	// 切换display
	function toggleDisplay(node, value) {
		if (!(node = $(node))) return; // 如果node不为DOM，则返回

		if (node.style.display != 'none') {
			node.style.display = 'none';
		} else {
			node.style.display = value || '';
		}
	}
	window['TIAN']['toggleDisplay'] = toggleDisplay;

	function insertAfter(node, referenceNode) {
		if (!(node = $(node))) return;
		if (!(referenceNode = $(referenceNode))) return;

		return referenceNode.parentNode.insertBefore(
			node, referenceNode.nextSibling
		);
	}
	window['TIAN']['insertAfter'] = insertAfter;

	function removeChildren(parent) {
		if (!(parent = $(parent))) return;

		// 当存在子节点时删除该子节点
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}

		// 再返回父节点，以便实现链式方法
		return parent;
	}
	window['TIAN']['removeChildren'] = removeChildren;

	function prependChild(parent, newChild) {
		if (!(parent = $(parent))) return;

		if (parent.firstChild) parent.insertBefore(newChild, parent.firstChild);
		else parent.appendChild(newChild);

		return parent;
	}
	window['TIAN']['prependChild'] = prependChild;

	function getBrowserWindowSize() {
		var de = document.documentElement;
		return {
			'width': (
				window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
			'height': (
				window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
		}
	}
	window['TIAN']['getBrowserWindowSize'] = getBrowserWindowSize;

	function Logger(id) {
		id = id || 'TianLogWindow';
		var logWindow = null;
		// 用受保护的方法创建日志
		var createWindow = function() {
			// 创建作为日志窗口的DOM节点
			logWindow = document.createElement('ul');
			logWindow.setAttribute('id', id);

			logWindow.style.position = 'absolute';
			logWindow.style.width = '200px';
			logWindow.style.minHeight = '200px';
			logWindow.style.zIndex = '1010';
			//logWindow.style.overflow = 'scroll';

			logWindow.style.listStyleType = 'none';
			logWindow.style.padding = '0';
			logWindow.style.margin = '0';
			logWindow.style.border = '1px solid black';
			logWindow.style.backgroundColor = 'white';
			logWindow.style.textAlign = 'left';

			// 新建MsgBox将logWindow加入
			document.body.appendChild(logWindow);
		};
		this.writeRaw = function(message) {
			if (!logWindow) createWindow();

			var li = document.createElement('li');
			li.style.padding = '2px';
			li.style.border = '0';
			li.style.borderBottom = '1px dotted #000';
			li.style.margin = '0';
			li.style.color = 'black';

			// 为日志添加节点信息
			if (typeof message == 'undefined') {
				li.appendChild(document.createTextNode('message was undefined.'));
			} else if (typeof li.innerHTML != undefined) {
				li.innerHTML = message;
			} else {
				li.appendChild(document.createTextNode(message));
			}
			logWindow.appendChild(li);
		};
	}
	Logger.prototype = {
		write: function(message) {
			// 如果字符为空
			if (typeof message == 'string' && message.length == 0) {
				return this.writeRaw('TIAN.log: null message.');
			}

			// 如果不是字符串，则尝试调用toString()
			if (typeof message != 'string') {
				if (message.toString) return message.toString();
				else return this.writeRaw('TIAN.log: typeof message is ' + typeof message);
			}

			// 转换<和>以便.innerHTML不会将message当作html解析
			message = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return this.writeRaw(message);
		},
		header: function(message) {
			// 向日志中写入一个标题
			message = '<span style="color:white;background:black;font-weight:bold;padding:0px 5px;">' + message + '</span>'
			return this.writeRaw(message);
		},
		link: function(link) {}
	};
	window['TIAN']['log'] = new Logger();

	function Box() {}
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
					var shut = $("box_shut"),
						_this = this;
					addEvent(shut, 'click', function(e) {
						_this.fillTitle("");
						_this.zoomOut();
					});
				}
			} else {
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
					//this.fillContent(this.Content);
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
			var bar = $("bar"),
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
			$("content").innerHTML = content;
		},
		fillTitle: function(title) {
			$("bar").innerHTML = title;
		},
		getLeft: function(width) {
			return (document.body.offsetWidth - width) / 2;
		},
		getTop: function(height) {
			return (document.body.offsetHeight - height) / 2 + document.body.scrollTop;
		}
	}

})();