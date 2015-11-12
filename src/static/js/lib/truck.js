/*jshint curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, boss:true, es5:true, laxbreak:true, browser:true, devel:true, jquery:true, node:true */
/*global window document*/
/**
 * requirejs.config( {
 *     baseUrl: // [String] 基本路径 http|https|ftp
 *     cachePrefix: // [String] 缓存的前缀
 *     cacheKey: // [String] 缓存Key
 *     revision: // [Object] 文件名对应版本号 {key: md5}
 *     prefix: // [String] 文件的路径前缀
 *     combo: {
 *         url: // [String] combo 服务地址
 *         meta: // [Array] 存放依赖关系的元信息
 *         pack: // [Function] 使用combo的回调方法 参数为名字的序列 返回combo后的url
 *         unpack: // [Function] 解析combo的回调方法 参数为名字的序列和combo后的所有内容 返回名字对应文件内容的字典
 *     }
 * } )
 *
 */

;(function (win, doc, undefined) {
    'use strict';

    var __defineQueue = [];
    var uniformIndex = 0;
    var requirejs = {},
        assets = {},
        util = {};

    if (win.define && win.define.amd) return false;

    // 通用方法集
    util = {
        isFunction: function (fun) {
            return Object.prototype.toString.call(fun) === '[object Function]';
        },

        //根据全局的依赖关系图，得到某几个被依赖模块的所有间接依赖，然后对这些依赖的模块根据依赖关系进行排序
        depExtend: function (deps, depGraph) {
            function extDeps(nodeName, save) {
                if (!save[nodeName]) {
                    // 如果没有该模块的静态依赖信息，则忽略（可能是turck内部模块或者还未编译）
                    if (!depGraph[nodeName]) {
                        save[nodeName] = {count: 0, link: []};
                    } else {
                        save[nodeName] = {count: 0, link: depGraph[nodeName]};
                    }
                    for (var i = 0; i < save[nodeName].link.length; i++) {
                        extDeps(save[nodeName].link[i], save);
                        save[save[nodeName].link[i]].count++;
                    }
                }
            }

            // use topo sort algorithm
            function topoSort(map) {
                var arr = [];
                for (key in map) {
                    if (map[key].count == 0) {
                        arr.push(key);
                    }
                }
                for (var low = 0; low < arr.length; low++) {
                    var node = map[arr[low]];
                    for (var i = 0; i < node.link.length; i++) {
                        map[node.link[i]].count--;
                        if (map[node.link[i]].count === 0) {
                            arr.push(node.link[i]);
                        }
                    }
                }
                for (var key in map) {
                    if (map[key].count !== 0) {
                        throw "Cycling dependencies occured:" + key;
                    }
                }
                return arr.reverse();
            }

            var map = {};
            for (var i = 0; i < deps.length; i++) {
                extDeps(deps[i], map)
            }
            return topoSort(map)
        },
        /**
         * 扩展，将source中含有而target中没有的且非_开头的属性和值添加到target上
         * @param target
         * @param source
         * @param override
         * @return {*}
         */
        extend: function (target, source, override) {
            for (var k in source) {
                if (k.indexOf(0) !== '_' && ((!override && !target[k]) || override)) {
                    target[k] = source[k];
                }
            }

            return target;
        },

        /**
         * 获取baseUrl
         * @return {*}
         */
        baseUrl: (function () {
            var DIRNAME_RE = /[^?#]*\//,
                scripts = doc.scripts,
                loaderScript = doc.getElementById('truckjsnode') || scripts[scripts.length - 1];
            return loaderScript.src.match(DIRNAME_RE) && loaderScript.src.match(DIRNAME_RE)[0];
        })()
    };
    var LS = {
        /*
         * @param isSupported 浏览器是否支持localStoarge
         * @return {Boolean} 条目数组
         */
        isSupported: (function () {
            try {
                if(!('localStorage' in window && window['localStorage'])){return false}
                localStorage.setItem('~_~', 1);
                localStorage.removeItem('~_~');
            } catch (err) {
                return false;
            }
            return true;
        })(),
        /*
         * @method getItem 相对于原生的localStorage，屏蔽了错误
         * @param {String} key 需要查询的条目名称
         * @return {String} 条目数组
         */
        getItem: function (key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {}
        },
        /*
         * @method setItem 相对于原生的localStorage，屏蔽了错误
         * @param {String} key 需要设置的条目名称
         * @param {val} 要设置的值
         */
        setItem: function (key, val) {
            try {
                localStorage.setItem(key, val);
            } catch (e) {}
        },
        /*
         * @method removeItem 删除一个条目
         * @param {String} key 需要删除的key
         */
        removeItem: function (key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
        }
    }
    /**
     * 资源模块
     * @moduleInstance
     * @type {{config: Function, resources: null, initialize: Function, updateCachedItem: Function}}
     */
    assets = {
        /**
         * 配置
         * @param [options]
         * @return {*}
         */
        config: function (options) {
            var defaults = {
                    cacheKey: 'rslist',
                    cachePrefix: 's~',
                    prefix: '',
                    isDev: false
                },
                override = false;
            util.extend(options, defaults, override);

            if (options.revrev && options.revision && LS.isSupported) {
                LS.setItem('revstore', JSON.stringify(options.revision));
                document.cookie = "revrev=" + options.revrev + "; expires=" + new Date(new Date().getTime() + 999900000).toGMTString() + "; path=/";
            } else if (options.revrev && !options.revision) {
                options.revision = JSON.parse(LS.getItem('revstore'));
                if(!options.revision){document.cookie = "revrev=0; path=/";location.href=location.href}
            }
            //配置版本号从ls里面读取
            if (options.revrev && options.combo && options.combo.deps) {
                LS.setItem('depsstore', JSON.stringify(options.combo.deps));
            } else if (options.revrev && options.combo && !options.combo.deps) {
                options.combo.deps = JSON.parse(LS.getItem('depsstore'));
            }

            return this.config = options;
        },

        resources: null,

        initialize: function () {
            var that = this,
                config;

            if (util.isFunction(that.config)) {
                this.config();
            }
            config = that.config;

            if (config.revision && LS.isSupported) {
                that.resources = localStorage[config.cachePrefix + config.cacheKey];

                // 联想手机JSON.parse(null)会报错
                if (that.resources) {
                    that.resources = JSON.parse(that.resources);
                    that._updateWholeCache();
                } else {
                    that.resources = {};
                }
                try {
                    localStorage.setItem(config.cachePrefix + config.cacheKey, JSON.stringify(that.resources));
                } catch (err) {
                    // 假设空间不够，没必要删除部分，直接全清
                    localStorage.clear();
                    that.resources = {};
                }
            } else {
                that.resources = {};
            }
        },

        /**
         * 更新整个缓存
         * @private
         */
        _updateWholeCache: function () {
            var that = this,
                config = that.config,
                rses = that.resources,
                rev = config.revision, k, v, isFresh;

            /*jshint forin:false*/
            for (k in rev) {
                isFresh = rev.hasOwnProperty(k)
                && (
                rses.hasOwnProperty(k)
                    // 判断版本号一致
                && (v = rev[k]) === rses[k].v
                    // localStorage中存在这个文件
                && localStorage[config.cachePrefix + k]
                    // 校验文件长度一致
                && (localStorage[config.cachePrefix + k].length === rses[k].l)
                );

                if (!isFresh) {
                    rses[k] = undefined;
                    localStorage.removeItem(config.cachePrefix + k);
                }
            }
        },

        updateCachedItem: function (moduleInstance, src) {

            if (!LS.isSupported) {
                return false;
            }

            var that = this,
                resources = that.resources,
                config = that.config,
                resVersion = config.revision,
                id = moduleInstance.id;

            resources[id] = {
                v: (resVersion && resVersion[id]),
                l: src.length
            };
            //如果存在其resvision才存储
            if (resources[id].v){
                LS.setItem(config.cachePrefix + id, src);
                LS.setItem(config.cachePrefix + config.cacheKey, JSON.stringify(resources));
            }
        },

        getCachedItem: function (moduleInstance) {
            return LS.getItem(this.config.cachePrefix + moduleInstance.id);
        }
    };

    /**********
     * 模块类
     *********/
    var Module = function (params) {
        this.id = params.id || "anonymous";
        this.callback = params.callback || null;
        //模块的静态依赖关系
        this.depend = params.depend || [];
        //模块还有那些直接依赖未处于ready
        this.requireing = [];
        //模块被那些其他模块直接依赖，动态关系
        this.following = [];
        this.status = params.status || "inited";
        this.result = params.result;
        requirejs.addModule(this);
    }

    Module.prototype = {
        constructor: Module,

        /**
         * 模块已经初始化，等待被加载            ,占坑
         **/
        inited: function () {
        },

        //模块开始加载                        ,占坑
        loading: function () {
            if (this.status == "inited") {
                requirejs.loadModules([this]);
            }
        },

        //模块已经加载完成
        loaded: function () {
            if(this.status == "loading" || this.status == "inited"){
                this.status = "loaded";
                this.depending();
            }
        },
        //模块开始加载依赖
        depending: function () {
            //如果一个模块已经加载完成，则忽略
            if (this.status != "loaded") {
                return;
            }
            this.status = "depending";
            //需要依赖的模块列表
            for (var i = 0; i < this.depend.length; i++) {
                var moduleDep = requirejs.getModule(this.depend[i]);
                if (!moduleDep) {
                    moduleDep = new Module({
                        id: this.depend[i]
                    });
                }
                //直接依赖添加监听
                if (moduleDep.status != "executed") {
                    moduleDep.following.push(this);
                    this.requireing.push(moduleDep);
                }
            }
            if (this.requireing.length == 0) {
                //所以依赖已经加载完成，可以执行
                this.ready();
            } else {
                //有模块需要加载，开始加载
                var combo = requirejs.config.combo;
                if (combo && combo.deps) {
                    //取得模块的直接和间接依赖
                    var deps = util.depExtend(this.depend, combo.deps);
                } else {
                    //取得直接依赖
                    var deps = this.depend;
                }
                //需要combo加载的模块列表
                var waitingModule = [];
                for (var i = 0; i < deps.length; i++) {
                    var moduleId = deps[i];
                    var moduleDep = requirejs.getModule(moduleId);
                    //如果模块还未处于加载状态，则开始加载；否则等待其加载完成即可
                    if (!moduleDep) {
                        moduleDep = new Module({
                            id: moduleId
                        });
                    }
                    //如果个模块还未加载，则开始加载
                    if (moduleDep.status == "inited") {
                        waitingModule.push(moduleDep);
                    }

                }
                var statObj = {
                    sumCount: deps.length,
                    startTime: new Date().getTime(),
                    lsCount: 0,
                    lsSize: 0
                }
                //加载所有需要远程加载的模块
                requirejs.loadModules(waitingModule, statObj);
            }
        },
        //模块依赖已经加载完成，可以执行
        ready: function () {
            var that = this;
            if (this.status == "depending" && this.requireing.length == 0) {
                this.status = "ready";
                this.executing();
                //当一个模块已经ready时，查看依赖该模块的模块是否也ready
                setTimeout(function () {
                    for (var i = 0; i < that.following.length; i++) {
                        var followdModule = that.following[i];
                        followdModule.requireing.splice(followdModule.requireing.indexOf(that), 1);
                        if (followdModule.requireing.length == 0) {
                            followdModule.ready();
                        }
                    }
                    that.following = [];
                });
            }
        },
        //模块执行中
        executing: function () {
            if (this.status === 'ready') {
                this.status = 'executing';

                if (util.isFunction(this.callback)) {
                    this.result = this.callback.apply({}, requirejs.getResults(this.depend));
                } else {
                    this.result = this.callback;
                }

                this.executed();
            }
        },
        //模块执行完成
        executed: function () {
            this.status = 'executed';
        }
    }

    // loader模块
    requirejs = {

        version: '0.2.1',

        /*
         * 已知的模块列表
         */
        moduleList: {},

        /**
         * 把一个模块添加到模块列表中
         * @param {Module} moduleInstance
         * @return null
         */
        addModule: function (moduleInstance) {
            this.moduleList[moduleInstance.id] = moduleInstance;
        },

        /**
         * 获取一个模块
         * @param {string} [id]
         * @return {Module}
         */
        getModule: function (id) {
            return this.moduleList[id];
        },

        /**
         * 配置
         * @param [options]
         * @return {{baseUrl: *}}
         */
        config: function (options) {
            var defaults = {
                    baseUrl: util.baseUrl
                },
                override = true;

            util.extend(defaults, options || {}, override);

            return this.config = defaults;
        },

        define: function (depend, callback) {
            if (util.isFunction(depend)) {
                callback = depend;
                depend = [];
            }
            //define的时候吧callback记录下来即可，在文件执行完成后onDepended统一处理
            __defineQueue.push({callback: callback, depend: depend});
        },

        require: function (depend, callback) {
            //depend可以不写，默认为空
            if (util.isFunction(depend)) {
                callback = depend;
                depend = [];
            }

            // 确保加载器的this.config肯定被执行，且只执行一次
            if (util.isFunction(this.config)) {
                this.config();
            }

            // 确保IO资源层被配置，且只配置一次
            // 1. 配置缓存的前缀和资源版本元信息
            // 2. 清除过期资源
            if (util.isFunction(assets.config)) {
                assets.config(this.config);
                assets.initialize();
            }

            /**
             * require进来的moduleInstance的状态 status: loaded，这是一个中间态
             * @type {{id: string, callback: *, depend: *, status: string}}
             */
            var moduleInstance = new Module({
                id: 'require' + (uniformIndex++),
                callback: callback,
                depend: depend,
                status: 'loaded'
            });
            //require 的模块状态都是loaded, 可以立刻开始加载其依赖
            moduleInstance.depending();
        },
        /**
         * 把id转换为url。如果模块带md5,则返回带md5的url
         **/
        id2Url: function (id) {
            var md5 = "";
            var ids = id.split('.');
            var idlen = ids.length;

            if (this.config.revision && this.config.revision[id]) {
                md5 = this.config.revision[id]
                ids.splice(idlen - 1, 0, md5);
                id = ids.join('.');
            }
            return this.config.prefix + id;
        },
        /**
         * 加载模块
         **/
        loadModules: function (moduleList, statObj) {
            var that = this;
            var combo = this.config.combo;
            //先检测有哪些模块在localStorage中，如果存在则直接实用localStorage
            for (var i = 0; i < moduleList.length; i++) {
                //如果在localStorage里面，则直接取出执行，否则加入请求列表
                if (assets.resources[moduleList[i].id]) {
                    var src = assets.getCachedItem(moduleList[i]);
                    if (src.replace(/\s+/, '')) {
                        that._geval(src);
                    } else {
                        console.error(moduleList[i].id + ' is blank');
                    }
                    moduleList[i].callback = __defineQueue[0].callback;
                    moduleList[i].depend = __defineQueue[0].depend;
                    __defineQueue = [];
                    moduleList[i].loaded();
                    moduleList.splice(i, 1);
                    i--;

                    //stat
                    statObj.lsCount++;
                    statObj.lsSize += src.length;
                }
            }
            if (combo && moduleList.length > 0) {
                //如果使用combo，则统一加载
                var url = combo.url;
                var toLoadUrl = [];
                for (var i = 0; i < moduleList.length; i++) {
                    toLoadUrl.push(this.id2Url(moduleList[i].id));
                    moduleList[i].status = "loading";
                }

                this._fetchByXHR(url + toLoadUrl.join(';'), function (text) {
                    //加载后所有的模块都会吧模块定义函数依次放入__defineQueue，这里按顺序将模块的定义函数放入模块并执行即可
                    if (text) {
                        var codes = text.split(/\/\*___meta___.*\*\//);
                    }
                    for (var i = 0; i < moduleList.length; i++) {
                        moduleList[i].callback = __defineQueue[i].callback;
                        moduleList[i].depend = __defineQueue[i].depend;

                        if (text && (!codes || !codes[i + 1])) {
                            console.error(moduleList[i], codes);
                        }

                        if (text) {
                            assets.updateCachedItem(moduleList[i], codes[i + 1]);
                        }
                        moduleList[i].loaded();
                    }
                    __defineQueue = [];

                    //stat
                    statObj.xhrSize = text && text.length;
                    statObj.xhrCount = toLoadUrl.length;
                });
            } else if (moduleList.length != 0) {
                //否则每个独立加载
                moduleList.forEach(function (dep) {
                    dep.status = "loading";
                    that._fetchByXHR(that.config.baseUrl + that.id2Url(dep.id), function (text) {
                        dep.callback = __defineQueue[0].callback;
                        dep.depend = __defineQueue[0].depend;
                        if (text) {
                            assets.updateCachedItem(dep, text);
                        }
                        dep.loaded();
                        __defineQueue = [];
                    }, dep.id);
                });
            } else {
                statObj.xhrCount = 0;
                statObj.xhrSize = 0;
            }
        },

        /**
         * 获取依赖的执行结果
         * @param dependencies
         * @return {Array}
         * @private
         */
        getResults: function (dependencies) {
            var that = this,
                exports = [],
                mod;

            dependencies.forEach(function (did) {
                mod = that.getModule(did);

                // 如果mod执行后有返回结果
                if (mod && mod.status == "executed") {
                    exports.push(mod.result);
                } else {
                    console.log("get result faild:" + did);
                }
            });

            return exports;
        },
        /**
         * 通过Ajax方式异步加载，如果失败再去尝试使用tag方式加载
         * @param moduleInstance
         * @param callback
         * @param errback
         * @private
         */
        _fetchByXHR: function (url, callback, name) {
            var that = this,
                xhr = new XMLHttpRequest(),
                protocol = /^([\w]+:)\/\//.test(url) ? RegExp.$1 : window.location.protocol;

            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:')) {
                        xhr.onreadystatechange = null;
                        if(name && xhr.responseText.indexOf('define') == -1) {
                            if(name.indexOf("css.js") != -1) {
                                that._geval('define([],function(){var s=document.createElement("style");s.innerHTML=' + JSON.stringify(xhr.responseText) + ';document.head.appendChild(s);});', name);
                            } else {
                                that._geval('define([],function(){return ' + JSON.stringify(xhr.responseText) + ';});');
                            }
                        } else {
                            that._geval(xhr.responseText, name);
                        }
                        callback(xhr.responseText);
                    } else {
                        that._fetchByInject(url, callback);
                    }
                }
            };
            xhr.send(null);
        },

        /**
         * 通过插入script标签的形式去做
         * @param moduleInstance {Object}
         * @param callback {Function}
         * @param [errback] {Function}
         * @private
         */
        _fetchByInject: function (url, callback) {
            var script = doc.createElement("script"),
                logSt = Date.now(),
                s = document.getElementsByTagName('script')[0];

            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            script.onload = function () {
                callback();
            };

            s.parentNode.insertBefore(script, s);
        },

        /**
         * 通用执行方法
         * @param src
         * @param name
         * @return {Object}
         * @private
         */
        _geval: function (src, name) {
            /*jshint evil:true */
            // for IE
            try {
                if (name) {
                    src += "\n //@ sourceURL=" + name;
                }
                eval(src);
            } catch (e) {
                //console.log(name + "--init faild");
                console.log(e);
            }
        }
    };

    win.require = function () {
        requirejs.require.apply(requirejs, arguments);
    };
    win.define = function () {
        requirejs.define.apply(requirejs, arguments);
    };
    // AMD 规范要求
    win.define.amd = {};
    //ls作为已经可用的模块加入
    new Module({id: "LocalStorage", status: "executed", result: LS});
    //加载已有的require
    if (win.requirejs && win.requirejs.__requirejsConfig) {
        requirejs.config(win.requirejs.__requirejsConfig);
    }
    if (win.requirejs && win.requirejs.__require) {
        var load = function () {
            setTimeout(function () {
                for (var i = 0; i < win.requirejs.__require.length; i++) {
                    require(win.requirejs.__require[i][0], win.requirejs.__require[i][1]);
                }
                win.requirejs = requirejs;
            });
        }
        var readyRE = /complete|loaded|interactive/;
        if (readyRE.test(document.readyState) && document.body) {
            load();
        } else {
            document.addEventListener('DOMContentLoaded', load, false);
        }

    } else {
        win.requirejs = requirejs;
    }
})(window, document);
