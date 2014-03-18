/**
 * Player scene
 *
 * @author Mautilus s.r.o.
 * @class Scene_Player
 * @extends Scene
 */
function Scene_Player() {
	Scene.apply(this, arguments);
};

Scene_Player.prototype.__proto__ = Scene.prototype;

Scene_Player.prototype.init = function() {
	Player.on('statechange', function(state) {
		this.update(true);

		if(state === Player.STATE_BUFFERING){
			App.throbber(false, 'top');

		} else {
			App.throbberHide();
		}
	}, this);

	Player.on('timeupdate', function(time) {
		this.update();
	}, this);

	Player.on('durationchange', function(time) {
		this.update(true);

		App.throbberHide();
	}, this);

	Player.on('pause', function() {
		this.update(true);
	}, this);

	Player.on('play', function() {
		this.update(true);
	}, this);

	Player.on('stop', function() {
		Router.goBack();
	}, this);

	Player.on('end', function() {
		Router.goBack();
	}, this);

	this.on('beforekey', function(keyCode){
		var isVisible = this.uiVisible;

		if(keyCode === Control.key.RETURN){
			return;
		}

		this.showUI();

		if(! isVisible){
			return false;
		}

		if(! Player.getDuration() || ! Player.getCurrentTime()){
			return;
		}

		if(keyCode === Control.key.PLAY){
			Player.play();
			return false;

		} else if(keyCode === Control.key.PAUSE && Player.getState() === Player.STATE_PLAYING){
			Player.pause();
			return false;

		} else if(keyCode === Control.key.FF && Player.getState() === Player.STATE_PLAYING){
			Player.forward();
			return false;

		} else if(keyCode === Control.key.RW && Player.getState() === Player.STATE_PLAYING){
			Player.backward();
			return false;

		} else if(keyCode === Control.key.STOP){
			Player.stop();
			return false;
		}

	}, this);
};

Scene_Player.prototype.setModel = function(model) {
	this.video = model;

	this.rating = Math.round(parseFloat(model.rating) / 2);
	this.actors = model.actors.join(', ');
	this.directors = model.directors.join(', ');
	this.countries = model.countries.join(', ').toUpperCase();
	this.duration = secondsToDuration(model.duration / 1000);
	this.hasTrailer = false;
	this.hasVideo = true;
};
/**
 * @inheritdoc Scene#create
 */
