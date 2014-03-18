/**
 * Default platform device
 *
 * @author Mautilus s.r.o.
 * @class Device
 * @singleton
 * @mixins Events
 */
var Device = (function() {
	function Factory() {
		Events.call(this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * Returns firmware version
	 *
	 * @returns {String}
	 */
	Factory.prototype.getFirmware = function() {
		return Inio.device.getFirmware();
	};
	/**
	 * Returns unique device ID (MAC address)
	 *
	 * @returns {String}
	 */
	Factory.prototype.getUID = function() {
		return Inio.device.getUID();
	};
	/**
	 * Returns device IP address
	 *
	 * @returns {String}
	 */
	Factory.prototype.getIP = function() {
		return Inio.device.getIP();
	};
	/**
	 * Returns device name and model code
	 *
	 * @param {Boolean} stripSpaces TRUE for strip empty chars
	 * @returns {String}
	 */
	Factory.prototype.getDeviceName = function(stripSpaces) {
		return Inio.device.getDeviceName(stripSpaces);
	};
	/**
	 * Returns device country
	 *
	 * @returns {String} Should be in ISO 3166-1 alpha-2 (cz, gb,...)
	 */
	Factory.prototype.getCountry = function() {
		return Inio.device.getCountry();
	};
	/**
	 * Returns device language
	 *
	 * @returns {String} Should be in ISO 639-1 (en-gb, cs-cz,...)
	 */
	Factory.prototype.getLanguage = function() {
		return Inio.device.getLanguage();
	};
	/**
	 * Returns new Date object
	 *
	 * @returns {Date}
	 */
	Factory.prototype.getDate = function() {
		return Inio.device.getDate();
	};
	/**
	 * Returns an time zone offset in minutes
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getTimeZoneOffset = function() {
		return Inio.device.getTimeZoneOffset();
	};
	/**
	 * Returns general device information in text format
	 *
	 * @returns {String}
	 */
	Factory.prototype.getInfo = function() {
		return "Platform:\t" + Inio.getPlatform().join(' ') + "\nName:\t\t" + this.getDeviceName() + "\nUID:\t\t" + this.getUID() + "\nIP address:\t" + this.getIP() + "\nFirmware:\t" + this.getFirmware() + "\nCountry:\t" + this.getCountry() + "\nLanguage:\t" + this.getLanguage() + "\nDate:\t\t" + this.getDate() + "\nLocation:\t" + window.location + "\nUserAgent:\t" + navigator.userAgent;
	};
	/**
	 * Returns platform model (year)
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getPlatformModel = function() {
		var platform = Inio.getPlatform();

		if (platform && platform[1]) {
			return platform[1] >> 0;

		} else {
			return 0;
		}
	};
	/**
	 * Fired when application is going do exit
	 *
	 * @param {Boolean} [dvb=false] TRUE for exit to DVB, FALSE for SmartHUB
	 */
	Factory.prototype.exit = function(dvb) {
		return Inio.device.exit(dvb);
	};
	/**
	 * Check if network connection is up
	 *
	 * @param {Function} callback
	 * @param {Object} scope
	 */
	Factory.prototype.checkNetworkConnection = function(callback, scope) {
		return Inio.device.checkNetworkConnection(callback, scope);
	};

	return new Factory();

})();