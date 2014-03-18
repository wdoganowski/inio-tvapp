/**
 * Home scene
 *
 * @author Mautilus s.r.o.
 * @class Scene_Home
 * @extends Scene
 */
function Scene_Home() {
	Scene.apply(this, arguments);
};

Scene_Home.prototype.__proto__ = Scene.prototype;

Scene_Home.prototype.init = function() {
	this.carousel = new View_Carousel(this);
	this.catalog = new View_Catalog(this, {
		rows: 1,
		rowsVisible: 1,
		cols: 7
	});

	this.carousel.on('select', function($el, title) {
		App.header.setBreadcrumbPath([title]);
	}, this);

	this.catalog.on('select', function($el, title) {
		App.header.setBreadcrumbPath([title]);
	}, this);
};
/**
 * @inheritdoc Scene#onShow
 */
Scene_Home.prototype.onShow = function() {
	App.throbber();
};
/**
 * @inheritdoc Scene#activate
 */
Scene_Home.prototype.activate = function() {
	this.carousel.setCollection(Content.find('content.carousel'));
	this.catalog.setCollection(Content.find('content.editors_choice'));

	return this.all(this.carousel.collection.load(), this.catalog.collection.load());
};
/**
 * @inheritdoc Scene#create
 */
Scene_Home.prototype.create = function() {
	return $('<div class="scene" id="scene-home" />').appendTo(App.$viewport);
};
/**
 * @inheritdoc Scene#render
 */
Scene_Home.prototype.render = function() {
	return this.when(function(promise) {
		Template.render('scene-home', this).done(function(html) {
			this.$el.html(html);

			this.all(this.carousel.renderTo(this.$el.find('.carousel-wrapper')), this.catalog.renderTo(this.$el.find('.movies'))).done(function(){
				promise.resolve();
				App.throbberHide();
			});
		}, this);
	});
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Home.prototype.focus = function() {
	this.carousel.focus();
};
/**
 * @inheritdoc Scene#onEnter
 */
Scene_Home.prototype.onEnter = function($el) {
	var id = $el.attr('data-id');

	if (id) {
		Router.go('detail', id, null, this.catalog.collection);
		return false;
	}
};
/**
 * @inheritdoc Scene#focus
 */
Scene_Home.prototype.onReturn = function() {
	App.sidebar.focus();
	return false;
};
/**
 * @inheritdoc Scene#navigate
 */
Scene_Home.prototype.navigate = function(direction) {
	if(direction === 'up'){
		if(this.catalog.hasFocus()){
			this.carousel.focus();
			return false;
		}

	} else if(direction === 'down'){
		if(this.carousel.hasFocus()){
			this.catalog.focus();
			return false;
		}
	}
};