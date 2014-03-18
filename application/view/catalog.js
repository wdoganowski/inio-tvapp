/**
 * Catalog Grid view
 *
 * @author Mautilus s.r.o.
 * @class View_Catalog
 * @extends View
 */
function View_Catalog() {
	View.apply(this, arguments);
};

View_Catalog.prototype.__proto__ = View.prototype;

View_Catalog.prototype.index = 0;
View_Catalog.prototype.rows = 3;
View_Catalog.prototype.rowsVisible = 2;
View_Catalog.prototype.cols = 6;
View_Catalog.prototype.collection = null;

View_Catalog.prototype.init = function() {

};
View_Catalog.prototype.setCollection = function(collection) {
	this.collection = collection;
	this.setIndex(0);
};
/**
 * @inheritdoc View#render
 */
View_Catalog.prototype.render = function() {
	return Template.render('catalog', this).done(function(html) {
		this.$el.html(html);

		this.$elUl = this.$el.find('ul');

		this.renderItems();
	}, this);
};
/**
 * @private
 */
View_Catalog.prototype.setIndex = function(index) {
	var i = this.index,
		max, rows, itemsLeft;

	this.index = index >> 0;

	if (this.collection.length <= (this.rowsVisible * this.cols)) {
		max = 0;

	} else {
		rows = Math.floor(this.collection.length / this.cols);
		itemsLeft = this.collection.length - (rows * this.cols);
		max = ((rows - (this.rows - this.rowsVisible) - (itemsLeft ? 0 : 1)) * this.cols);
	}

	if (this.index < 0) {
		this.index = 0;

	} else if (this.index >= max) {
		this.index = max;
	}

	return (i !== this.index);
};
/**
 * @inheritdoc View#focus
 */
View_Catalog.prototype.focus = function(idx) {
	var i = idx;

	if(idx === undefined){
		i = this._focusIndex || 0;
	}

	if (Focus.to(this.getFocusable(i, true)) === false) {
		if (i > 0) {
			i = this.$el.find('li.focusable').last().index();

		} else {
			i = this.$el.find('li.focusable').first().index();
		}

		return Focus.to(this.getFocusable(i, true));
	}

	return true;
};
View_Catalog.prototype.onFocus = function($el) {
	var title;

	this._focusIndex = $el.index();

	title = $el.attr('data-title');

	this.trigger('select', $el, title);
};
View_Catalog.prototype.renderItems = function() {
	var startAt = 0,
		idx, max, maxVisible, focusAt, slice;

	startAt = this.index;
	max = this.rows * this.cols;
	maxVisible = this.rowsVisible * this.cols;

	this.collection.slice(this.index, max).done(function(models) {
		var str = '';

		for (var i = 0; i < max; i++) {
			idx = startAt + i;

			if (models[i]) {
				str += '<li class="' + (i < maxVisible ? 'focusable' : '') + '" data-id="' + models[i].id + '" data-title="' + models[i].title + '"><img src="' + models[i].coverImg + '" alt="" /></li>';

			} else {
				str += '<li class="empty">&nbsp;</li>';
			}
		}

		this.$elUl.html(str);
	}, this);
};
/**
 * @inheritdoc View#navigate
 */
View_Catalog.prototype.navigate = function(direction) {
	if (direction === 'right') {
		if (Focus.to(this.getFocusable(1, true)) === false) {
			if (this.setIndex(this.index + this.cols) === true) {
				this.renderItems();
				this.focus((this.cols * this.rowsVisible) - this.cols);
				return false;
			}

		} else {
			return false;
		}

	} else if (direction === 'left') {
		if (Focus.to(this.getFocusable(-1, true)) === false) {
			if (this.setIndex(this.index - this.cols) === true) {
				this.renderItems();
				this.focus(this.cols - 1);
				return false;
			}

		} else {
			return false;
		}

	} else if (direction === 'down' && this.rowsVisible > 1) {
		if (Focus.to(this.getFocusable(this.cols, true)) === false) {
			if (this.setIndex(this.index + this.cols) === true) {
				this.renderItems();
				this.focus();
				return false;
			}

		} else {
			return false;
		}

	} else if (direction === 'up' && this.rowsVisible > 1) {
		if (Focus.to(this.getFocusable(-1 * this.cols, true)) === false) {
			if (this.setIndex(this.index - this.cols) === true) {
				this.renderItems();
				this.focus();
				return false;
			}

		} else {
			return false;
		}
	}
};