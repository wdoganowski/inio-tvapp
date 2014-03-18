/**
 * Inio Player / core class
 *
 * @author Mautilus s.r.o.
 * @class Inio_Player
 * @singleton
 */
function Inio_Player() {
    this.init.apply(this, arguments);
};

/**
 * @property {Number} STATE_IDLE
 */
Inio_Player.prototype.STATE_IDLE = -1;
Inio_Player.prototype.STATE_PENDING = -1; // alias for STATE_IDLE
/**
 * @property {Number} STATE_BUFFERING
 */
Inio_Player.prototype.STATE_BUFFERING = 0;
/**
 * @property {Number} STATE_PLAYING
 */
Inio_Player.prototype.STATE_PLAYING = 1;
/**
 * @property {Number} STATE_PAUSED
 */
Inio_Player.prototype.STATE_PAUSED = 2;
/**
 * Initialize Player
 *
 * @param {Object} config
 */
Inio_Player.prototype.init = function(config) {
    this.config = {
        /**
         * @cfg {Number} seekStep Default seek time (ms)
         */
        seekStep: 20000,
        /**
         * @cfg {Object} DRMconfig DRM (Widevine/Playready) configuration
         */
        DRMconfig: null
    };

    /**
     * @property {String} url Media URL
     */
    this.url = null;
    /**
     * @property {Number} duration Media duration (ms)
     */
    this.duration = 0;
    /**
     * @property {Number} currentTime Current time position  (ms)
     */
    this.currentTime = 0;
    /**
     * @property {Number} currentState Current playback state
     */
    this.currentState = this.STATE_IDLE;
    /**
     * @property {Number} prevState Previous playback state
     */
    this.prevState = null;
    /**
     * @property {Number} speed Playback speed
     */
    this.speed = 1;
    /**
     * @property {Boolean} looping TRUE for endless looping
     */
    this.looping = true;
    /**
     * @property {Number} width Player width
     */
    this.width = 1280;
    /**
     * @property {Number} height Player height
     */
    this.height = 720;
    /**
     * @property {Number} top Player top position
     */
    this.top = 0;
    /**
     * @property {Number} left Player left position
     */
    this.left = 0;
    /**
     * @property {String} customData DRM custom data
     */
    this.customData = null;

    this.configure(config);
    this.initNative();
};
/**
 * De-init player
 *
 * @private
 */
Inio_Player.prototype.deinit = function() {
    this.reset();
    this.deinitNative();
};
/**
 * Set class config hash
 *
 * @param {Object} config Hash of parameters
 */
Inio_Player.prototype.configure = function(config) {
    this.config = Inio.extend(this.config || {}, config);
};
/**
 * Init native API, override this method with your device player
 *
 * @private
 */
Inio_Player.prototype.initNative = function() {

};
/**
 * De-init native player
 *
 * @private
 */
Inio_Player.prototype.deinitNative = function() {

};
/**
 * Call native API, override this method with your device player
 *
 * @private
 * @param {String} cmd Command
 * @param {Object} [attrs]
 */
Inio_Player.prototype.native = function(cmd, attrs) {

};
/**
 * @private
 */
Inio_Player.prototype._onDurationChange = function(duration) {
    this.duration = Math.round(duration);

    if (typeof this.onDurationChange === 'function') {
        this.onDurationChange(this.duration);
    }
};
/**
 * Triggered when new duration is detected
 *
 * @param {Number} duration Clip duration in [ms]
 * @template
 */
Inio_Player.prototype.onDurationChange = function(duration) {

};
/**
 * @private
 */
Inio_Player.prototype._onTimeUpdate = function(time) {
    time = Math.round(time);

    if (time > 0 && (this.duration <= 0 || this.duration >= time)) {
        this.currentTime = time;

        if (typeof this.onTimeUpdate === 'function') {
            this.onTimeUpdate(this.currentTime);
        }
    }
};
/**
 * Triggered when current play time is changed
 *
 * @param {Number} time Play time in [ms]
 * @template
 */
Inio_Player.prototype.onTimeUpdate = function(time) {

};
/**
 * @private
 */
