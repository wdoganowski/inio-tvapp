/**
 * Samsung Inio Player
 *
 * @author Mautilus s.r.o.
 * @class Inio_Player_Samsung
 * @extends Inio_Player
 */
function Inio_Player_Samsung() {
	Inio_Player.apply(this, arguments);
};

Inio_Player_Samsung.prototype.__proto__ = Inio_Player.prototype;

/**
 * @inheritdoc Inio_Player#initNative
 */
Inio_Player_Samsung.prototype.initNative = function() {
	this.el = Inio.device.SEFPLAYER;

	this.el.OnEvent = Inio.bind(this.onEvent, this);
	this.el.Open('Player', '0001', 'InitPlayer');
};
/**
 * @inheritdoc Inio_Player#deinitNative
 */
Inio_Player_Samsung.prototype.deinitNative = function() {
	if (this.el) {
		this.el.Execute("Stop");
		this.el.Close();
	}
};
/**
 * @inheritdoc Inio_Player#native
 */
Inio_Player_Samsung.prototype.native = function(cmd, attrs) {
	var url;

	if (cmd === 'play') {
		if (attrs && attrs.url) {
			this.el.Execute("Stop");

			url = this.prepareUrl(this.url);

			console.network('PLAYER', url);

			this.el.Execute("InitPlayer", url);

			if (this.customData) {
				// set DRM custom data
				this.el.Execute("SetPlayerProperty", "3", this.customData, this.customData.length);
			}
		}

		if (attrs && attrs.position) {
			// StartPlayback takes position in seconds
			this.el.Execute("StartPlayback", parseFloat(attrs.position, 10) / 1000);

		} else {
			this.el.Execute("StartPlayback", 0);
		}

		this.state(this.STATE_PLAYING);
		return true;

	} else if (cmd === 'pause') {
		this.el.Execute("Pause");
		this.state(this.STATE_PAUSED);
		return true;

	} else if (cmd === 'stop') {
		return this.el.Execute("Stop");

	} else if (cmd === 'seek') {
		var position = Math.round((attrs.position - this.currentTime) / 1000);

		if (attrs.position === 0) {
			this.el.Execute("JumpBackward", Math.round(this.currentTime / 1000));

		} else if (position >= 0) {
			this.el.Execute("JumpForward", position);

		} else {
			this.el.Execute("JumpBackward", position * -1);
		}

		return true;

	} else if (cmd === 'playbackSpeed') {
		return this.el.Execute("SetPlaybackSpeed", attrs.speed);

	} else if (cmd === 'show') {
		this.width = attrs.width || this.width;
		this.height = attrs.height || this.height;
		this.top = (typeof attrs.top !== 'undefined' ? attrs.top : this.top);
		this.left = (typeof attrs.left !== 'undefined' ? attrs.left : this.left);

		this.el.style.visibility = 'visible';

		this.el.Execute('SetDisplayArea', Math.round(this.left / 1.333), Math.round(this.top / 1.333), Math.round(this.width / 1.333), Math.round(this.height / 1.333));

	} else if (cmd === 'hide') {
		// stop clears the screen
		this.el.Execute("Stop");

		this.el.style.visibility = 'hidden';

		if (Inio.device.PLUGIN && Inio.device.PLUGIN.setOffScreenSaver) {
			Inio.device.PLUGIN.setOffScreenSaver();
		}

	} else if (cmd === 'setVideoDimensions') {
		var h;

		if (attrs.height === 720) {
			h = Math.round((this.height / attrs.height) * attrs.width);
			this.el.Execute('SetDisplayArea', Math.round(((this.width - h) / 2) / 1.333), 0, Math.round(h / 1.333), 540);

		} else {
			h = Math.round((this.width / attrs.width) * attrs.height);
			this.el.Execute('SetDisplayArea', 0, Math.round(((this.height - h) / 2) / 1.333), 960, Math.round(h / 1.333));
		}

	} else if (cmd === 'audioTrack') {
		if (!this.duration) {
			this.one('durationchange', function() {
				this.el.Execute("SetStreamID", 1, attrs.index || 0);
			}, this);

			return;
		}
		return this.el.Execute("SetStreamID", 1, attrs.index || 0);

	} else if (cmd === 'mute') {
		// http://www.samsungdforum.com/Guide/ref00014/sef_plugin_audio.html
		Inio.device.AUDIO.Execute("SetSystemMute", 1);

	} else if (cmd === 'unmute') {
		Inio.device.AUDIO.Execute("SetSystemMute", 0);
	}
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.prepareUrl = function(url) {
	if (typeof url === 'object' && url.url) {
		return this.prepareUrlWidevine(url);
	}

	if (url.match(/\.wvm/) && !url.match(/\|COMPONENT\=WV/)) {
		return this.prepareUrlWidevine(Inio.extend({}, this.config.DRMconfig || {}, {
			url: url
		}));

	} else if (url.match(/\.m3u8/) && !url.match(/\|COMPONENT\=HLS/)) {
		url += '|COMPONENT=HLS';

	} else if (this.customData && !url.match(/\|COMPONENT\=/)) {
		url += '|COMPONENT=WMDRM';
	}

	return url;
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.prepareUrlWidevine = function(opts) {
	var url = String(opts.url);

	var optsStr = [];
	var defaults = {
		'DEVICE_ID': this.getESN(),
		'DEVICE_TYPE_ID': 60,
		'COMPONENT': 'WV'
	};

	opts = Inio.extend({}, defaults, this.config.DRMconfig || {}, opts);

	if (this.customData) {
		opts.USER_DATA = this.customData;
	}

	$.each(opts, function(k, v) {
		if (k !== 'url') {
			optsStr.push(k + '=' + v);
		}
	});

	return url + '|' + optsStr.join('|');
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.getESN = function() {
	var deviceId = null;

	try {
		deviceId = Inio.device.EXTERNALWIDGET.GetESN("WIDEVINE");

	} catch (e) {
		return false;
	}

	return deviceId;
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.onEvent = function(eventCode, param) {
	if (eventCode === 1 || eventCode === 2) {
		// 2 = OnAuthenticationFailed
		this.OnConnectionFailed();

	} else if (eventCode === 3) {
		this.OnStreamNotFound();

	} else if (eventCode === 4) {
		this.OnNetworkDisconnected();

	} else if (eventCode === 6) {
		this.OnRenderError(param);

	} else if (eventCode === 9) {
		this.OnStreamInfoReady();

		try {
			console.info("Player Info >>>\n" + " URL: " + this.prepareUrl(this.url) + "\n" + " Duration: " + this.el.Execute('GetDuration') + "\n" + " Resolution: " + this.el.Execute('GetVideoResolution') + "\n" + " Bitrates: " + this.el.Execute('GetAvailableBitrates') + "\n" + " Audio tracks: " + this.el.Execute('GetTotalNumOfStreamID', 1) + "\n" + " Subtitle tracks: " + this.el.Execute('GetTotalNumOfStreamID', 5));

		} catch (e) {

		}

	} else if (eventCode === 11) {
		this.OnBufferingStart();

	} else if (eventCode === 12) {
		this.OnBufferingComplete();

	} else if (eventCode === 14) {
		this.OnCurrentPlayTime(param);

	} else if (eventCode === 100) {
		this.OnDRMError(param);
	}
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnBufferingStart = function() {
	this.state(this.STATE_BUFFERING);
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnBufferingComplete = function() {
	this.state(this.prevState !== this.STATE_BUFFERING ? this.prevState : this.STATE_PLAYING);
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnCurrentPlayTime = function(time) {
	this._onTimeUpdate(time);

	if (this.duration && this.looping && time >= this.duration - 1200) {
		// stop 1.2s before its end, because it solves hang issue while looping
		this._onEnd();

	} else if (this.duration && time >= this.duration) {
		this._onEnd();
	}
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnStreamInfoReady = function() {
	this._onDurationChange(this.el.Execute('GetDuration'));
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnStreamNotFound = function() {
	this._onError(1, 'not_found');
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnNetworkDisconnected = function() {
	this._onError(2, 'connection');
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnConnectionFailed = function() {
	this._onError(2, 'connection');
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnRenderError = function(errorCode) {
	var msg = '';

	if (errorCode === 1) {
		msg = 'Unsupported container';
	} else if (errorCode === 2) {
		msg = 'Unsupported video codec';
	} else if (errorCode === 3) {
		msg = 'Unsupported audio codec';
	} else if (errorCode === 6) {
		msg = 'Corrupted stream';
	}

	this._onError(3, 'render', msg);
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnDRMError = function() {
	this._onError(4, 'drm');
};
/**
 * @private
 */
Inio_Player_Samsung.prototype.OnCustomEvent = function(code) {
	this._onError(code, 'custom');
};