/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/service-worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/process/browser.js":
/*!**************************************************************************!*\
  !*** /Users/sascha/Projects/web/weather/node_modules/process/browser.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack:////Users/sascha/Projects/web/weather/node_modules/process/browser.js?");

/***/ }),

/***/ "./src/node_modules/@sapper/service-worker.js":
/*!****************************************************!*\
  !*** ./src/node_modules/@sapper/service-worker.js ***!
  \****************************************************/
/*! exports provided: timestamp, files, assets, shell, routes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"timestamp\", function() { return timestamp; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"files\", function() { return files; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assets\", function() { return files; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"shell\", function() { return shell; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"routes\", function() { return routes; });\n// This file is generated by Sapper — do not edit it!\nconst timestamp = 1604741720940;\n\nconst files = [\n\t\"/service-worker-index.html\",\n\t\"/favicon.png\",\n\t\"/global.css\",\n\t\"/logo-192.png\",\n\t\"/logo-512.png\",\n\t\"/manifest.json\"\n];\n // legacy\n\nconst shell = [\n\t\"/client/1a7995d9ba835edd2e10b82db7371a3f.jpg\",\n\t\"/client/d68dbc77d2100ea6a452/0.0.js\",\n\t\"/client/d68dbc77d2100ea6a452/about.about.js\",\n\t\"/client/d68dbc77d2100ea6a452/blog.blog.js\",\n\t\"/client/d68dbc77d2100ea6a452/blog_$slug.blog_$slug.js\",\n\t\"/client/d68dbc77d2100ea6a452/index.index.js\",\n\t\"/client/d68dbc77d2100ea6a452/main.js\"\n];\n\nconst routes = [\n\t{ pattern: /^\\/$/ },\n\t{ pattern: /^\\/about\\/?$/ },\n\t{ pattern: /^\\/blog\\/?$/ },\n\t{ pattern: /^\\/blog\\/([^/]+?)\\/?$/ }\n];\n\n//# sourceURL=webpack:///./src/node_modules/@sapper/service-worker.js?");

/***/ }),

/***/ "./src/service-worker.ts":
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var _sapper_service_worker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sapper/service-worker */ \"./src/node_modules/@sapper/service-worker.js\");\n\nconst id = process.env.BUILD_ID || Date.now();\nconst ASSETS = `cache-${id}`;\n// `shell` is an array of all the files generated by the bundler,\n// `files` is an array of everything in the `static` directory\nconst to_cache = _sapper_service_worker__WEBPACK_IMPORTED_MODULE_0__[\"shell\"].concat(_sapper_service_worker__WEBPACK_IMPORTED_MODULE_0__[\"files\"]);\nconst staticAssets = new Set(to_cache);\nself.addEventListener('install', (event) => {\n    event.waitUntil(caches\n        .open(ASSETS)\n        .then(cache => cache.addAll(to_cache))\n        .then(() => {\n        self.skipWaiting();\n    }));\n});\nself.addEventListener('activate', (event) => {\n    event.waitUntil(caches.keys().then(async (keys) => {\n        // delete old caches\n        for (const key of keys) {\n            if (key !== ASSETS)\n                await caches.delete(key);\n        }\n        self.clients.claim();\n    }));\n});\n/**\n * Fetch the asset from the network and store it in the cache.\n * Fall back to the cache if the user is offline.\n */\nasync function fetchAndCache(request) {\n    const cache = await caches.open(`offline-${id}`);\n    try {\n        const response = await fetch(request);\n        cache.put(request, response.clone());\n        return response;\n    }\n    catch (err) {\n        const response = await cache.match(request);\n        if (response)\n            return response;\n        throw err;\n    }\n}\nself.addEventListener('fetch', (event) => {\n    if (event.request.method !== 'GET' || event.request.headers.has('range'))\n        return;\n    const url = new URL(event.request.url);\n    // don't try to handle e.g. data: URIs\n    const isHttp = url.protocol.startsWith('http');\n    const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;\n    const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);\n    const skipBecauseUncached = event.request.cache === 'only-if-cached' && !isStaticAsset;\n    if (isHttp && !isDevServerRequest && !skipBecauseUncached) {\n        event.respondWith((async () => {\n            // always serve static files and bundler-generated assets from cache.\n            // if your application has other URLs with data that will never change,\n            // set this variable to true for them and they will only be fetched once.\n            const cachedAsset = isStaticAsset && (await caches.match(event.request));\n            // for pages, you might want to serve a shell `service-worker-index.html` file,\n            // which Sapper has generated for you. It's not right for every\n            // app, but if it's right for yours then uncomment this section\n            /*\n                    if (!cachedAsset && url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {\n                        return caches.match('/service-worker-index.html');\n                    }\n                    */\n            return cachedAsset || fetchAndCache(event.request);\n        })());\n    }\n});\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/process/browser.js */ \"../../node_modules/process/browser.js\")))\n\n//# sourceURL=webpack:///./src/service-worker.ts?");

/***/ })

/******/ });