Inio_Player.prototype._onEnd = function() {
    if (this.looping && this.duration) {
        this.seek(0);
        this.native('play');

    } else {
        if (typeof this.onEnd === 'function') {
            this.onEnd(this.currentTime);
        }

        this.state(this.STATE_IDLE);
    }
};
/**
 * Triggered when the clip ends
 *
 * @param {Number} time Play time in [ms]
 * @template
 */
Inio_Player.prototype.onEnd = function(time) {

};
/**
 * @private
 */
Inio_Player.prototype._onError = function(code, msg, details) {
    if (typeof this.onError === 'function') {
        this.onError(code, msg, details);
    }
};
/**
 * Triggered when an error occures
 *
 * @param {Number} code Error code
 * @param {String} msg Error message
 * @param {String} details Error additional parameters
 * @template
 */
Inio_Player.prototype.onError = function(code, msg, details) {

};
/**
 * Set/Get current state
 *
 * @param {Number} state
 */
Inio_Player.prototype.state = function(state) {
    if (typeof state !== 'undefined') {
        if (this.currentState !== this.STATE_BUFFERING) {
            this.prevState = this.currentState;
        }

        this.currentState = state;

        if (typeof this.onStateChange === 'function') {
            this.onStateChange(this.currentState);
        }

        return true;
    }

    return this.currentState;
};
/**
 * Triggered when play state changes
 *
 * @param {Number} state Play state (STATE_IDLE|STATE_BUFFERING|STATE_PLAYING|STATE_PAUSED)
 * @template
 */
Inio_Player.prototype.onStateChange = function(state) {

};
/**
 * Reset all states and properties
 */
Inio_Player.prototype.reset = function() {
    this.url = null;
    this.duration = 0;
    this.currentTime = 0;
    this.currentState = this.STATE_IDLE;
    this.prevState = null;
    this.speed = 1;

    this.native('reset');

    if (typeof this.onReset === 'function') {
        this.onReset();
    }
};
/**
 * Triggered when player is reseted
 *
 * @template
 */
Inio_Player.prototype.onReset = function() {

};
/**
 * Show player and set it's position
 *
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {Number} [left]
 * @param {Number} [top]
 */
Inio_Player.prototype.show = function(width, height, left, top) {
    this.native('show', {
        width: width,
        height: height,
        left: left,
        top: top
    });

    document.body.className = String(document.body.className).replace(/\s?player-(window\-[\d\-]+|fullscreen)/g, '') + ((this.width < 1280 || this.height < 720) ? ' player-window-' + (this.width || 1280) + '-' + (this.height || 720) + '-' + (this.left || 0) + '-' + (this.top || 0) : 'player-fullscreen');

    if (typeof this.onShow === 'function') {
        this.onShow();
    }
};
/**
 * Triggered when player is shown
 *
 * @template
 */
Inio_Player.prototype.onShow = function() {

};
/**
 * Hide player
 */
Inio_Player.prototype.hide = function() {
    this.native('hide');

    document.body.className = String(document.body.className).replace(/\s?player-(window\-[\d\-]+|fullscreen)/g, '')

    if (typeof this.onHide === 'function') {
        this.onHide();
    }
};
/**
 * Triggered when player is hidden
 *
 * @template
 */
Inio_Player.prototype.onHide = function() {

};
/**
 * Set media URL
 *
 * @param {String} url
 */
Inio_Player.prototype.setURL = function(url) {
    this.reset();

    this.url = url;

    if (typeof this.onUrl === 'function') {
        this.onUrl(this.url);
    }
};
/**
 * Triggered when new URL is set
 *
 * @param {String} url URL address
 * @template
 */
Inio_Player.prototype.onUrl = function(url) {

};
/**
 * Setu custom data for widevine/playready DRM
 *
 * @param {String} customData
 */
Inio_Player.prototype.setCustomData = function(customData) {
    this.customData = customData || null;

    if (typeof this.onCustomData === 'function') {
        this.onCustomData(this.customData);
    }
};
/**
 * Triggered when DRM custom data are set
 *
 * @param {String} customData DRM custom data
 * @template
 */
Inio_Player.prototype.onCustomData = function(customData) {

};
/**
 * Start playback
 *
 * @param {String} [url]
 * @param {Number} [position] Seek position (ms)
 * @param {Boolean} [looping]
 */
