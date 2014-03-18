/**
 * Default Inio Storage
 *
 * @author Mautilus s.r.o.
 * @class Inio_Storage_Default
 * @extends Inio_Storage
 */
function Inio_Storage_Default() {
	Inio_Storage.apply(this, arguments);
};

Inio_Storage_Default.prototype.__proto__ = Inio_Storage.prototype;

/**
 * @inheritdoc Inio_Storage#set
 */
Inio_Storage_Default.prototype.set = function(name, value) {
	if (this.config.useCookies || !window.localStorage) {
		return this.setCookie(name, value);

	} else {
		return window.localStorage.setItem(name, this.encode(value));
	}
};
/**
 * @inheritdoc Inio_Storage#setCookie
 */
Inio_Storage_Default.prototype.setCookie = function(name, value) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + 360);

	value = escape(this.encode(value)) + '; expires=' + exdate.toUTCString();

	document.cookie = encodeURIComponent(name) + '=' + value;

	return true;
};
/**
 * @inheritdoc Inio_Storage#get
 */
Inio_Storage_Default.prototype.get = function(name) {
	var value;

	if (this.config.useCookies || !window.localStorage) {
		return this.getCookie(name);

	} else {
		value = window.localStorage.getItem(name);

		if (typeof value !== 'undefined') {
			return this.decode(value);
		}
	}
};
/**
 * @inheritdoc Inio_Storage#getCookie
 */
Inio_Storage_Default.prototype.getCookie = function(name) {
	var value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || false;

	if (value !== false) {
		return this.decode(value);
	}

	return false;
};
/**
 * @inheritdoc Inio_Storage#clear
 */
Inio_Storage_Default.prototype.clear = function() {
	var cookie, eqPos, name;

	if (this.config.useCookies || !window.localStorage) {
		var cookies = document.cookie.split(';');

		for (var i = 0; i < cookies.length; i++) {
			cookie = cookies[i];
			eqPos = cookie.indexOf('=');
			name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}

	} else {
		return window.localStorage.clear();
	}

	return false;
};