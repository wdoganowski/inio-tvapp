/**
 * Dune HD Inio Device
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device_Dunehd
 * @extends Inio_Device
 */
function Inio_Device_Dunehd() {
	Inio_Device.apply(this, arguments);
};

Inio_Device_Dunehd.prototype.__proto__ = Inio_Device.prototype;

/**
 * @property {Boolean} isDUNEHD Always TRUE when `Dune HD` driver is used
 */
Inio_Device_Dunehd.prototype.isDUNEHD = true;
/**
 * @inheritdoc Inio_Device#init
 */
Inio_Device_Dunehd.prototype.init = function(callback, scope) {
	var self = this;

	this.API = this.loadObject('STBAPI', 'application/x-dune-stb-api');

	if (typeof this.API.init !== 'function') {
		throw new Error('STB API initialization failed');
	}

	this.API.setScreenSize(this.API.SCREEN_SIZE_1280_720);

	this.API.init();

	window.onunload = function() {
		self.API.deinit();
	};

	//this.API.launchNativeUiExt('setup://network:::standalone=1');

	if (callback) {
		callback.call(scope || this);
	}
};
/**
 * @inheritdoc Inio_Device#getKeyMap
 */
Inio_Device_Dunehd.prototype.getKeyMap = function() {
	return {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		ENTER: 13,
		RETURN: 8,
		ZERO: 48,
		ONE: 49,
		TWO: 50,
		THREE: 51,
		FOUR: 52,
		FIVE: 53,
		SIX: 54,
		SEVEN: 55,
		EIGHT: 56,
		NINE: 57,
		RED: 193,
		GREEN: 194,
		YELLOW: 195,
		BLUE: 196,
		PLAY: 250,
		PAUSE: -1,
		PLAYPAUSE: 218,
		STOP: 178,
		REC: 208,
		FF: 205,
		RW: 204,
		TOOLS: -1,
		PUP: 33,
		PDOWN: 34,
		CHLIST: -1,
		PRECH: -1,
		TXTMIX: -1,
		FAVCH: -1,
		EXIT: -1,
		INFO: 199
	};
};
/**
 * @inheritdoc Inio_Device#getFirmware
 */
Inio_Device_Dunehd.prototype.getFirmware = function() {
	return this.API.getFirmwareVersion();
};
/**
 * @inheritdoc Inio_Device#getUID
 */
Inio_Device_Dunehd.prototype.getUID = function() {
	return String(this.API.getMacAddress()).replace(/\:/g, '').toUpperCase();
};
/**
 * @inheritdoc Inio_Device#getIP
 */
Inio_Device_Dunehd.prototype.getIP = function() {
	return this.API.getIpAddress();
};
/**
 * @inheritdoc Inio_Device#getDeviceName
 */
Inio_Device_Dunehd.prototype.getDeviceName = function(stripSpaces) {
	var name = 'Dune HD ' + this.API.getProductId();

	if (stripSpaces) {
		name = name.replace(/\s/g, '');
	}

	return name;
};
/**
 * @inheritdoc Inio_Device#getCountry
 */
Inio_Device_Dunehd.prototype.getCountry = function() {
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
Inio_Device_Dunehd.prototype.getLanguage = function() {
	return String(navigator.language || navigator.userLanguage).toLowerCase();
};
/**
 * @inheritdoc Inio_Device#getDate
 */
Inio_Device_Dunehd.prototype.getDate = function() {
	return new Date();
};
/**
 * @inheritdoc Inio_Device#getTimeZoneOffset
 */
Inio_Device_Dunehd.prototype.getTimeZoneOffset = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#exit
 */
Inio_Device_Dunehd.prototype.exit = function(dvb) {
	this.API.exitBrowser(this.API.EXIT_BROWSER_MODE_STANDBY);
};
/**
 * @inheritdoc Inio_Device#checkNetworkConnection
 */
Inio_Device_Dunehd.prototype.checkNetworkConnection = function(callback, scope) {
	var network = this.API.getNetworkStatus(),
		status = false;

	try {
		if (typeof network !== 'object') {
			eval('network = ' + network);
		}
	} catch (e) {

	}

	if (network instanceof Array && network) {
		for (var i in network) {
			if (network[i] && network[i].running === 1) {
				status = true;
				break;
			}
		}
	}

	if (callback) {
		callback.call(scope || this, status);
	}
};
/**
 * Load specific OBJECT
 *
 * @private
 * @param {String} id
 * @param {String} clsid
 */
Inio_Device_Dunehd.prototype.loadObject = function(id, type) {
	var objs = document.getElementsByTagName('object');

	if (objs) {
		for (var i in objs) {
			if (objs[i] && objs[i].id === id) {
				return objs[i];
			}
		}
	}

	var obj = document.createElement('object');
	obj.id = id;
	obj.style.visibility = 'hidden';
	obj.setAttribute('type', type);

	document.body.appendChild(obj);

	return obj;
};