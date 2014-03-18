/**
 * Inio Device / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device
 * @singleton
 */
function Inio_Device() {

};

/**
 * Initialize device
 *
 * @param {Function} callback
 * @param {Object} scope
 */
Inio_Device.prototype.init = function(callback, cbscope) {};
/**
 * Get all available key codes
 *
 * @returns {Object} Hash map
 */
Inio_Device.prototype.getKeyMap = function() {};
/**
 * Returns firmware version
 *
 * @returns {String}
 */
Inio_Device.prototype.getFirmware = function() {};
/**
 * Returns unique device ID (MAC address)
 *
 * @returns {String}
 */
Inio_Device.prototype.getUID = function() {};
/**
 * Returns device IP address
 *
 * @returns {String}
 */
Inio_Device.prototype.getIP = function() {};
/**
 * Returns device name and model code
 *
 * @param {Boolean} stripSpaces TRUE for strip empty chars
 * @returns {String}
 */
Inio_Device.prototype.getDeviceName = function(stripSpaces) {};
/**
 * Returns device country
 *
 * @returns {String} Should be in ISO 3166-1 alpha-2 (cz, gb,...)
 */
Inio_Device.prototype.getCountry = function() {};
/**
 * Returns device language
 *
 * @returns {String} Should be in ISO 639-1 (en-gb, cs-cz,...)
 */
Inio_Device.prototype.getLanguage = function() {};
/**
 * Returns new Date object
 *
 * @returns {Date}
 */
Inio_Device.prototype.getDate = function() {};
/**
 * Returns an time zone offset in minutes
 *
 * @returns {Number}
 */
Inio_Device.prototype.getTimeZoneOffset = function() {};
/**
 * Fired when application is going do exit
 *
 * @param {Boolean} [dvb=false] TRUE for exit to DVB, FALSE for SmartHUB
 */
Inio_Device.prototype.exit = function(dvb) {};
/**
 * Check if network connection is up
 *
 * @param {Function} callback
 * @param {Object} scope
 */
Inio_Device.prototype.checkNetworkConnection = function(callback, scope) {};