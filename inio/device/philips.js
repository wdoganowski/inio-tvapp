/**
 * Philips Inio Device
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device_Philips
 * @extends Inio_Device
 */
function Inio_Device_Philips() {
	Inio_Device.apply(this, arguments);
};

Inio_Device_Philips.prototype.__proto__ = Inio_Device.prototype;

/**
 * @property {Boolean} isPHILIPS Always TRUE when `Philips` driver is used
 */
Inio_Device_Philips.prototype.isPHILIPS = true;
/**
 * @inheritdoc Inio_Device#init
 */
Inio_Device_Philips.prototype.init = function(callback, cbscope) {
	var keys = this.getKeyMap();

	this.userAgentInfo = String(navigator.userAgent).match(/NETTV\/([\d\.\-\_]+)/);

	// on some newer versions, there is the green outline around focused element,
	// this prevent this outline from showing
	document.addEventListener('keydown', function(e) {
		var keyCode = e.keyCode;

		if (keyCode === keys.LEFT || keyCode === keys.RIGHT || keyCode === keys.UP || keyCode === keys.DOWN || keyCode === keys.RETURN) {
			e.preventDefault();
		}
	}, false);

	if (callback) {
		callback.call(cbscope || this);
	}
};
/**
 * @inheritdoc Inio_Device#getKeyMap
 */
Inio_Device_Philips.prototype.getKeyMap = function() {
	return {
		LEFT: VK_LEFT,
		RIGHT: VK_RIGHT,
		UP: VK_UP,
		DOWN: VK_DOWN,
		ENTER: VK_ENTER,
		RETURN: VK_BACK,
		ZERO: VK_0,
		ONE: VK_1,
		TWO: VK_2,
		THREE: VK_3,
		FOUR: VK_4,
		FIVE: VK_5,
		SIX: VK_6,
		SEVEN: VK_7,
		EIGHT: VK_8,
		NINE: VK_9,
		RED: VK_RED,
		GREEN: VK_GREEN,
		YELLOW: VK_YELLOW,
		BLUE: VK_BLUE,
		PLAY: VK_PLAY,
		PAUSE: VK_PAUSE,
		STOP: VK_STOP,
		REC: -1,
		FF: VK_FAST_FWD,
		RW: VK_REWIND,
		TOOLS: -1,
		PUP: VK_PAGE_UP,
		PDOWN: VK_PAGE_DOWN,
		CHLIST: -1,
		PRECH: -1,
		TXTMIX: -1,
		FAVCH: -1,
		EXIT: -1,
		INFO: VK_INFO
	};
};
/**
 * @inheritdoc Inio_Device#getFirmware
 */
Inio_Device_Philips.prototype.getFirmware = function() {
	return this.userAgentInfo[1] || false;
};
/**
 * @inheritdoc Inio_Device#getUID
 */
Inio_Device_Philips.prototype.getUID = function() {
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
Inio_Device_Philips.prototype.getIP = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#getDeviceName
 */
Inio_Device_Philips.prototype.getDeviceName = function(stripSpaces) {
	var name = 'Philips ' + this.getFirmware();

	if (stripSpaces) {
		name = name.replace(/\s/g, '');
	}

	return name;
};
/**
 * @inheritdoc Inio_Device#getCountry
 */
Inio_Device_Philips.prototype.getCountry = function() {
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
Inio_Device_Philips.prototype.getLanguage = function() {
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
Inio_Device_Philips.prototype.getDate = function() {
	return new Date();
};
/**
 * @inheritdoc Inio_Device#getTimeZoneOffset
 */
Inio_Device_Philips.prototype.getTimeZoneOffset = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#exit
 */
Inio_Device_Philips.prototype.exit = function(dvb) {
	window.close();
};
/**
 * @inheritdoc Inio_Device#checkNetworkConnection
 */
Inio_Device_Philips.prototype.checkNetworkConnection = function(callback, scope) {
	if (callback) {
		callback.call(scope || this, true);
	}

	return false;
};