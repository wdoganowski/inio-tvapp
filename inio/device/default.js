/**
 * Default Inio Device
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device_Default
 * @extends Inio_Device
 */
function Inio_Device_Default() {
	Inio_Device.apply(this, arguments);
};

Inio_Device_Default.prototype.__proto__ = Inio_Device.prototype;

/**
 * @property {Boolean} isDEFAULT Always TRUE when `Default` driver is used
 */
Inio_Device_Default.prototype.isDEFAULT = true;
/**
 * @inheritdoc Inio_Device#init
 */
Inio_Device_Default.prototype.init = function(callback, scope) {
	this.userAgentInfo = String(navigator.userAgent).match(/((chrome|firefox|opera)\/([\d\.\-\_]+))/i);

	if (callback) {
		callback.call(scope || this);
	}
};
/**
 * @inheritdoc Inio_Device#getKeyMap
 */
Inio_Device_Default.prototype.getKeyMap = function() {
	return {
		RIGHT: 39,
		LEFT: 37,
		UP: 38,
		DOWN: 40,
		RETURN: 8,
		ENTER: 13,
		PLAY: 415,
		PAUSE: 19,
		STOP: 413,
		FF: 417,
		RW: 412,
		RED: 403,
		GREEN: 404,
		YELLOW: 405,
		BLUE: 406,
		ZERO: 96,
		ONE: 97,
		TWO: 98,
		THREE: 99,
		FOUR: 100,
		FIVE: 101,
		SIX: 102,
		SEVEN: 103,
		EIGHT: 104,
		NINE: 105,
		PUP: 33,
		PDOWN: 34,
		PRECH: 46, // Delete
		TXTMIX: 110 // ,Del
	};
};
/**
 * @inheritdoc Inio_Device#getFirmware
 */
Inio_Device_Default.prototype.getFirmware = function() {
	return this.userAgentInfo[1] || false;
};
/**
 * @inheritdoc Inio_Device#getUID
 */
Inio_Device_Default.prototype.getUID = function() {
	var getUUID = function(a) {
		return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getUUID);
	}, uuid;

	if (window.localStorage) {
		uuid = window.localStorage.getItem('_uuid');

		if (uuid) {
			return uuid;
		}
	}

	uuid = getUUID();

	if (window.localStorage) {
		window.localStorage.setItem('_uuid', uuid);
	}

	return uuid;
};
/**
 * @inheritdoc Inio_Device#getIP
 */
Inio_Device_Default.prototype.getIP = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#getDeviceName
 */
Inio_Device_Default.prototype.getDeviceName = function(stripSpaces) {
	var name = this.getFirmware();

	if (stripSpaces) {
		name = name.replace(/\s/g, '');
	}

	return name;
};
/**
 * @inheritdoc Inio_Device#getCountry
 */
Inio_Device_Default.prototype.getCountry = function() {
	var country = null;

	try {
		country = String(window.navigator.language).toLowerCase().split('-')[1];

	} catch (e) {

	}

	return country;
};
/**
 * @inheritdoc Inio_Device#getLanguage
 */
Inio_Device_Default.prototype.getLanguage = function() {
	var language = null;

	try {
		language = String(window.navigator.language).toLowerCase();

	} catch (e) {

	}

	return language;
};
/**
 * @inheritdoc Inio_Device#getDate
 */
Inio_Device_Default.prototype.getDate = function() {
	return new Date();
};
/**
 * @inheritdoc Inio_Device#getTimeZoneOffset
 */
Inio_Device_Default.prototype.getTimeZoneOffset = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#exit
 */
Inio_Device_Default.prototype.exit = function(dvb) {
	window.close();
};
/**
 * @inheritdoc Inio_Device#checkNetworkConnection
 */
Inio_Device_Default.prototype.checkNetworkConnection = function(callback, scope) {
	if (callback) {
		callback.call(scope || this, true);
	}

	return false;
};