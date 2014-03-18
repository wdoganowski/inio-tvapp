/**
 * Detail scene
 *
 * @author Mautilus s.r.o.
 * @class Scene_Detail
 * @extends Scene
 */
function Scene_Detail() {
	Scene.apply(this, arguments);
};

Scene_Detail.prototype.__proto__ = Scene.prototype;

Scene_Detail.prototype.init = function() {
	this.catalog = new View_Catalog(this, {
		rows: 1,
		rowsVisible: 1,
		cols: 7
	});

	this.catalog.on('select', function($el, title) {
		App.header.setBreadcrumbPath([this.filterName, title]);
	}, this);
};

Scene_Detail.prototype.setModel = function(model) {
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
 * @inheritdoc Scene#onShow
 */
Scene_Detail.prototype.onShow = function() {
	App.throbber();
};
/**
 * @inheritdoc Scene#activate
 */
Scene_Detail.prototype.activate = function(videoId, filterName, relatedMoviesCollection) {
	this.filterName = filterName;
	this.collection = Content.find('content.detail');

	this.catalog.setCollection(relatedMoviesCollection);

	this.$el.hide();

	return this.when(function(promise) {
		this.collection.load(videoId).done(function() {
			this.collection.at(0).done(function(model) {
				this.setModel(model);
				promise.resolve();
				App.throbberHide();

			}, this).fail(function() {
				promise.reject();
				App.throbberHide();
			});
		}, this);
	}, this);
};
/**
 * @inheritdoc Scene#create
 */
Scene_Detail.prototype.create = function() {
	return $('<div class="scene" id="scene-detail" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc Scene#render
 */
Scene_Detail.prototype.render = function() {
	App.header.setBreadcrumbPath([this.filterName, this.video.title]);

	return Template.render('scene-detail', this).done(function(html) {
		this.$el.html(html);
		this.$el.show();

		this.catalog.renderTo(this.$el.find('.movies'));
	}, this);
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Detail.prototype.focus = function() {
	Focus.to(this.getFocusable(0));

	App.header.setBreadcrumbPath([this.filterName, this.video.title]);
};
/**
 * @inheritdoc Scene#navigate
 */
Scene_Detail.prototype.navigate = function(direction) {
	if (direction === 'right') {
		if(! this.catalog.hasFocus()){
			Focus.to(this.getFocusable(1, true));
			return false;
		}

	} else if (direction === 'left') {
		if(! this.catalog.hasFocus()){
			Focus.to(this.getFocusable(-1, true));
			return false;
		}

	}  else if (direction === 'down') {
		if(! this.catalog.hasFocus()){
			this.catalog.focus();
			return false;
		}

	} else if (direction === 'up') {
		if(this.catalog.hasFocus()){
			this.focus();
			return false;
		}
	}
};
/**
 * @inheritdoc Scene#onReturn
 */
Scene_Detail.prototype.onEnter = function($el) {
	var btn = $el.attr('data-btn'), id = $el.attr('data-id');

	if (btn === 'play') {
		Router.go('player', this.video);
		return false;

	} else if (id) {
		Router.go('detail', id, this.filterName, this.catalog.collection);
		return false;
	}
};
/**
 * @inheritdoc Scene#onReturn
 */
Scene_Detail.prototype.onReturn = function() {
	Router.goBack();
	return false;
};