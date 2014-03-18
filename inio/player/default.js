/**
 * Default Inio Player, HTML5 video
 *
 * @author Mautilus s.r.o.
 * @class Inio_Player_Default
 * @extends Inio_Player
 */
function Inio_Player_Default() {
	Inio_Player.apply(this, arguments);
};

Inio_Player_Default.prototype.__proto__ = Inio_Player.prototype;

/**
 * @inheritdoc Inio_Player#initNative
 */
Inio_Player_Default.prototype.initNative = function() {
	var scope = this;

	this.el = document.createElement('video');

	this.el.className = 'Inio-player';
	this.el.style.position = 'absolute';
	this.el.style.visibility = 'hidden';
	this.el.style.zIndex = 1;

	document.body.appendChild(this.el);

	this.el.addEventListener('waiting', function() {
		scope.state(scope.STATE_BUFFERING);
	});

	this.el.addEventListener('playing', function() {
		scope.state(scope.STATE_PLAYING);
	});

	this.el.addEventListener('pause', function() {
		if (!scope.duration || scope.duration > scope.currentTime) {
			scope.state(scope.STATE_PAUSED);
		}
	});

	this.el.addEventListener('ended', function() {
		scope._onEnd();
	});

	this.el.addEventListener('durationchange', function() {
		scope._onDurationChange(scope.el.duration * 1000);
	});

	this.el.addEventListener('timeupdate', function() {
		scope._onTimeUpdate(scope.el.currentTime * 1000);
	});

	this.el.addEventListener('error', function() {
		scope._onError(0, '');
	});
};
/**
 * @inheritdoc Inio_Player#deinitNative
 */
Inio_Player_Default.prototype.deinitNative = function() {
	if (this.el && this.el.parentNode) {
		this.el.parentNode.removeChild(this.el);
	}
};
/**
 * @inheritdoc Inio_Player#native
 */
Inio_Player_Default.prototype.native = function(cmd, attrs) {
	if (cmd === 'play') {
		if (this.el.src !== this.url) {
			console.network('PLAYER', this.url);
			this.el.src = this.url;
		}

		this.el.play();

		if (attrs && attrs.position) {
			this.el.currentTime = attrs.position / 1000;
		}

		return true;

	} else if (cmd === 'pause') {
		return this.el.pause();

	} else if (cmd === 'stop') {
		return this.el.pause();

	} else if (cmd === 'seek') {
		this.el.currentTime = attrs.position / 1000;
		return true;

	} else if (cmd === 'playbackSpeed') {
		this.el.playbackRate = attrs.speed;
		return this.el.playbackRate;

	} else if (cmd === 'show') {
		this.width = attrs.width || this.width;
		this.height = attrs.height || this.height;
		this.top = (typeof attrs.top !== 'undefined' ? attrs.top : this.top);
		this.left = (typeof attrs.left !== 'undefined' ? attrs.left : this.left);

		this.el.style.left = this.left;
		this.el.style.top = this.top;
		this.el.style.width = this.width + 'px';
		this.el.style.height = this.height + 'px';
		this.el.style.visibility = 'visible';

	} else if (cmd === 'hide') {
		this.el.style.visibility = 'hidden';

	} else if (cmd === 'setVideoDimensions') {
		var h = Math.round((this.width / attrs.width) * attrs.height);

		this.el.style.top = Math.round((this.height - h) / 2);
		this.el.style.height = h + 'px';

	} else if (cmd === 'audioTrack') {

	} else if (cmd === 'reset') {
		this.el.src = null;
	}
};