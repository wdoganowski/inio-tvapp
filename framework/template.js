/**
 * Template class, supported engines: Mustache
 *
 * @author Mautilus s.r.o.
 * @class Template
 * @singleton
 * @mixins Events
 * @mixins Deferrable
 */
var Template = (function() {
	function Factory() {
		Events.call(this);
		Deferrable.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = {
			/**
			 * @cfg {String} tplExt Template files extension (`.mustache` by default)
			 */
			tplExt: '.mustache',
			/**
			 * @cfg {String} basePath Path to the directory that contains templates
			 */
			basePath: null
		};

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init(CONFIG.template);
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;
	Factory.prototype.__proto__.__proto__ = Deferrable.prototype;

	Factory.prototype.init = function(config) {
		/**
		 * @property {Object} engine Engine instance (Mustache)
		 */
		this.engine = null;

		// template stack
		this.templates = {};

		this.configure(config);

		if (typeof Mustache === 'undefined') {
			throw new Error('Mustache is not loaded');
		}

		this.engine = Mustache;
	};
	/**
	 * Set class config hash
	 *
	 * @param {Object} config Hash of parameters
	 */
	Factory.prototype.configure = function(config) {
		this.config = $.extend(true, this.config || {}, config);
	};
	/**
	 * Render template
	 *
	 * @param {String} tplName Template name
	 * @param {Object} attrs
	 * @returns {Promise}
	 */
	Factory.prototype.render = function(tplName, attrs) {
		var promise = new Promise();

		this.get(tplName, function(tpl) {
			promise.resolve(this.engine.render(tpl, attrs));
		}, this);

		return promise;
	};
	/**
	 * Get compiled template
	 *
	 * @param {String} tplName
	 * @param {Function} callback Async. callback
	 * @param {Object} scope
	 */
	Factory.prototype.get = function(tplName, callback, scope) {
		if (typeof this.templates[tplName] !== 'undefined') {

			if (typeof callback === 'function') {
				callback.call(scope || this, this.templates[tplName]);
			}

			return;
		}

		this.fetchTemplate(tplName, function(tpl) {
			if (tpl !== false && tpl !== undefined) {
				this.templates[tplName] = tpl;
			}

			if (typeof callback === 'function') {
				callback.call(scope || this, tpl);
			}

		}, this);
	};
	/**
	 * Fetch template
	 *
	 * @param {String} tplName
	 * @param {Function} callback Async. callback
	 * @param {Object} scope
	 * @returns {Function}
	 */
	Factory.prototype.fetchTemplate = function(tplName, callback, scope) {
		var els, html, found;

		els = document.getElementsByTagName('script');

		for (var i in els) {
			if (els.hasOwnProperty(i) && els[i] && els[i].type === 'text/html' && els[i].getAttribute('data-name') === tplName) {
				html = els[i].innerHTML.replace(/^\s+|\s+$/g, '');
				found = true;
				break;
			}
		}

		if (!found && this.config.basePath) {
			Ajax.request(this.config.basePath + tplName + this.config.tplExt).done(function(html) {
				if (typeof callback === 'function') {
					callback.call(scope || this, html);
				}

			}, this).fail(function() {
				if (typeof callback === 'function') {
					callback.call(scope || this, false);
				}
			});

			return;

		} else if (!found) {
			throw new Error('Template `' + tplName + '` is not defined')
		}

		if (typeof callback === 'function') {
			callback.call(scope || this, html);
		}
	};

	return new Factory();
})();