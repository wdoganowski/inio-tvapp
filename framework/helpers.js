/**
 * @author Mautilus s.r.o.
 * @ignore
 */

if (typeof jQuery !== 'undefined') {
    jQuery.fn.extend({
	/**
	 * $().belongsTo() Check if subset belong to a specified parent element
	 * 
	 * @ignore
	 * @param {Object} parent Parent element, HTMLElement or jQuery collection
	 * @returns {Boolean}
	 */
	belongsTo: function(parent) {
	    var el = (parent && parent.nodeType ? parent : parent[0]),
		    parents = this.parents();

	    for (var i in parents) {
		if (parents.hasOwnProperty(i) && parents[i] === el) {
		    return true;
		}
	    }

	    return false;
	}
    });
}

/*
 * Binding function for prevent scope or global variables.
 * 
 * @param {Function} func called function
 * @param {Object} scope which scope has to function use ?
 * @param {Array} addArg array of arguments which are passed to function
 * @returns {Function} returns new function
 */
function bind(func, scope, addArg) {
	return function () {
		if (addArg) {
			var args = Array.prototype.slice.call(arguments);
			return func.apply(scope, args.concat(addArg));
		}
		else return func.apply(scope, arguments);
	};
}

/**
 * Shortcut to the I18n.translate method
 * 
 * @returns {String};
 */
function __() {
    return I18n.translate.apply(I18n, arguments);
}

/**
 * Convert seconds to movie duration, e.g. 125 min
 * 
 * @param {Number} seconds
 * @returns {String};
 */
function secondsToDuration(seconds) {
    return Math.round(seconds / 60) + ' min';
}

/**
 * Convert seconds to hours, e.g. 0:05:23
 * 
 * @param {Number} seconds
 * @returns {String};
 */
function secondsToHours(seconds) {
    var hours = Math.floor(seconds / 3600),
	    minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));

    return hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
}