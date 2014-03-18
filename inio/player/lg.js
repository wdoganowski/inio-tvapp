/**
 * LG Inio Player
 *
 * @author Mautilus s.r.o.
 * @class Inio_Player_Lg
 * @extends Inio_Player
 */
function Inio_Player_Lg() {
	Inio_Player.apply(this, arguments);
};

Inio_Player_Lg.prototype.__proto__ = Inio_Player.prototype;

/**
 * @inheritdoc Inio_Player#initNative
 */
Inio_Player_Lg.prototype.initNative = function() {
	var scope = this;

	this.createPlayer();

	this.ticker = setInterval(function() {
		scope.tick();
	}, 500);
};
/**
 * @inheritdoc Inio_Player#deinitNative
 */
Inio_Player_Lg.prototype.deinitNative = function() {
	if (this.el && this.el.parentNode) {
		this.el.parentNode.removeChild(this.el);
	}
};
/**
 * @private
 */
Inio_Player_Lg.prototype.createPlayer = function(drm) {
	var scope = this;

	if (this.el) {
		this.deinitNative();
	}

	this.drm = drm || null;

	if (!this.wrapper) {
		this.wrapper = document.createElement('div');
		document.body.appendChild(this.wrapper);
	}

	this.wrapper.innerHTML = '<object class="Inio-player" type="application/x-netcast-av"' + (drm === 'widevine' ? ' drm_type="widevine"' : '') + ' data="" width="1280" height="720" style="width:1280px;height:720px;position:absolute;z-index:1;visibility:hidden"></object>' + '<object type="application/oipfDrmAgent" id="drmAgent" width="0" height="0" style="visibility:hidden"></object>';

	this.el = this.wrapper.childNodes[0];
	this.DRMagent = this.wrapper.childNodes[1];

	this.el.style.position = 'absolute';
	this.el.style.visibility = 'hidden';
	this.el.style.zIndex = 1;

	this.el.onPlayStateChange = function() {
		scope.onNativePlayStateChange();
	};
};
/**
 * @private
 */
Inio_Player_Lg.prototype.tick = function() {
	if (this.url && this.el && typeof this.el.playTime !== 'undefined') {
		if (!this.duration && this.el.playTime) {
			this.onDurationChange(this.el.playTime);
		}

		if (this.el.playPosition) {
			this.onTimeUpdate(this.el.playPosition);
		}
	}
};
/**
 * @inheritdoc Inio_Player#native
 */
Inio_Player_Lg.prototype.native = function(cmd, attrs) {
	var url, drmUrl, xml;

	if (cmd === 'play') {
		if (attrs && attrs.url) {
			url = this.url;

			console.network('PLAYER', this.url);

			if ((typeof url === 'object' && url && url.url) || String(url).match(/\.wvm/)) {
				// widevine
				if (this.drm !== 'widevine') {
					this.createPlayer('widevine');
					this.show();
				}

				if (typeof url !== 'object') {
					drmUrl = $.extend(true, {}, this.config.DRMconfig || {}, {
						url: url
					});

				} else {
					drmUrl = $.extend(true, {}, this.config.DRMconfig || {}, url);
					url = drmUrl.url;
				}

				this.el.setWidevineDrmURL(drmUrl.DRM_URL);

				if (this.customData) {
					this.el.setWidevineUserData(this.customData);
				}

				this.el.setWidevinePortalID(drmUrl.PORTAL);
				this.el.setWidevineDeviceType(60);
				this.el.setWidevineDeviceID(this.getESN());

			} else {
				// plain
				this.createPlayer();
				this.show();

				if (this.customData) {
					xml = '<?xml version="1.0" encoding="utf-8"?><PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/"><SetCustomData><CustomData>' + this.customData + '</CustomData></SetCustomData></PlayReadyInitiator>';

					this.DRMagent.onDRMMessageResult = function(a) {

					};

					this.DRMagent.onDRMRightsError = function(err) {
						console.error('DRMagent', err);
					};

					this.DRMagent.sendDRMMessage('application/vnd.ms-playready.initiator+xml', xml, 'urn:dvb:casystemid:19219');
				}
			}

			this.el.data = url;
		}

		this.el.play(1);

		if (attrs && attrs.position) {
			this._seekOnPlay = attrs.position;
		}

	} else if (cmd === 'pause') {
		return this.el.pause();

	} else if (cmd === 'stop') {
		return this.el.stop();

	} else if (cmd === 'seek') {
		if (this.currentState === this.STATE_BUFFERING) {
			this._seekOnPlay = attrs.position;

		} else {
			this.el.seek(attrs.position);
		}

		return true;

	} else if (cmd === 'playbackSpeed') {
		return this.el.play(attrs.speed);

	} else if (cmd === 'show') {
		this.width = attrs.width || this.width;
		this.height = attrs.height || this.height;
		this.top = (typeof attrs.top !== 'undefined' ? attrs.top : this.top);
		this.left = (typeof attrs.left !== 'undefined' ? attrs.left : this.left);

		this.el.style.visibility = 'visible';
		this.el.style.width = this.width + 'px';
		this.el.style.height = this.height + 'px';
		this.el.style.top = this.top + 'px';
		this.el.style.left = this.left + 'px';

	} else if (cmd === 'hide') {
		this.el.style.visibility = 'hidden';

	} else if (cmd === 'setVideoDimensions') {
		// @todo: implement setVideoDimensions

	} else if (cmd === 'audioTrack') {
		if (attrs.language) {
			this.el.audioLanguage = attrs.language;
		}
	}
};
/**
 * @private
 */
Inio_Player_Lg.prototype.getESN = function() {
	return Inio.device.getUID();
};
/**
 * @private
 */
Inio_Player_Lg.prototype.onNativePlayStateChange = function() {
	var state = this.el.playState;

	if (state === 0) {
		// stopped
		//this.onEnd();
		this.state(this.STATE_IDLE);

	} else if (state === 1) {
		// playing
		if (!this.duration && this.el.playTime) {
			this.onDurationChange(this.el.playTime);
		}

		this.state(this.STATE_PLAYING);

		if (this._seekOnPlay) {
			this.el.seek(this._seekOnPlay);
			this._seekOnPlay = 0;
		}

	} else if (state === 2) {
		// paused
		this.state(this.STATE_PAUSED);

	} else if (state === 3 || state === 4) {
		// connecting || buffering
		if (this.currentState !== this.STATE_BUFFERING) {
			this.state(this.STATE_BUFFERING);
		}

	} else if (state === 5) {
		// finished
		this.onEnd();

	} else if (state === 6) {
		// error
		this.onNativeError();
	}
};
/**
 * @private
 */
Inio_Player_Lg.prototype.onNativeError = function() {
	var code = this.el.error,
		msg = 'Unknown Error';

	if (code === 0) {
		msg = 'A/V format not supported';

	} else if (code === 1) {
		msg = 'Cannot connect to server or connection lost';

	} else if (code === 1000) {
		msg = 'File not found';

	} else if (code === 1002) {
		msg = 'DRM failure';
	}

	this.onError(code, msg);
};