Inio_Player.prototype.play = function(url, position, looping) {
    if (!position && typeof url === 'number') {
        position = url;
        url = null;
    }

    if (url) {
        if (this.url && this.currentState !== this.STATE_IDLE) {
            this.stop();
        }

        this.setURL(url);
        this.looping = looping || false;
    }

    if (!this.url) {
        throw new Error('No video URL specified in Player');
    }

    this.show();

    this.native('play', {
        url: url,
        position: position
    });

    if (typeof this.onPlay === 'function') {
        this.onPlay(this.url, position);
    }
};
/**
 * Triggered when playback starts
 *
 * @param {String} url URL address
 * @param {Number} [position] Start position [ms]
 * @template
 */
Inio_Player.prototype.onPlay = function(url, position) {

};
/**
 * Pause playback
 */
Inio_Player.prototype.pause = function() {
    this.native('pause');

    if (typeof this.onPause === 'function') {
        this.onPause();
    }
};
/**
 * Triggered when playback pauses
 *
 * @template
 */
Inio_Player.prototype.onPause = function() {

};
/**
 * Stop playback and reset player
 */
Inio_Player.prototype.stop = function() {
    this.native('stop');

    if (typeof this.onStop === 'function') {
        this.onStop(this.currentTime);
    }

    this.reset();
};
/**
 * Triggered when playback stops
 *
 * @param {Number} time Playback position
 * @template
 */
Inio_Player.prototype.onStop = function(time) {

};
/**
 * Seek playback
 *
 * @param {Number} position Time position (ms)
 */
Inio_Player.prototype.seek = function(position) {
    if (String(position).match(/\%/)) {
        // percent
        position = this.duration / 100 * parseFloat(position);
    }

    position = position >> 0;

    if (position < 0) {
        position = 0;

    } else if (position > this.duration) {
        position = this.duration;
    }

    this.native('seek', {
        position: position
    });

    if (typeof this.onSeek === 'function') {
        this.onSeek(position);
    }
};
/**
 * Triggered when seeking
 *
 * @param {Number} time Seek position
 * @template
 */
Inio_Player.prototype.onSeek = function(time) {

};
/**
 * Fast Forward
 *
 * @param {Number/String} skip Skip time (ms or %)
 */
Inio_Player.prototype.forward = function(skip) {
    if (typeof skip === 'string' && skip.match(/\%/)) {
        skip = Math.round(this.duration / 100 * parseFloat(skip));
    }

    if (!skip) {
        skip = this.config.seekStep;
    }

    this.seek(this.currentTime + skip);
};
/**
 * Fast Backward
 *
 * @param {Number/String} skip Skip time (ms or %)
 */
Inio_Player.prototype.backward = function(skip) {
    if (typeof skip === 'string' && skip.match(/\%/)) {
        skip = Math.round(this.duration / 100 * parseFloat(skip));
    }

    if (!skip) {
        skip = this.config.seekStep;
    }

    this.seek(this.currentTime - skip);
};
/**
 * Set playback speed
 *
 * @param {Number} speed
 */
Inio_Player.prototype.playbackSpeed = function(speed) {
    speed = speed >> 0;

    this.speed = speed;
    this.native('playbackSpeed', {
        speed: this.speed
    });

    if (typeof this.onPlaybackSpeed === 'function') {
        this.onPlaybackSpeed(this.speed);
    }
};
/**
 * Triggered when plyback speed changes
 *
 * @param {Number} speed Playback speed (-8..1..8)
 * @template
 */
Inio_Player.prototype.onPlaybackSpeed = function(speed) {

};
/**
 * Set video dimensions
 *
 * @param {Number} width
 * @param {Number} height
 */
Inio_Player.prototype.setVideoDimensions = function(width, height) {
    this.native('setVideoDimensions', {
        width: width,
        height: height
    });
};
/**
 * Set audio track by its index
 *
 * @param {Number} index (0..)
 * @param {String}	languageCode eng, en, etc.
 */
Inio_Player.prototype.audioTrack = function(index, languageCode) {
    this.native('audioTrack', {
        index: index,
        language: languageCode
    });
};
/**
 * Get unique device ESN
 *
 * @returns {String}
 */
Inio_Player.prototype.getESN = function() {

};