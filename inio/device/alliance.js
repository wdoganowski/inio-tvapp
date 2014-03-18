/**
 * Smart TV Alliance Inio Device
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device_Alliance
 * @extends Inio_Device
 */
function Inio_Device_Alliance() {
	Inio_Device.apply(this, arguments);
};

Inio_Device_Alliance.prototype.__proto__ = Inio_Device.prototype;

/**
 * @property {Boolean} isALLIANCE Always TRUE when `Alliance` driver is used
 */
Inio_Device_Alliance.prototype.isALLIANCE = true;
/**
 * @property {Object} oipfAppMgr OIPF App Mgr object
 */
Inio_Device_Alliance.prototype.oipfAppMgr = null;
/**
 * @property {Object} oipfConfig OIPF Configuration object
 */
Inio_Device_Alliance.prototype.oipfConfig = null;
/**
 * @property {Object} oipfDrmAgent OIPF DRMAgent object
 */
Inio_Device_Alliance.prototype.oipfDrmAgent = null;
/**
 * @property {Object} app OIPF ownerApplication
 */
Inio_Device_Alliance.prototype.app = null;
/**
 * @inheritdoc Inio_Device#init
 */
Inio_Device_Alliance.prototype.init = function(callback, cbscope) {
	var scope = this,
		checkOipf, keyset;

	this.userAgentInfo = String(navigator.userAgent).match(/(toshibatp|smarttv)\/([\d\.\-\_]+)/i);

	checkOipf = function() {
		if (typeof oipfObjectFactory !== 'undefined') {
			scope.initOipfObjects();

			scope.app = scope.oipfAppMgr.getOwnerApplication(document);

			keyset = scope.app.privateData.keyset;

			keyset.setValue(keyset.NAVIGATION | keyset.VCR | keyset.SCROLL | keyset.INFO | keyset.NUMERIC | keyset.RED | keyset.GREEN | keyset.YELLOW | keyset.BLUE);

			if (callback) {
				callback.call(cbscope || scope);
			}

			return;
		}

		setTimeout(function() {
			checkOipf();
		}, 50);
	};

	checkOipf();

	// prevent default actions
	document.addEventListener('keydown', function(e) {
		e.preventDefault();
	}, false);
};
/**
 * @private
 */
Inio_Device_Alliance.prototype.initOipfObjects = function() {
	if (oipfObjectFactory.isObjectSupported('application/oipfApplicationManager')) {
		this.oipfAppMgr = oipfObjectFactory.createApplicationManagerObject();
	}

	if (oipfObjectFactory.isObjectSupported('application/oipfConfiguration')) {
		this.oipfConfig = oipfObjectFactory.createConfigurationObject();
	}

	if (oipfObjectFactory.isObjectSupported('application/oipfDrmAgent')) {
		this.oipfDrmAgent = oipfObjectFactory.createDrmAgentObject();
	}

	if (!this.oipfAppMgr || typeof this.oipfAppMgr.getOwnerApplication === 'undefined') {
		throw new Error('Failed to load oipfApplicationManager object');
	}
};
/**
 * @inheritdoc Inio_Device#getKeyMap
 */
Inio_Device_Alliance.prototype.getKeyMap = function() {
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
Inio_Device_Alliance.prototype.getFirmware = function() {
	return this.userAgentInfo ? this.userAgentInfo[2] : false;
};
/**
 * @inheritdoc Inio_Device#getUID
 */
Inio_Device_Alliance.prototype.getUID = function() {
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
Inio_Device_Alliance.prototype.getIP = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#getDeviceName
 */
Inio_Device_Alliance.prototype.getDeviceName = function(stripSpaces) {
	var name = 'SmartTv',
		m;

	m = navigator.userAgent.match(/(toshiba|SmartTv)/i);

	if (m && m[1]) {
		name = m[1];
	}

	name += ' ' + this.getFirmware();

	if (stripSpaces) {
		name = name.replace(/\s/g, '');
	}

	return name;
};
/**
 * @inheritdoc Inio_Device#getCountry
 */
Inio_Device_Alliance.prototype.getCountry = function() {
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
Inio_Device_Alliance.prototype.getLanguage = function() {
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
Inio_Device_Alliance.prototype.getDate = function() {
	return new Date();
};
/**
 * @inheritdoc Inio_Device#getTimeZoneOffset
 */
Inio_Device_Alliance.prototype.getTimeZoneOffset = function() {
	return false;
};
/**
 * @inheritdoc Inio_Device#exit
 */
Inio_Device_Alliance.prototype.exit = function(dvb) {
	window.close();
};
/**
 * @inheritdoc Inio_Device#checkNetworkConnection
 */
Inio_Device_Alliance.prototype.checkNetworkConnection = function(callback, scope) {
	if (callback) {
		callback.call(scope || this, true);
	}

	return false;
};