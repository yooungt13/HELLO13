(function() {
	// 工具库名，修改NAME即可成为任意库，并进行扩展
	var NAME = 'TIAN';

	if (!window.NAME) {
		// 函数索引
		window[NAME] = {
			isCompatible: isCompatible,

			// DOM操作
			$: $,
			getElementByClassName: getElementByClassName,
			walkTheDOM: walkTheDOM,
			insertAfter: insertAfter,
			removeChildren: removeChildren,
			prependChild: prependChild,

			// 事件控制
			addEvent: addEvent,
			removeEvent: removeEvent,
			bindFunction: bindFunction,
			addLoadEvent: addLoadEvent,
			getEventObject: getEventObject,
			getTarget: getTarget,
			getMouseButton: getMouseButton,
			getPointerPosition: getPointerPosition,
			stopPropagation: stopPropagation,
			preventDefault: preventDefault,

			// css样式控制
			camelize: camelize,
			setStyleById: setStyleById,
			setStyleByClassName: setStyleByClassName,
			setStyleByTagName: setStyleByTagName,
			getStyle: getStyle,
			getStyleId: getStyle,
			getClassNames: getClassNames,
			hasClassName: hasClassName,
			addClassName: addClassName,
			removeClassName: removeClassName,
			addCSSRule: addCSSRule,
			editCSSRule: editCSSRule,
			getStyleSheets: getStyleSheets,
			addStyleSheet: addStyleSheet,
			removeStyleSheet: removeStyleSheet,
			toggleDisplay: toggleDisplay,
			getBrowserWindowSize: getBrowserWindowSize,

			//log: log,
			message: message,
			node: { // nodetype索引
				ELEMENT_NODE: 1,
				ATTRIBUTE_NODE: 2,
				TEXT_NODE: 3,
				CDATA_SECTION_NODE: 4,
				ENTITY_REFERENCE_NODE: 5,
				ENTITY_NODE: 6,
				PROCESSING_INSTRUCTION_NODE: 7,
				COMMENT_NODE: 8,
				DOCUMENT_NODE: 9,
				DOCUMENT_TYPE_NODE: 10,
				DOCUMENT_FRAGMENT_NODE: 11,
				NOTATION_NODE: 12
			}
		}
	}

	/* 原型函数扩充 ************************************ */
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

	if (!String.repeat) {
		String.prototype.repeat = function(len) {
			return new Array(len + 1).join(this);
		};
	}

	if (!String.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		}
	}
	/* ************************************************** */

	/* 工具函数实现 ************************************ */
	function isCompatible(other) { // 浏览器可用性检测
		// 使用能力检测来检查必要条件
		if (other === false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName) return false;

		return true;
	}

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

	function addEvent(node, type, handler) {
		// 检查兼容性以保证平稳退化
		if (!isCompatible()) return;

		node.addEventListener ?
			node.addEventListener(type, handler, false) :
			node.attachEvent('on' + type, function() {
				handler.call(node);
			});
	}

	function removeEvent(node, type, handler) {
		// 检查兼容性以保证平稳退化
		if (!isCompatible()) return;

		node.removeEventListener ?
			node.removeEventListener(type, handler, false) :
			node.detachEvent('on' + type, function() {
				handler.call(node);
			});
	}

	function bindFunction(obj, func) {
		return function() {
			func.apply(obj, arguments);
		}
	}

	function addLoadEvent(loadEvent, waitForImages) { // 使用DOMContentLoaded事件先加载js
		if (!isCompatible) return false;

		// 如果等待标记为真，则使用常规方法注册事件
		if (waitForImages) {
			return addEvent(window, 'load', loadEvent);
		}

		/** 否则使用其他方式包装loadEvent()
		 *	以便为this制定正确内容
		 *	同时确保事件不会被执行两次
		 */
		var init = function() {
			// 如果这个函数已经被调用过了则返回
			if (arguments.callee.done) return;

			// 标记这个函数以便检验它是否运行过
			arguments.callee.done = true;

			// 在document环境中注册事件
			loadEvent.apply(document, arguments);
		};

		// 为DOMContentLoaded事件注册事件监听器
		document.addEventListener && document.addEventListener("DOMContentLoaded", init, false);

		// 对于safari，使用setInterval()函数检测document是否载入完成
		if (/Webkit/i.test(navigator.userAgent)) {
			var _timer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(_timer);
					init();
				}
			}, 10);
		}

		// 对于IE，使用条件注释
		// 附加一个在载入过程最后执行的脚本，并检测该脚本是否载入完成
		/*@cc_on @*/
		/*@if (@_win32)
		document.write("<script id=__ie_onload defer src=javascript:void(0)></script>");
		var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function(){
			if(this.readyState=="complete") init();
		}
		/*@end @*/

		return true;
	}

	function getEventObject(eventObject) {
		// 返回事件对象
		return eventObject || window.event;
	}

	function getTarget(eventObject) {
		eventObject = getEventObject(eventObject);

		var target = eventObject.target || eventObject.srcElement;

		// 如果是safari会指向文本节点，重新将目标指定为其父元素
		if (target.nodeType == TIAN.node.TEXT_NODE) {
			target = target.parentNode;
		}

		return target;
	}

	function getMouseButton(eventObject) {
		eventObject = getEventObject(eventObject);

		// 使用适当的属性初始化一个对象变量
		var buttons = {
			'left': false,
			'middle': false,
			'right': false
		};

		// 检查是否存在toString()并返回MouseEvent
		if (eventObject.toString && eventObject.toString().indexOf('MouseEvent') != -1) {
			switch (eventObject.button) {
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
		} else if (eventObject.button) {
			// IE的button事件检测方法
			switch (eventObject.button) {
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
	}

	function getPointerPosition(eventObject) {
		eventObject = getEventObject(eventObject);

		var x = eventObject.pageX || (eventObject.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
			y = eventObject.pageY || (eventObject.clientY + (document.documentElement.scrollTop || document.body.scrollTop));

		return {
			'x': x,
			'y': y
		};
	}

	function stopPropagation(eventObject) { // 阻止事件冒泡
		eventObject = eventObject || getEventObject(eventObject);
		if (eventObject.stopPropagation) {
			eventObject.stopPropagation();
		} else {
			eventObject.cancelBubble = true;
		}
	}

	function preventDefault(eventObject) { // 取消默认动作
		eventObject = eventObject || getEventObject(eventObject);
		if (eventObject.preventDefault) {
			eventObject.preventDefault();
		} else {
			eventObject.returnValue = false;
		}
	}

	function getElementByClassName(className, tag, parent) {
		parent = parent || document;

		// 查找所有匹配的标签
		var allTags = (tag == '*' && parent.all) ?
			parent.all : parent.getElementsByTagName(tag);
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

	function toggleDisplay(node, value) { // 切换display
		// 如果node不为DOM，则返回
		if (!(node = $(node))) return;

		if (node.style.display != 'none') {
			node.style.display = 'none';
		} else {
			node.style.display = value || '';
		}
	}

	function insertAfter(node, referenceNode) {
		if (!(node = $(node))) return;
		if (!(referenceNode = $(referenceNode))) return;

		return referenceNode.parentNode.insertBefore(
			node, referenceNode.nextSibling
		);
	}

	function removeChildren(parent) {
		if (!(parent = $(parent))) return;

		// 当存在子节点时删除该子节点
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}

		// 再返回父节点，以便实现链式方法
		return parent;
	}

	function prependChild(parent, newChild) {
		if (!(parent = $(parent))) return;

		if (parent.firstChild) parent.insertBefore(newChild, parent.firstChild);
		else parent.appendChild(newChild);

		return parent;
	}

	function walkTheDOM(func, node, depth, returned) { // 递归遍历DOM
		var root = node || window.document,
			returned = func.call(root, depth++, returned),
			node = root.firstChild;

		while (node) {
			walkTheDOM(func, node, depth, returned);
			node = node.nextSibling;
		}
	}

	function getBrowserWindowSize() {
		var de = document.documentElement;
		return {
			'width': (
				window.innerWidth || (de && de.clientWidth) || document.body.clientWidth),
			'height': (
				window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
		}
	}

	function camelize(str) { // 修改内嵌样式，如font-size转化为fontSize		
		return str.replace(/-(\w)/g, function(match, word) {
			// match为-s,word为(\w)匹配到的s,转化为S
			return word.toUpperCase();
		});
	}

	function setStyleById(element, styles) { // 通过ID修改样式
		// 取得对象的引用
		if (!(element = $(element))) return false;

		// 循环遍历styles对象并应用每个属性
		for (property in styles) {
			// 如果传入样式不存在则跳过
			if (!styles.hasOwnProperty(property)) continue;

			if (element.style.setProperty) {
				element.style.setProperty(property, styles[property]);
			} else {
				element.style[camelize(property)] = styles[property];
			}
		}
		return true;
	}

	function setStyleByClassName(parent, tag, className, styles) { // 通过Class修改样式
		// 取得对象的引用
		if (!(parent = $(parent))) return false;

		var elements = getElementByClassName(className, tag, parent);

		for (var i = 0, len = elements.length; i < len; i++) {
			setStyleById(elements[i], styles);
		}
		return true;
	}

	function setStyleByTagName(tag, styles, parent) { // 通过Tag修改样式
		parent = parent || document;

		var elements = parent.getElementsByTagName(tag);
		for (var i = 0, len = elements.length; i < len; i++) {
			setStyleById(elements[i], styles);
		}
		return true;
	}

	function getStyle(element, property) {
		if (!(element = $(element)) || !property) return false;

		// 检测元素style属性中的值
		var value = element.style[camelize(property)];
		if (!value) {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				// DOM方法
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(property) : null;
			} else if (element.currentStyle) {
				// IE方法
				value = element.currentStyle[camelize(property)];
			}
		}

		return value == 'auto' ? '' : value;
	}

	function getClassNames(element) {
		if (!(element = $(element))) return false;
		// 用一个空格替换多个空格，然后基于空格分割类名
		return element.className.replace(/\s+/, ' ').split(' ');
	}

	function hasClassName(element) {
		if (!(element = $(element))) return false;

		var classes = getClassNames(element);
		for (var i = 0; i < classes.length; i++) {
			// 检测className是否匹配，如果是返回
			if (classes[i] === className) return true;
		}
	}

	function addClassName(element) {
		if (!(element = $(element))) return false;
		// 将类名添加到当前className的末尾
		// 如果没有className,则不包含空格
		element.className += (element.className ? ' ' : '') + className;
		return true;
	}

	function removeClassName(element, className) {
		if (!(element = $(element))) return false;
		var classes = getElementByClassName(element),
			length = classes.length;

		// 循环遍历数组删除匹配的项
		// 因为从数组中删除会使数组变短，所以反向循环
		for (var i = length - 1; i >= 0; i--) {
			if (classes[i] === className) {
				delete(classes[i]);
			}
		}

		element.className = classes.join(' ');
		return (length == classes.length ? false : true);
	}

	function getStyleSheets(url, media) {
		var sheets = [];
		for (var i = 0, len = document.styleSheets.length; i < len; i++) {
			if (url && document.styleSheets[i].href.indexOf(url) == -1) {
				continue;
			}

			if (media) {
				// 规范化media字符串
				media = media.replace(/,\s+/, ',');
				var sheetMedia;

				if (document.styleSheets[i].media.mediaText) {
					// dom方法
					sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ',');
					// Safari会添加额外的逗号和空格
					sheetMedia = sheetMedia.replace(/,\s*$/, '');
				} else {
					// IE方法
					sheetMedia = document.styleSheets[i].media.replace(/,\s+/, ',');
				}
			}
			// 如果media不匹配则跳过
			if (media != sheetMedia) continue;
			sheets.push(document.styleSheets[i]);
		}

		return sheets;
	}

	function editCSSRule(selector, styles, url, media) {
		var styleSheets = ((typeof url == 'Array') ? url : getStyleSheets(url, media));

		for (var i = 0, len = styleSheets.length; i < len; i++) {
			var rules = styleSheets[i].cssRules || styleSheets[i].rules;
			if (!rules) continue;

			// IE默认使用大写
			selector = selector.toUpperCase();

			for (var j = 0; j < rules.length; j++) {
				// 检查是否匹配
				if (rules[j].selectorText.toUpperCase == selector) {
					for (property in styles) {
						// 设置新的样式
						rules[j].style[camelize(property)] = styles[property];
					}
				}
			}
		}
	}

	function addCSSRule(selector, styles, index, url, media) {
		var declaration = '';

		// 构建声望字符串
		for (property in styles) {
			declaration += property + ':' + styles[property] + '; ';
		}

		var styleSheets = ((typeof url == 'Array') ? url : getStyleSheets(url, media));
		var newIndex;
		for (var i = 0, len = styleSheets.length; i < len; i++) {
			// 添加规则
			// index为CSS文档中的位置
			if (styleSheets[i].insertRule) {
				newIndex = index > 0 ? index : styleSheets[i].cssRules.length;
				styleSheets[i].insertRule(
					selector + '{' + declaration + '}',
					newIndex
				);
			} else if (styleSheets[i].addRule) {
				// MSIE index = -1 是列表末尾
				newIndex = (index >= 0) ? index : -1;
				styleSheets[i].addRule(selector, declaration, newIndex);
			}
		}
	}

	function addStyleSheet(url, media) {
		media = media || 'screen';
		var link = document.createElement('LINK');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', url);
		link.setAttribute('media', media);

		document.getElementsByTagName('head')[0].appendChild(link);
	}

	function removeStyleSheet(url, media) {
		var styles = getStyleSheets(url, media);
		for (var i = 0, len = styles.length; i < len; i++) {
			var node = styles[i].ownerNode || styles[i].ownerElement;
			// 禁用样式表
			styles[i].disabled = true;
			// 移除节点
			node.parentNode.removeChild(node);
		}
	}

	function message(config) {
		var box = new MsgBox();
		if (typeof config == 'string') {
			box.open({
				content: config
			});
		} else {
			box.open(config)
		}
	}
	/* ************************************************** */

	/* 插件封装 ***************************************** */
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
	window[NAME]['log'] = new Logger();

	function MsgBox() {}
	MsgBox.prototype = {
		box: null,
		mask: null,
		BoxWidth: 300,
		BoxHeight: 200,
		Title: "Tian's MessageBox",
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
			this.box.style.color = 'white';
			this.box.style.boxShadow = "#000 3px 3px 4px";
			this.box.style.zIndex = 1001;
			this.box.style.overflow = 'hidden';

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
			return (document.body.offsetHeight - height) / 2 + document.documentElement.scrollTop;
		}
	}
	/* ************************************************** */
})();