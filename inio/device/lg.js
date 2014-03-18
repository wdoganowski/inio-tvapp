/**
 * LG Inio Device
 *
 * @author Mautilus s.r.o.
 * @class Inio_Device_Lg
 * @extends Inio_Device
 */
function Inio_Device_Lg() {
    Inio_Device.apply(this, arguments);
};

Inio_Device_Lg.prototype.__proto__ = Inio_Device.prototype;

/**
 * @property {Boolean} isLG Always TRUE when `Lg` driver is used
 */
Inio_Device_Lg.prototype.isLG = true;
/**
 * @inheritdoc Inio_Device#init
 */
Inio_Device_Lg.prototype.init = function(callback, scope) {
    var self = this;

    this.DEVICE = this.loadObject('DEVICE', 'application/x-netcast-info');

    if (callback) {
        callback.call(scope || this);
    }
};
/**
 * @inheritdoc Inio_Device#getKeyMap
 */
Inio_Device_Lg.prototype.getKeyMap = function() {
    return {
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40,
        ENTER: 13,
        RETURN: 461,
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
        RED: 403,
        GREEN: 404,
        YELLOW: 405,
        BLUE: 406,
        PLAY: 415,
        PAUSE: 19,
        STOP: 413,
        REC: 416,
        FF: 417,
        RW: 412,
        TOOLS: -1,
        PUP: 33,
        PDOWN: 34,
        CHLIST: -1,
        PRECH: -1,
        TXTMIX: -1,
        FAVCH: -1,
        EXIT: -1,
        INFO: 457
    };
};
/**
 * @inheritdoc Inio_Device#getFirmware
 */
Inio_Device_Lg.prototype.getFirmware = function() {
    return this.DEVICE.swVersion;
};
/**
 * @inheritdoc Inio_Device#getUID
 */
Inio_Device_Lg.prototype.getUID = function() {
    return String(this.DEVICE.net_macAddress).replace(/\:/g, '').toUpperCase();
};
/**
 * @inheritdoc Inio_Device#getIP
 */
Inio_Device_Lg.prototype.getIP = function() {
    return this.DEVICE.net_ipAddress;
};
/**
 * @inheritdoc Inio_Device#getDeviceName
 */
Inio_Device_Lg.prototype.getDeviceName = function(stripSpaces) {
    var name = this.DEVICE.manufacturer + ' ' + this.DEVICE.modelName;

    if (stripSpaces) {
        name = name.replace(/\s/g, '');
    }

    return name;
};
/**
 * @inheritdoc Inio_Device#getCountry
 */
Inio_Device_Lg.prototype.getCountry = function() {
    return String(this.DEVICE.tvCountry2 || 'en').toLowerCase();
};
/**
 * @inheritdoc Inio_Device#getLanguage
 */
Inio_Device_Lg.prototype.getLanguage = function() {
    return this.DEVICE.tvLanguage2 || 'en-us';
};
/**
 * @inheritdoc Inio_Device#getDate
 */
Inio_Device_Lg.prototype.getDate = function() {
    return new Date();
};
/**
 * @inheritdoc Inio_Device#getTimeZoneOffset
 */
Inio_Device_Lg.prototype.getTimeZoneOffset = function() {
    return this.DEVICE.timeZone;
};
/**
 * @inheritdoc Inio_Device#exit
 */
Inio_Device_Lg.prototype.exit = function(dvb) {
    if (dvb) {
        window.NetCastExit();

    } else {
        window.NetCastBack();
    }
};
/**
 * @inheritdoc Inio_Device#checkNetworkConnection
 */
Inio_Device_Lg.prototype.checkNetworkConnection = function(callback, scope) {
    if (callback) {
        callback.call(scope || this, this.DEVICE.net_isConnected || false);
    }
};
/**
 * Load specific OBJECT
 *
 * @private
 * @param {String} id
 * @param {String} clsid
 */
Inio_Device_Lg.prototype.loadObject = function(id, type) {
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
/**
 * Display Q.Menu
 */
Inio_Device_Lg.prototype.qmenu = function() {
    window.NetCastLaunchQMENU();
};