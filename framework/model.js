/**
 * Model abstract class
 *
 * @author Mautilus s.r.o.
 * @class Model
 * @abstract
 * @mixins Events
 * @mixins Deferrable
 */
function Model() {
	this.construct.apply(this, arguments);
};

Model.prototype.__proto__ = Events.prototype;
Model.prototype.__proto__.__proto__ = Deferrable.prototype;

/**
 * Construct object
 *
 * @constructor
 */
Model.prototype.construct = function(attributes) {
	this.clear();
	this.set(attributes);
};
/**
 * Destruct object
 *
 * @private
 */
Model.prototype.desctruct = function() {
	this.clear();
};
/**
 * Set a hash of attributes
 *
 * @param {Object} attributes
 */
Model.prototype.set = function(attributes, value) {
	var n;

	if (typeof attributes === 'string') {
		n = {};
		n[attributes] = value;
		return this.set(n);
	}

	for (var i in attributes) {
		if (attributes.hasOwnProperty(i)) {
			n = String(i).toUpperCase().substr(0, 1) + String(i).substr(1);

			if (typeof this['set' + n] === 'function') {
				this['set' + n].call(this, attributes[i]);

			} else {
				this.attributes[i] = attributes[i];
			}

			this.trigger('set', i, this.attributes[i]);
		}
	}
};
/**
 * Get the value of specified attribute
 *
 * @param {String} attribute
 */
Model.prototype.get = function(attribute) {
	var n = String(attribute).toUpperCase().substr(0, 1) + String(attribute).substr(1);

	if (typeof this['get' + n] === 'function') {
		return this['get' + n].call(this);
	}

	return this.attributes[attribute];
};
/**
 * Check if specified attribute is set and not empty (non-null non-undefined)
 *
 * @param {String} attribute
 * @returns {Boolean}
 */
Model.prototype.has = function(attribute) {
	return (this.attributes[attribute] ? true : false);
};
/**
 * Removes all attributes
 */
Model.prototype.clear = function() {
	this.attributes = {};

	this.trigger('clear');
};
/**
 * Compare Model with specified hash and return TRUE if all attributes match
 *
 * @param {Object} attributes Hash of attributes
 * @param {Boolean} [typeSensitive=false] TRUE for type sensitive comparition
 * @returns {Boolean}
 */
Model.prototype.match = function(attributes, typeSensitive) {
	for (var i in attributes) {
		if (attributes.hasOwnProperty(i)) {
			if (!typeSensitive && attributes[i] != this.get(i)) {
				return false;

			} else if (typeSensitive && attributes[i] !== this.get(i)) {
				return false;
			}
		}
	}

	return true;
};
/**
 * Clone model
 *
 * @returns {Model}
 */
Model.prototype.clone = function() {
	var obj = {};

	for (var i in this) {
		obj[i] = this[i];
	}

	return obj;
};