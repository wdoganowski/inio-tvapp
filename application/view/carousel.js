/**
 * Carouse; view
 *
 * @author Mautilus s.r.o.
 * @class View_Carousel
 * @extends View
 */
function View_Carousel() {
	View.apply(this, arguments);
};

View_Carousel.prototype.__proto__ = View.prototype;

View_Carousel.prototype.index = 0;

View_Carousel.prototype.init = function() {

};

View_Carousel.prototype.setCollection = function(collection) {
	this.collection = collection;
};

View_Carousel.prototype.setIndex = function(index) {
	var i = this.index;

	this.index = index >> 0;

	if (this.index < 0) {
		this.index += this.collection.length;

	} else if (this.index >= this.collection.length) {
		this.index -= this.collection.length;
	}

	return (i !== this.index);
};
/**
 * @inheritdoc View#render
 */
View_Carousel.prototype.render = function() {
	return Template.render('carousel', this).done(function(html) {
		this.$el.html(html);

		this.$elUL = this.$el.find('ul');
		this.$elLIs = this.$el.find('li');
		this.$elPosition = this.$el.find('.position');

		this.renderItems();
	}, this);
};
View_Carousel.prototype.renderItems = function() {
	var idx, item;

	startAt = this.index - 2;

	for (var i = 0; i < 5; i++) {
		idx = i + startAt;

		if ( idx >= this.collection.length) {
			idx = (idx % this.collection.length);

		} else if ( idx < 0) {
			idx = this.collection.length + (idx % this.collection.length);
		}

		this.collection.at(idx).done((function($el, idx){
			return function(item){
				if ($el.attr('data-idx') != idx) {
					$el.attr('data-idx', idx);
					$el.attr('data-title', item.title);
					$el.attr('data-id', item.id);
					$el.find('.pic').css('background-image', 'url("' + item.thumbnail + '")');
				}
			};
		})(this.$elLIs.eq(i), idx));
	}

	this.$elPosition.find('span').removeClass('active').eq(this.index).addClass('active');

	if(this.hasFocus()){
		this.onFocus(Focus.focused);
	}
};
View_Carousel.prototype.navigate = function(direction) {
	if (this._animating) {
		return false;
	}

	if (direction === 'right') {
		this.setIndex(this.index + 1);

		this.renderItems();
		/*
		this.animate(direction).done(function() {
			this.renderItems();
		}, this);*/

	} else if (direction === 'left') {
		this.setIndex(this.index - 1);

		this.renderItems();
		/*
		this.animate(direction).done(function() {
			this.renderItems();
		}, this);*/
	}
};
View_Carousel.prototype.animate = function(direction) {
	this._animating = true;

	this.$elUL.removeClass('no-animation').addClass('slide-' + direction);

	return this.timeout(350).done(function() {
		this.$elUL.addClass('no-animation').removeClass('slide-' + direction);

		this._animating = false;
	}, this);
};
View_Carousel.prototype.focus = function() {
	return Focus.to(this.getFocusable(0, true));
};
View_Carousel.prototype.onFocus = function($el) {
	var title;

	this._focusIndex = $el.index();

	title = $el.attr('data-title');

	this.trigger('select', $el, title);
};