Scene_Player.prototype.create = function() {
	return $('<div class="scene" id="scene-player" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc Scene#onShow
 */
Scene_Player.prototype.onShow = function() {
	App.throbber(false, 'top');
};
/**
 * @inheritdoc Scene#onHide
 */
Scene_Player.prototype.onHide = function() {
	App.throbberHide(true);
};
/**
 * @inheritdoc Scene#activate
 */
Scene_Player.prototype.activate = function(video) {
	this.setModel(video);

	if (typeof this.video.videoUrl === 'function') {
		this.video.videoUrl().done(function(url) {
			Player.play(url);
		});

	} else {
		Player.play(this.video.videoUrl);
	}
};
/**
 * @inheritdoc Scene#render
 */
Scene_Player.prototype.render = function() {
	return Template.render('scene-player', this).done(function(html) {
		this.$el.html(html);

		this.showUI();

		this.$elCurrentTime = this.$el.find('.current-time');
		this.$elDuration = this.$el.find('.duration');
		this.$elProgressBar = this.$el.find('.progress-bar .inner');
		this.$elScrubber = this.$el.find('.scrubber');
		this.$elPlayBtn = this.$el.find('li[data-btn="play"]');
		this.$elPlayBtnIcon = this.$elPlayBtn.find('> span');
	}, this);
};
/**
 * @private
 */
Scene_Player.prototype.update = function(completeUpdate) {
	var time = Player.getCurrentTime(),
		duration = Player.getDuration(),
		state = Player.getState(),
		percentage;

	percentage = 100 / duration * time;

	if (!this.$elCurrentTime) {
		return;
	}

	this.$elCurrentTime.text(secondsToHours(time / 1000));
	this.$elProgressBar.width(percentage + '%');

	if (completeUpdate) {
		this.scrubberStep = duration / 100 * 2;
		this.$elDuration.text(secondsToHours(duration / 1000));
		this.$elPlayBtnIcon.toggleClass('icon-play', state === Player.STATE_PAUSED);
		this.$el.toggleClass('ui-paused', state === Player.STATE_PAUSED);

		if(this.scrubberVisible && state === Player.STATE_PAUSED){
			this.hideScrubber();
		}

		this.showUI();
	}
};
/**
 * @inheritdoc Scene#onBeforeShow
 */
Scene_Player.prototype.onBeforeShow = function() {
	App.header.hide();
	App.sidebar.hide();
};
/**
 * @inheritdoc Scene#onBeforeShow
 */
Scene_Player.prototype.onBeforeHide = function() {
	App.header.show();
	App.sidebar.show();

	Player.hide();
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Player.prototype.focus = function() {
	Focus.to(this.getFocusable(0, true));
};
/**
 * @private
 */
Scene_Player.prototype.showUI = function() {
	var scope = this;

	this.uiVisible = true;
	this.$el.addClass('ui-visible');

	if (this.ui_timer) {
		clearTimeout(this.ui_timer);
	}

	this.ui_timer = setTimeout(function() {
		scope.hideUI();
	}, 8000);
};
/**
 * @private
 */
Scene_Player.prototype.hideUI = function() {
	if (Player.getState() === Player.STATE_PAUSED) {
		return;
	}

	if(this.scrubberVisible){
		this.hideScrubber();
	}

	this.uiVisible = false;
	this.$el.removeClass('ui-visible');

	if (this.ui_timer) {
		clearTimeout(this.ui_timer);
	}
};
/**
 * @inheritdoc Scene#navigate
 */
Scene_Player.prototype.navigate = function(direction) {
	if(this.scrubberVisible){
		if (direction === 'down') {
			this.hideScrubber();

		} else if(direction === 'right'){
			this.moveScrubber(1);

		} else if(direction === 'left'){
			this.moveScrubber(-1);
		}

		return false;
	}

	if (direction === 'right') {
		Focus.to(this.getFocusable(1, true));
		return false;

	} else if (direction === 'left') {
		Focus.to(this.getFocusable(-1, true));
		return false;

	}  else if (direction === 'up' && Player.getDuration() && Player.getState() !== Player.STATE_PAUSED) {
		this.showScrubber();
		return false;
	}
};
/**
 * @inheritdoc Scene#onEnter
 */
Scene_Player.prototype.onEnter = function($el) {
	var btn = $el.attr('data-btn');

	if (!this.uiVisible) {
		this.showUI();
		return false;
	}

	if(this.scrubberVisible && Player.getDuration()){
		Player.seek(this.scrubberTime);
		return false;
	}

	if (btn && Player.getDuration()) {
		if (btn === 'play') {
			if (Player.getState() === Player.STATE_PLAYING && Player.getCurrentTime()) {
				Player.pause();

			} else {
				Player.play();
			}

		} else if (btn === 'rwd' && Player.getState() === Player.STATE_PLAYING) {
			Player.backward();

		} else if (btn === 'fwd' && Player.getState() === Player.STATE_PLAYING) {
			Player.forward();
		}

		return false;
	}
};
/**
 * @inheritdoc Scene#onReturn
 */
Scene_Player.prototype.onReturn = function() {
	if (this.uiVisible && Player.getState() !== Player.STATE_PAUSED) {
		this.hideUI();
		return false;
	}

	Player.stop();
	return false;
};

Scene_Player.prototype.showScrubber = function() {
	var time = Player.getCurrentTime(),
		duration = Player.getDuration(),
		percentage;

	percentage = 100 / duration * time;

	this.scrubberVisible = true;
	this.scrubberTime = time;

	this.$elScrubber.show();
	this.moveScrubber(0);

	Focus.to(this.$elScrubber.find('.focusable'));
};

Scene_Player.prototype.hideScrubber = function() {
	this.scrubberVisible = false;

	this.$elScrubber.hide();
	this.focus();
};

Scene_Player.prototype.moveScrubber = function(delta) {
	var duration = Player.getDuration(),
		percentage;

	this.scrubberTime = (this.scrubberTime || 0) + (this.scrubberStep * delta);

	if(! this.scrubberTime){
		this.scrubberTime = 0;
	}

	if(this.scrubberTime < 0){
		this.scrubberTime = 0;
	}

	if(this.scrubberTime > duration){
		this.scrubberTime = duration;
	}

	percentage = 100 / duration * this.scrubberTime;

	this.$elScrubber.find('.scrubber-time').text(secondsToHours(this.scrubberTime / 1000));
	this.$elScrubber.css('left', percentage + '%');
};