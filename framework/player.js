/**
 * Media Player
 *
 * @author Mautilus s.r.o.
 * @class Player
 * @singleton
 * @mixins Events
 */
var Player = (function() {
	function Factory() {
		Events.call(this);

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;

	/**
	 * @property {Number} STATE_IDLE
	 */
	Factory.prototype.STATE_IDLE = -1;
	Factory.prototype.STATE_PENDING = -1; // alias for STATE_IDLE
	/**
	 * @property {Number} STATE_BUFFERING
	 */
	Factory.prototype.STATE_BUFFERING = 0;
	/**
	 * @property {Number} STATE_PLAYING
	 */
	Factory.prototype.STATE_PLAYING = 1;
	/**
	 * @property {Number} STATE_PAUSED
	 */
	Factory.prototype.STATE_PAUSED = 2;
	/**
	 * @event durationchange
	 * When duration is changed
	 * @param {Number} duration [ms]
	 */

	/**
	 * @event timeupdate
	 * When playback time (current position) is changed
	 * @param {Number} currentTime [ms]
	 */

	/**
	 * @event end
	 * When playback ends
	 * @param {Number} currentTime [ms] Should be same as duration
	 */

	/**
	 * @event error
	 * When error is detected
	 * @param {Number} code System error code
	 * @param {String} msg Error message
	 * @param {Number/String} details Error details from native API (if available)
	 */

	/**
	 * @event statechange
	 * When playback state has changed
	 * @param {Number} currentState One of possible states (STATE_IDLE, STATE_BUFFERING, STATE_PLAYING, STATE_PAUSED)
	 */

	/**
	 * @event reset
	 * When player configuration and properties are nulled
	 */

	/**
	 * @event show
	 * When player elemenent is shown
	 */

	/**
	 * @event hide
	 * When player elemenent is hidden
	 */

	/**
	 * @event url
	 * When URL is set, before playback starts
	 * @param {String} url URL address
	 */

	/**
	 * @event play
	 * When playback starts
	 * @param {String} url URL address
	 * @param {Number} position Resume position
	 */

	/**
	 * @event pause
	 * When playback is paused
	 */

	/**
	 * @event stop
	 * When playback stops
	 * @param {Number} currentTime [ms]
	 */

	/**
	 * @event seek
	 * When seek is requested
	 * @param {Number} position [ms] Seek position
	 */

	/**
	 * @event playbackspeed
	 * When playback speed is changed
	 * @param {Number} speed 1..8
	 */

	/**
	 * @event seek-start
	 * Seek stared
	 */

	/**
	 * @event seek-end
	 * Seek ended
	 */

	/**
	 * @event customdata
	 * When DRM custom data are set
	 * @param {Object} customData
	 */

	/**
	 * Initialize Player
	 */
	Factory.prototype.init = function() {
		var scope = this;

		Inio.player.onDurationChange = function(duration) {
			scope.trigger('durationchange', duration);
		};

		Inio.player.onTimeUpdate = function(time) {
			scope.trigger('timeupdate', time);
		};

		Inio.player.onEnd = function(time) {
			scope.trigger('end', time);
		};

		Inio.player.onError = function(code, msg, details) {
			scope.trigger('error', code, msg, details);
		};

		Inio.player.onStateChange = function(state) {
			scope.trigger('statechange', state);
		};

		Inio.player.onReset = function() {
			scope.trigger('reset');
		};

		Inio.player.onShow = function() {
			scope.trigger('show');
		};

		Inio.player.onHide = function() {
			scope.trigger('hide');
		};

		Inio.player.onUrl = function(url) {
			scope.trigger('url', url);
		};

		Inio.player.onCustomData = function(customData) {
			scope.trigger('customdata', customData);
		};

		Inio.player.onPlay = function(url, position) {
			scope.trigger('play', url, position);
		};

		Inio.player.onPause = function() {
			scope.trigger('pause');
		};

		Inio.player.onStop = function(time) {
			scope.trigger('stop', time);
		};

		Inio.player.onSeek = function(time) {
			scope.startSeek();
			scope.trigger('seek', time);
		};

		Inio.player.onPlaybackSpeed = function(speed) {
			scope.trigger('playbackspeed', speed);
		};
	};
	/**
	 * Reset all states and properties
	 */
	Factory.prototype.reset = function() {
		return Inio.player.reset();
	};
	/**
	 * Show player and set it's position
	 *
	 * @param {Number} [width]
	 * @param {Number} [height]
	 * @param {Number} [left]
	 * @param {Number} [top]
	 */
	Factory.prototype.show = function(width, height, left, top) {
		return Inio.player.show(width, height, left, top);
	};
	/**
	 * Hide player
	 */
	Factory.prototype.hide = function() {
		return Inio.player.hide();
	};
	/**
	 * Show on fullscreen
	 */
	Factory.prototype.fullscreen = function() {
		return Inio.player.show(1280, 720, 0, 0);
	};
	/**
	 * Setu custom data for widevine/playready DRM
	 *
	 * @param {String} customData
	 */
	Factory.prototype.setCustomData = function(customData) {
		return Inio.player.setCustomData(customData);
	};
	/**
	 * Start playback
	 *
	 * @param {String} [url]
	 * @param {Number} [position] Seek position (ms)
	 * @param {Boolean} [looping]
	 */
	Factory.prototype.play = function(url, position, looping) {
		return Inio.player.play(url, position, looping);
	};
	/**
	 * Pause playback
	 */
	Factory.prototype.pause = function() {
		return Inio.player.pause();
	};
	/**
	 * Stop playback and reset player
	 */
	Factory.prototype.stop = function() {
		return Inio.player.stop();
	};
	/**
	 * Seek playback
	 *
	 * @param {Number} position Time position (ms)
	 */
	Factory.prototype.seek = function(position) {
		return Inio.player.seek(position);
	};
	/**
	 * Fast Forward
	 *
	 * @param {Number/String} skip Skip time (ms or %)
	 */
	Factory.prototype.forward = function(skip) {
		return Inio.player.forward(skip);
	};
	/**
	 * Fast Backward
	 *
	 * @param {Number/String} skip Skip time (ms or %)
	 */
	Factory.prototype.backward = function(skip) {
		return Inio.player.backward(skip);
	};
	/**
	 * Set playback speed
	 *
	 * @param {Number} speed
	 */
	Factory.prototype.playbackSpeed = function(speed) {
		return Inio.player.playbackSpeed(speed);
	};
	/**
	 * Set video dimensions
	 *
	 * @param {Number} width
	 * @param {Number} height
	 */
	Factory.prototype.setVideoDimensions = function(width, height) {
		return Inio.player.setVideoDimensions(width, height);
	};
	/**
	 * Set audio track by its index
	 *
	 * @param {Number} index (0..)
	 */
	Factory.prototype.audioTrack = function(index) {
		return Inio.player.audioTrack(index);
	};
	/*
	 * This function is called every time, when the player executes seek method.
	 * Seek method fires: forward, rewind and seek inside the movie.
	 * When the start seek is called, this method trigger seek-start and then it
	 * starts interval, which each seconds is testing, if the Player state is playing.
	 * If the condition is true, this method triggers seek-end. If within 20 seconds
	 * movie does not play, this interval is cleared and seek-end is triggered.
	 *
	 * This functionality you can use for setting throbber progress inside video player.
	 */
	Factory.prototype.startSeek = function() {
		var scope = this,
			remain = 20;

		// clear interval
		this.clearSeekInterval();

		this.trigger('seek-start');

		this.triggerHandle = setInterval(function() {
			if (remain === 0) {
				// finished but without success
				scope.clearSeekInterval();
				scope.trigger('seek-end');
			} else {
				remain--;
				if (scope.currentState === scope.STATE_PLAYING) { // movie is already playing ?
					scope.clearSeekInterval();
					scope.trigger('seek-end');
				}
			}
		}, 1000);
	};
	/**
	 * @private
	 */
	Factory.prototype.clearSeekInterval = function() {
		// clear interval
		if (this.triggerHandle) {
			clearInterval(this.triggerHandle);
			this.triggerHandle = null;
		}
	};
	/**
	 * Get clip URL address
	 *
	 * @returns {String}
	 */
	Factory.prototype.getUrl = function() {
		return Inio.player.url;
	};
	/**
	 * Get clip duration in [ms]
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getDuration = function() {
		return Inio.player.duration;
	};
	/**
	 * Get current play time in [ms]
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getCurrentTime = function() {
		return Inio.player.currentTime;
	};
	/**
	 * Get current player state (STATE_IDLE|STATE_BUFFERING|STATE_PLAYING|STATE_PAUSED)
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getState = function() {
		return Inio.player.currentState;
	};
	/**
	 * Get current playback speed (-8..1..8)
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getPlaybackSpeed = function() {
		return Inio.player.speed;
	};
	/**
	 * Get DRM custom data
	 *
	 * @returns {Object}
	 */
	Factory.prototype.getCustomData = function() {
		return Inio.player.customData;
	};
	/**
	 * Get player width [px]
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getWidth = function() {
		return Inio.player.width;
	};
	/**
	 * Get player height [px]
	 *
	 * @returns {Number}
	 */
	Factory.prototype.getHeight = function() {
		return Inio.player.height;
	};
	/**
	 * Get player CSS position [left, top]
	 *
	 * @returns {Array}
	 */
	Factory.prototype.getOffset = function() {
		return [Inio.player.left, Inio.player.top];
	};

	return new Factory();
})();