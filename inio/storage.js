/**
 * Inio Storage / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Storage
 */
function Inio_Storage() {
    this.init.apply(this, arguments);
};

/**
 * Initialize Player
 *
 * @param {Object} config
 */
Inio_Storage.prototype.init = function(config) {
    this.config = {
        /**
         * @cfg {Boolean} useCookies Whether to always use cookie or not
         */
        useCookies: false,
        /**
         * @cfg {Boolean} useJSON Whether to encode stored data in JSON
         */
        useJSON: true
    };

    this.configure(config);
};
/**
 * Set class config hash
 *
 * @param {Object} config Hash of parameters
 */
Inio_Storage.prototype.configure = function(config) {
    this.config = Inio.extend(this.config || {}, config);
};
/**
 * Set value to the storage
 *
 * @param {String} name
 * @param {Object/String/Number} value
 * @returns {Boolean}
 */
Inio_Storage.prototype.set = function(name, value) {

};
/**
 * Set cookie
 *
 * @param {String} name
 * @param {Object/String/Number} value
 * @returns {Boolean}
 */
Inio_Storage.prototype.setCookie = function(name, value) {

};
/**
 * Get value from the storage
 *
 * @param {String} name
 * @returns {Object/String/Number} Returns FALSE if not found
 */
Inio_Storage.prototype.get = function(name) {

};
/**
 * Get cookie
 *
 * @param {String} name
 * @returns {Object/String/Number} Returns FALSE if not found
 */
Inio_Storage.prototype.getCookie = function(name) {

};
/**
 * Clear all stored data
 *
 * @returns {Boolean}
 */
Inio_Storage.prototype.clear = function() {

};
/**
 * Encode data before they are stored
 *
 * @param {Mixed} data
 * @returns {Mixed}
 */
Inio_Storage.prototype.encode = function(data) {
    if (this.config.useJSON) {
        return JSON.stringify(data);
    }

    return data;
};
/**
 * Decode data when they are retreived from storage
 *
 * @param {Mixed} data
 * @returns {Mixed}
 */
Inio_Storage.prototype.decode = function(data) {
    if (this.config.useJSON) {
        return JSON.parse(data);
    }

    return data;
};