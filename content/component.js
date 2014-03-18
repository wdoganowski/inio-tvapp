/**
 * Component abstract class
 *
 * @author Mautilus s.r.o.
 * @class Component
 * @abstract
 * @mixins Deferrable
 */
function Component(path, id, attrs) {
	Deferrable.call(this);

	this.path = path || null;
	this.id = id || null;
	this.items = [];
	this.length = 0;
	this.loaded = false;

	this.attributes(attrs);

	this.init();
};

Component.prototype.__proto__ = Deferrable.prototype;

Component.prototype.isComponent = true;
Component.prototype.isSingleton = false;
Component.prototype.isStructured = false;

/**
 * Init component
 */
Component.prototype.init = function() {

};
/**
 * Return default attributes
 * @return {Object}
 */
Component.prototype.defaultAttributes = function() {
	return {};
};
/**
 * Getter/Setter
 * @param  {String} name
 * @param  {Mixed} [value]
 */
Component.prototype.attr = function(name, value) {
	if (value === undefined) {
		return this.attrs[name];

	} else {
		this.attrs[name] = value;
	}
};
/**
 * Seter/Getter for multiple attributes
 * @param  {Object} [attrs]
 * @return {Object}
 */
Component.prototype.attributes = function(attrs) {
	if (attrs === undefined) {
		return this.attrs;
	}

	this.attrs = this.defaultAttributes();

	for (var i in attrs) {
		if (attrs.hasOwnProperty(i)) {
			this.attrs[i] = attrs[i];
		}
	}

	return this.attrs;
};
/**
 * Return component's type
 * @return {String}
 */
Component.prototype.getComponentType = function() {
	return '';
};
/**
 * Populate component with data
 * @return {Promise}
 */
Component.prototype.load = function() {
	var items = Content.find(this.path, 'items');

	return this.populate(items || []).done(function() {
		this.loaded = true;
	}, this);
};

/**
 * Reset collection (removes all models)
 */
Component.prototype.reset = function() {
	this.items = [];
	this.length = 0;
};
/**
 * Populate collection (resets the collection)
 *
 * @param  {Array} items
 * @return {Promise}
 */
Component.prototype.populate = function(items) {
	var model, comp, child, loaders = [];

	this.reset();

	for (var i in items) {
		if (items.hasOwnProperty(i)) {
			if (typeof items[i] === 'object') {
				if (items[i].component) {
					comp = Content.parser.getComponentFunc(items[i].component);

					if (typeof comp === 'function') {
						child = new comp(this.path + '.' + items[i].id, items[i].id, items[i].attrs, items[i].items);

						loaders.push(child.load());
						this.items.push(child);
					}

				} else {
					model = this.normalize(items[i]);

					if (items[i].items) {
						model.items = new this.constructor();
						loaders.push(model.items.populate(items[i].items));
					}

					this.items.push(model);
				}

			} else {
				this.items.push(model);
			}
		}
	}

	return this.all.apply(this, loaders).done(function() {
		this.length = this.getLength();
	}, this);
};
/**
 * Get total collection length based on lenghts of xtypes
 *
 * @return {Number}
 */
Component.prototype.getLength = function() {
	var len = this.items.length;

	for (var i in this.items) {
		if (this.items.hasOwnProperty(i)) {
			if (this.items[i].isComponent && !this.items[i].isStructured) {
				len += this.items[i].length - 1;
			}
		}
	}

	return len;
};
/**
 * Normalize model
 *
 * @param  {Object} attrs Model's attributes
 * @return {Object}
 */
Component.prototype.normalize = function(attrs) {
	return Inio.extend({}, attrs);
};
/**
 * Get model at position (supports lazy loading)
 *
 * @param  {Number} offset Starts from 0
 * @return {Promise}
 */
Component.prototype.at = function(offset) {
	return this.when(function(promise) {
		this.slice(offset, 1).done(function(models) {
			promise.resolve(models[0], offset);

		}).fail(function() {
			promise.reject();
		});
	}, this);
};
/**
 * Slice collection (supports lazy loading)
 *
 * @param  {Number} offset Starts from 0
 * @param  {Number} [length]
 * @return {Promise}
 */
Component.prototype.slice = function(offset, length) {
	var idxMax = 0,
		loaders = [],
		models = [],
		idx = 0, // current position in collection
		idxOut = 0;

	if (!this.loaded) {
		return this.when(function(promise) {
			this.load().done(function() {
				this.slice(offset, length).done(function(models) {
					promise.resolve(models);

				}).fail(function() {
					promise.reject();
				});
			}, this);
		}, this);
	}

	if (length === undefined) {
		length = this.length;
	}

	idxMax = offset + (length - 1);

	for (var i in this.items) {
		if (this.items.hasOwnProperty(i)) {
			if (this.items[i].isComponent && this.items[i].isStructured) {
				idxOut = idx + 1;

				if (idx >= offset && idx <= idxMax) {
					models.splice(idx - offset, 0, this.items[i]);
				}

			} else if (this.items[i].isComponent) {
				idxOut = idx + this.items[i].length;

				if (idxOut >= offset) {
					loaders.push(this.items[i].slice(Math.max(0, offset - idx), Math.min(idxMax - idx + 1, this.items[i].length)).done((function(idx) {
						return function(m) {
							m.unshift(idx - offset, 0);
							models.splice.apply(models, m);
						}
					})(idx)).fail(function() {
						// error
					}));
				}

			} else {
				idxOut = idx + 1;

				if (idx >= offset && idx <= idxMax) {
					models.splice(idx - offset, 0, this.items[i]);
				}
			}

			idx = idxOut;
		}
	}

	return this.when(function(promise) {
		this.all.apply(this, loaders).done(function() {
			promise.resolve(models);

		}).fail(function() {
			promise.reject();
		});
	}, this);
};
/**
 * Iterate each model (supports lazy loading)
 *
 * @param  {Function} callback
 * @param  {Object}   [scope]
 * @return {Promise}
 */
Component.prototype.forEach = function(callback, scope) {
	return this.slice(0).done(function(models) {
		models.forEach(callback, scope || this);
	}, this);
};