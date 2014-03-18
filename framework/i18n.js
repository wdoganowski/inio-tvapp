/**
 * i18n module
 *
 * @author Mautilus s.r.o.
 * @class I18n
 * @singleton
 * @mixins Events
 */
var I18n = (function() {
	function Factory() {
		Events.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = null;
		/**
		 * @property {String} locale Current locale, eg. `EN`
		 */
		this.locale = null;
		/**
		 * @property {Object} translations Hash  of translations
		 */
		this.translations = {};
		/**
		 * @property {Object} languages List ob language codes ISO 639-2B/T
		 */
		this.languages = {
			'en': ['eng'],
			'cs': ['cze'],
			'sk': ['slo'],
			'sq': ['alb'],
			'ar': ['ara'],
			'ka': ['geo'],
			'de': ['ger'],
			'ru': ['rus'],
			'uk': ['ukr'],
			'pl': ['pol'],
			'ro': ['ron'],
			'sv': ['swe'],
			'fi': ['fin'],
			'et': ['est'],
			'bg': ['bul'],
			'fr': ['fra'],
			'hu': ['hun']
		};

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	Factory.prototype.init = function(config) {
		this.configure(config);

		this.locale = this.config.locale || CONFIG.locale;
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
	 * Translate given string
	 *
	 * @param {String} str String to translate
	 * @param {Object} [attributes] Hash of replacements
	 * @returns {String}
	 */
	Factory.prototype.translate = function(str, attributes) {
		if (!this.locale) {
			throw new Error('Locale is not set in I18n module');
		}

		var tr = this.translations[this.locale],
			l, exp;

		if (tr && typeof tr[str] !== 'undefined') {
			l = tr[str];

		} else {
			console.warn('Missing translation', str);
			l = str;
		}

		if (attributes) {
			for (var i in attributes) {
				if (attributes.hasOwnProperty(i)) {
					exp = new RegExp('{' + i + '}', 'g');
					l = l.replace(exp, attributes[i]);
				}
			}
		}

		return l;

	};
	Factory.prototype.getLanguage = function(langCode) {
		for (var i in this.languages) {
			if (this.languages[i][0] === langCode) {
				return i;
			}
		}

		return false;
	};
	/**
	 * Change to other language. If new language does exits, this class trigger event "langchange", which
	 * is captured by scenes and snippets.
	 *
	 * @param {String} language code EN, AR etc.
	 * @returns {Boolean} returns true if operation sucessed or false
	 */
	Factory.prototype.changeLanguage = function(langCode) {
		if (!langCode)
			return false;
		this.locale = langCode;
		this.trigger("langchange", false, langCode);
		return true;
	};
	/*
	 * This functions tests, if the value contains Arabic signs
	 *
	 * @returns {Boolean}
	 */
	Factory.prototype.isArabic = function(value) {
		patt = /[\u0600-\u06FF\u0750-\u077F]/;
		return patt.test(value);
	};

	return new Factory();
})();