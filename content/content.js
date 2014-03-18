/**
 * Content main object
 *
 * @author Mautilus s.r.o.
 * @class Content
 * @singleton
 */

var Content = (function() {
	function Factory() {
		Deferrable.call(this);
	};

	Factory.prototype.__proto__ = Deferrable.prototype;

	Factory.prototype.init = function() {
		this.parser = new Content_Parser();

		return this.parser.load();
	};
	/**
	 * Find component by its path
	 *
	 * @param {String} path
	 * @return {Object}
	 */
	Factory.prototype.find = function(path) {
		return this.parser.find.apply(this.parser, arguments);
	};
	/**
	 * AJAX request
	 *
	 * @param  {String} url
	 * @param  {Object} options
	 * @return {Promise}
	 */
	Factory.prototype.ajax = function(url, options) {
		var xhr, opts, serialize, promise, resp, headers, tmp;

		promise = new Promise();
		headers = {};

		serialize = function(data) {
			var arr = [];

			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					if (typeof data[i] === 'object' || (data[i] instanceof Array)) {
						for (var j in data[i]) {
							arr.push(i + '=' + data[i][j]);
						}

					} else {
						arr.push(i + '=' + data[i]);
					}
				}
			}

			return arr.join('&');
		};

		opts = Inio.extend({
			method: 'GET', // GET, POST, PUT, etc.
			type: '', // html, json, jsonp, xml
			data: null, // payload
			timeout: 5000,
			headers: {},
			jsonpCallback: null
		}, options || {});

		if (opts.method === 'GET' && opts.data) {
			if (/\?/.test(url)) {
				url += '&' + serialize(opts.data);

			} else {
				url += '?' + serialize(opts.data);
			}
		}

		xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(ev) {
			if (xhr.readyState === 4) {
				resp = xhr.responseText;
				tmp = xhr.getAllResponseHeaders();

				if (tmp) {
					tmp.split(/\r?\n/).forEach(function(h) {
						var m = h.match(/^([^\:]+)\:\s+(.*)$/);
						if (m && m[1]) {
							headers[m[1]] = m[2];
						}
					});
				}

				if (opts.type === 'json') {
					try {
						resp = JSON.parse(resp);

					} catch (e) {
						promise.reject('parse', resp, headers, xhr);
						return;
					}
				}

				if (xhr.status === 0 || (xhr.status >= 400 && xhr.status <= 599)) {
					promise.reject('status', resp, headers, xhr);

				} else {
					promise.resolve(resp, headers, xhr);
				}
			}
		};

		xhr.ontimeout = function(ev) {
			promise.reject('timeout', resp, headers, xhr);
		};

		xhr.onerror = function(ev) {
			promise.reject(ev.type || 'error', resp, headers, xhr);
		};

		xhr.onabort = function(ev) {
			promise.reject('abort', resp, headers, xhr);
		};

		xhr.open(opts.method || 'GET', url);

		if (opts.timeout) {
			xhr.timeout = opts.timeout >> 0;
		}

		if (opts.headers) {
			for (var i in opts.headers) {
				if (opts.headers.hasOwnPropert(i)) {
					xhr.setRequestHeader(i, opts.headers[i]);
				}
			}
		}

		if (opts.data) {
			xhr.send(serialize(opts.data));

		} else {
			xhr.send();
		}

		return promise;
	};

	return new Factory();
})();