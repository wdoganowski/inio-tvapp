/**
 * Deferrable abstract class
 *
 * @author Mautilus s.r.o.
 * @class Deferrable
 * @abstract
 */
function Deferrable() {

};

/**
 * @property {Object} promises Deferrable promises
 */
Deferrable.prototype.promises = null;
/**
 * Push new Promise into the stack and return Promise
 *
 * @private
 * @param {Promise} Promise
 * @returns {Promise} Promise
 */
Deferrable.prototype.pushPromise = function(promise) {
	if (this.promises === null) {
		this.promises = [];
	}

	this.promises.push(promise);

	return promise;
};
/**
 * Reject all Promises in the stack
 *
 * @returns {undefined}
 */
Deferrable.prototype.rejectAll = function() {
	if (this.promises) {
		for (var i in this.promises) {
			if (this.promises.hasOwnProperty(i) && this.promises[i]) {
				this.promises[i].reject();
			}
		}
	}
};
/**
 * Create new Promise and call given callback with the Promise as a first argument
 *
 * @param {Function} callback
 * @param {Object} [scope=Promise]
 * @returns {Promise}
 */
Deferrable.prototype.when = function(callback, scope) {
	var promise = this.pushPromise(new Promise());

	callback.call(scope || this, promise);

	return promise;
};
/**
 * Create new Promise and call all given callbacks with the Promise as a first argument
 *
 * @param {Promise} [promises]
 * @returns {Promise}
 */
Deferrable.prototype.all = function() {
	var promise = this.pushPromise(new Promise()),
		pending = 0,
		resolved = 0,
		args;

	args = Array.prototype.slice.call(arguments);
	pending = args.length;

	if (!pending) {
		promise.resolve(0);
		return promise;
	}

	args.map(function(p) {
		if (!(p instanceof Promise)) {
			return;
		}

		p.then(function(status) {
			pending--;

			if (status) {
				resolved++;
			}

			if (pending === 0) {
				if (resolved === args.length) {
					promise.resolve(resolved);

				} else {
					promise.reject(resolved);
				}
			}
		});
	});

	return promise;
};
/**
 * Create new Promise and resolve it after given timeout
 *
 * @param {Number} [ms=0] Timeout in miliseconds
 * @returns {Promise}
 */
Deferrable.prototype.timeout = function(ms) {
	var promise = this.pushPromise(new Promise());

	setTimeout(function() {
		promise.resolve(ms || 0);
	}, ms || 0);

	return promise;
};
/**
 * Defered promise with timeout=0
 *
 * @param {Function} callback
 * @param {Object} [scope=Promise]
 * @returns {Promise}
 */
Deferrable.prototype.lag = function(callback, scope) {
	var promise = this.pushPromise(new Promise());

	setTimeout(function() {
		if (callback) {
			callback.call(scope || this, promise);
		}

		promise.resolve();
	}, 0);

	return promise;
};