/**
 * Component.brightcove
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove
 * @extends Component
 */
Component.brightcove = function() {
	Component.apply(this, arguments);
};

Component.brightcove.prototype.__proto__ = Component.prototype;
/**
 * @inheritdoc Component#defaultAttributes
 */
Component.brightcove.prototype.defaultAttributes = function() {
	return {
		endpoint: 'https://api.brightcove.com/services/library',
		token: ''
	};
};