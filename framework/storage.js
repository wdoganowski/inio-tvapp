/**
 * Data Storage class
 *
 * @author Mautilus s.r.o.
 * @class Storage
 * @singleton
 * @mixins Events
 */
var Storage = (function() {
	function Factory() {
		Events.call(this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * Set value to the storage
	 *
	 * @param {String} name
	 * @param {Object/String/Number} value
	 * @returns {Boolean}
	 */
	Factory.prototype.set = function(name, value) {
		return Inio.storage.set(name, value);
	};
	/**
	 * Set cookie
	 *
	 * @param {String} name
	 * @param {Object/String/Number} value
	 * @returns {Boolean}
	 */
	Factory.prototype.setCookie = function(name, value) {
		return Inio.storage.setCookie(name, value);
	};
	/**
	 * Get value from the storage
	 *
	 * @param {String} name
	 * @returns {Object/String/Number} Returns FALSE if not found
	 */
	Factory.prototype.get = function(name) {
		return Inio.storage.get(name);
	};
	/**
	 * Get cookie
	 *
	 * @param {String} name
	 * @returns {Object/String/Number} Returns FALSE if not found
	 */
	Factory.prototype.getCookie = function(name) {
		return Inio.storage.getCookie(name);
	};
	/**
	 * Clear all stored data
	 *
	 * @returns {Boolean}
	 */
	Factory.prototype.clear = function() {
		return Inio.storage.clear();
	};

	return new Factory();
})();