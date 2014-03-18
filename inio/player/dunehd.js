/**
 * Dune HD Inio Player, API video
 *
 * @author Mautilus s.r.o.
 * @class Inio_Player_Dunehd
 * @extends Inio_Player
 */
function Inio_Player_Dunehd() {
	Inio_Player.apply(this, arguments);
};

Inio_Player_Dunehd.prototype.__proto__ = Inio_Player.prototype;

/**
 * @inheritdoc Inio_Player#initNative
 */
Inio_Player_Dunehd.prototype.initNative = function() {
	var scope = this;

	this.API = Inio.device.API;

	this.ticker = setInterval(function() {
		scope.tick();
	}, 500);
};
/**
 * @inheritdoc Inio_Player#deinitNative
 */
Inio_Player_Dunehd.prototype.deinitNative = function() {

};
/**
 * @private
 */
Inio_Player_Dunehd.prototype.tick = function() {
	var pos = 0;

	if (this.url && this.API && this.API.hasLength()) {
		if (!this.duration && this.API.hasLength()) {
			this._onDurationChange(parseInt(this.API.getLengthInSeconds()) * 1000);
			this.state(this.STATE_PLAYING);

			if (this._showOnPlay) {
				this.native('show', this._showOnPlay);
				this._showOnPlay = null;
			}

			if (this._seekOnPlay) {
				this.native('seek', this._seekOnPlay);
				this._seekOnPlay = null;
			}
		}

		pos = Math.round((this.API.getPositionInSeconds() >> 0) * 1000);

		if (pos && pos !== this.currentTime) {
			this._onTimeUpdate(pos);
		}

		if (pos >= this.duration) {
			this._onEnd();
		}

	} else if (this.duration && this.API && !this.API.hasLength()) {
		this._onEnd();
		this.duration = 0;
	}
};
/**
 * @inheritdoc Inio_Player#native
 */
Inio_Player_Dunehd.prototype.native = function(cmd, attrs) {
	var url;

	if (cmd === 'play') {
		if (attrs && attrs.url) {
			url = this.url;

			console.network('PLAYER', this.url);

			this.API.play(url);
			this.state(this.STATE_BUFFERING);

		} else {
			this.API.resume();
		}

		if (attrs && attrs.position) {
			this._seekOnPlay = attrs.position;
		}

	} else if (cmd === 'pause') {
		this.API.pause();
		this.state(this.STATE_PAUSED);

		return;

	} else if (cmd === 'stop') {
		return this.API.stop();

	} else if (cmd === 'seek') {
		if (this.currentState === this.STATE_BUFFERING) {
			this._seekOnPlay = attrs.position;

		} else {
			this.API.setPositionInSeconds(Math.round(attrs.position / 1000));
			this.API.resume();
		}

		return true;

	} else if (cmd === 'playbackSpeed') {
		var speed;

		if (attrs.speed === 1) {
			speed = 256;

		} else if (attrs.speed === 4) {
			speed = 1024;

		} else if (attrs.speed === 8) {
			speed = 2048;

		} else if (attrs.speed === -4) {
			speed = -1024;

		} else if (attrs.speed === -8) {
			speed = -2048;

		} else {
			speed = 256;
		}

		return this.API.setSpeed(speed);

	} else if (cmd === 'show') {
		this.width = attrs.width || this.width;
		this.height = attrs.height || this.height;
		this.top = (typeof attrs.top !== 'undefined' ? attrs.top : this.top);
		this.left = (typeof attrs.left !== 'undefined' ? attrs.left : this.left);

		if (!this.duration) {
			this._showOnPlay = attrs;

		} else {
			this.API.setWindowRect(this.left, this.top, this.width, this.height);
		}

	} else if (cmd === 'hide') {


	} else if (cmd === 'setVideoDimensions') {
		// @todo: implement setVideoDimensions

	} else if (cmd === 'audioTrack') {
		this.API.setAudioTrack(attrs.index || 0);
	}
};
/**
 * @private
 */
Inio_Player_Dunehd.prototype.getESN = function() {
	return Inio.device.getUID() + '|60';
};