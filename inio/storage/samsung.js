/**
 * Samsung Inio Storage
 *
 * @author Mautilus s.r.o.
 * @class Inio_Storage_Samsung
 * @extends Inio_Storage
 */
function Inio_Storage_Samsung() {
	Inio_Storage.apply(this, arguments);
};

Inio_Storage_Samsung.prototype.__proto__ = Inio_Storage.prototype;

/**
 * @inheritdoc Inio_Storage#init
 */
Inio_Storage_Samsung.prototype.init = function(config) {
	this.config = {
		useCookies: false
	};

	this.configure(config);

	if (!this.config.useCookies) {
		this.FS = new FileSystem();

		if (!this.FS.isValidCommonPath(curWidget.id)) {
			this.FS.createCommonDir(curWidget.id);
		}

		this.data = this.readData();
	}
};
/**
 * @private
 */
Inio_Storage_Samsung.prototype.readData = function() {
	var handle, data;

	try {
		handle = this.FS.openCommonFile(curWidget.id + '/userdata.dat', 'r');

		if (handle) {
			data = handle.readAll();

			this.FS.closeCommonFile(handle);

			data = JSON.parse(data);
		}

	} catch (e) {

	}

	return data || {};
};
/**
 * @private
 */
Inio_Storage_Samsung.prototype.writeData = function(data) {
	var handle;

	try {
		handle = this.FS.openCommonFile(curWidget.id + '/userdata.dat', 'w');

		if (handle) {
			handle.writeAll(JSON.stringify(data));
			this.FS.closeCommonFile(handle);
		}

	} catch (e) {
		return false;
	}

	return true;
};
/**
 * @inheritdoc Inio_Storage#set
 */
Inio_Storage_Samsung.prototype.set = function(name, value) {
	if (this.config.useCookies) {
		return this.setCookie(name, value);

	} else {
		this.data[name] = value;
		return this.writeData(this.data);
	}
};
/**
 * @inheritdoc Inio_Storage#setCookie
 */
Inio_Storage_Samsung.prototype.setCookie = function(name, value) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + 360);

	value = escape(JSON.stringify(value)) + '; expires=' + exdate.toUTCString();

	document.cookie = encodeURIComponent(name) + '=' + value;

	return true;
};
/**
 * @inheritdoc Inio_Storage#get
 */
Inio_Storage_Samsung.prototype.get = function(name) {
	if (this.config.useCookies) {
		return this.getCookie(name);

	} else {
		return this.data[name];
	}
};
/**
 * @inheritdoc Inio_Storage#getCookie
 */
Inio_Storage_Samsung.prototype.getCookie = function(name) {
	var value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || false;

	if (value !== false) {
		return JSON.parse(value);
	}

	return false;
};
/**
 * @inheritdoc Inio_Storage#clear
 */
Inio_Storage_Samsung.prototype.clear = function() {
	var cookie, eqPos, name;

	if (this.config.useCookies) {
		var cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			cookie = cookies[i];
			eqPos = cookie.indexOf('=');
			name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}

	} else {
		this.data = {};
		return this.writeData(this.data);
	}

	return false;
};