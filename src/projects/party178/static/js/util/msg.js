define(['zepto'], function(a) {

	// msg.css.js
	var s = document.createElement("style");
	s.innerHTML = ".msg-bg{background:rgba(0,0,0,.7);position:absolute;top:0;left:0;width:100%;z-index:1402}.msg-doc{position:fixed;left:10px;right:10px;bottom:15%;border-radius:5px;background:#fff;overflow:hidden;z-index:1403;margin:auto;}.msg-hd{background:#f0efed;color:#333;text-align:center;padding:.28rem 0;overflow:hidden;border-bottom:1px solid #DDD8CE}.msg-bd{padding:20px;border-bottom:1px solid #D8D8D8}.msg-toast{background:rgba(0,0,0,.8);font-size:.4rem;color:#fff;border:0;text-align:center;padding:.4rem;-webkit-animation-name:pop-hide;-webkit-animation-duration:5s;border-radius:.12rem;bottom:60%;opacity:0;pointer-events:none}.msg-confirm,.msg-alert{-webkit-animation-name:pop;-webkit-animation-duration:.3s}.msg-option{-webkit-animation-name:slideup;-webkit-animation-duration:.3s}@-webkit-keyframes pop-hide{0%{-webkit-transform:scale(0.8);opacity:0}2%{-webkit-transform:scale(1.1);opacity:1}6%{-webkit-transform:scale(1)}90%{-webkit-transform:scale(1);opacity:1}100%{-webkit-transform:scale(0.9);opacity:0}}@-webkit-keyframes pop{0%{-webkit-transform:scale(0.8);opacity:0}40%{-webkit-transform:scale(1.1);opacity:1}100%{-webkit-transform:scale(1)}}@-webkit-keyframes slideup{0%{-webkit-transform:translateY(100%)}40%{-webkit-transform:translateY(-10%)}100%{-webkit-transform:translateY(0)}}.msg-ft{display:-webkit-box;display:-ms-flexbox;}.msg-ft .msg-btn{display:block;-webkit-box-flex:1;-ms-flex:1;margin-right:-1px;border-right:1px solid #D8D8D8;height:3.2rem;line-height:3.2rem;text-align:center;color:#06c1ae}.msg-btn:last-child{border-right:0}.msg-option{background:0;bottom:.5rem}.msg-option div:first-child,.msg-option .msg-option-btns:first-child .btn:first-child{border-radius:.06rem .06rem 0 0;border-top:0}.msg-option .btn{width:100%;background:#fff;border:0;color:#06c1ae;border-radius:0}.msg-option .msg-bd{background:#fff;border-bottom:0}.msg-option .btn{height:.8rem;line-height:.8rem;border-top:1px solid #ccc}.msg-option-btns .btn:last-child{border-radius:0 0 .06rem .06rem;border-bottom:1px solid #ccc}.msg-option .msg-btn-cancel{padding:0;margin-top:.14rem;color:#06c1ae;border-radius:.06rem}.msg-dialog .msg-hd{background-color:#fff}.msg-dialog .msg-bd{background-color:#f0efed}.msg-slide{background:0;bottom:0;left:0;right:0;border-radius:0;-webkit-animation-name:slideup;-webkit-animation-duration:.3s}";
	document.head.appendChild(s);


	var b, c = {
		_el: null,
		_el_bg: null,
		_fun: {},
		_auto_close: !0,
		_create: function(b) {
			var c = this;
			this._el_bg = a('<div class="msg-bg"></div>'), b.disableShade || a("body").append(this._el_bg), this._el = a('<div id="msg" class="msg-doc"></div>'), a("body").append(this._el), this._el_bg.click(function() {
				b.closeOut && c.close()
			}), this._el.on("click", ".mj-close,.msg-btn,.msg-btn-cancel", function(b) {
				var d = a(this).attr("data-event");
				"function" == typeof c._fun[d] && (c._fun[d](a(this)), b.preventDefault()), (c._auto_close || "cancel" == d) && c.close()
			})
		},
		_show: function(c) {
			if (c = c || {}, this.conf = c, clearTimeout(b), a(".msg-doc").remove(), a(".msg-bg").remove(), this._create(c), this._auto_close = void 0 == c.autoClose ? !0 : c.autoClose, "alert" == c.type || "confirm" == c.type) {
				c.okGE = c.okGE || "msg/ok", c.cancelGE = c.cancelGE || "msg/cancel";
				var d = "";
				void 0 != c.title && (d += '<div class="msg-hd">' + c.title + (c.closeRT === !0 ? '<a class="msg-close" gaevent="' + c.okGE + '" data-event="close" href="#">×</a>' : "") + "</div>"), d += '<div class="msg-bd">' + c.content + "</div>" + '<div class="msg-ft cf">' + '<span class="msg-btn msg-btn-ok" gaevent="' + c.okGE + '" data-event="ok">' + (c.okText ? c.okText : "确定") + "</span>" + ("confirm" == c.type ? '<span class="msg-btn msg-btn-cancel" gaevent="' + c.cancelGE + '" data-event="cancel">' + (c.cancelText ? c.cancelText : "取消") + "</span>" : "") + "</div>"
			} else if ("dialog" == c.type) {
				var d = "";
				d += '<div class="msg-hd">' + c.title + "</div>", d += '<div class="msg-bd">' + c.content + "</div>" + '<div class="msg-ft cf">' + '<span class="msg-btn msg-btn-ok" gaevent="' + c.okGE + '" data-event="ok">' + (c.okText ? c.okText : "确定") + "</span>" + "</div>"
			} else if (c.content) var d = c.content;
			this._el_bg.css("left", "0"), this._el_bg.css("height", Math.max(a(window).height(), a(document).height()) + "px"), d ? this._el.html(d) : this._el.append(c.dom), this._el[0].className = "msg-doc msg-" + c.type, window.scrollBy(0, 1)
		},
		close: function() {
			if (this.conf.closeFun) this.conf.closeFun();
			else {
				var a = this;
				a._el.animate({
					scale: ".8",
					opacity: "0"
				}, 200, "ease-in"), a._el_bg.fadeOut(200), b = setTimeout(function() {
					a._el.remove(), a._el_bg.remove()
				}, 300)
			}
		},
		dialog: function(a) {
			a = a || {}, a.type = "dialog", a.closeOut = a.closeOut === !1 ? !1 : !0, this.conf = a, this._fun.ok = a.okFun, this._show(a)
		},
		alert: function(a, b, c) {
			c = c || {}, c.type = "alert", c.content = a, this._fun = b ? {
				ok: b
			} : {}, this._show(c)
		},
		toast: function(b) {
			a(".msg-toast").remove(), a('<div class="msg-doc msg-toast">' + b + "</div>").appendTo("body")
		},
		confirm: function(a, b, c) {
			c = c || {}, c.type = "confirm", c.content = a, "function" == typeof b && (b = {
				ok: b
			}), this._fun = b || {}, this._show(c)
		},
		option: function(a, c, d, e) {
			e = e || {}, e.type = "option", this._fun = d ? {
				cancel: d
			} : {};
			var f = "";
			f += a ? '<div class="msg-bd">' + a + "</div>" : "", f += '<div class="msg-option-btns">';
			for (var g in c)
				if (c[g].text) {
					c[g].fun && (this._fun["btn_" + g] = c[g].fun);
					var h = c[g].ge || "msg/btn_" + g;
					f += c[g].url ? '<a class="btn msg-btn' + (c[g].cls ? " " + c[g].cls : "") + '" gaevent="' + h + '" href="' + c[g].url + '">' + c[g].text + "</a>" : '<button class="btn msg-btn' + (c[g].cls ? " " + c[g].cls : "") + '" gaevent="' + h + '" data-event="btn_' + g + '" type="button">' + c[g].text + "</button>"
				}
			f += "</div>", f += '<button class="btn msg-btn-cancel" gaevent="' + e.cancelGE + '" data-event="cancel" type="button">' + (e.cancelText ? e.cancelText : "取消") + "</button>", e.content = f;
			var i = this;
			e.closeFun = function() {
				i._el.animate({
					translateY: "100%"
				}, 200, "ease-in"), i._el_bg.fadeOut(200), b = setTimeout(function() {
					i._el.remove(), i._el_bg.remove()
				}, 300)
			}, this._show(e)
		},
		slide: function(a, c) {
			c.type = "slide", c.dom = a;
			var d = this;
			c.closeFun = function() {
				d._el.animate({
					translateY: "100%"
				}, 200, "ease-in"), d._el_bg.fadeOut(200), b = setTimeout(function() {
					d._el.remove(), d._el_bg.remove()
				}, 300)
			}, this._show(c)
		},
		diy: function(a, b, c) {
			var d = {
				content: a,
				type: c.type || "diy",
				closeOut: c.closeOut === !1 ? !1 : !0
			};
			this._fun = b || {}, this._show(d)
		}
	};
	return c
});