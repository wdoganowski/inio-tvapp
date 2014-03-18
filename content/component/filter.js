/**
 * Component.filter
 *
 * @author Mautilus s.r.o.
 * @class Component.filter
 * @extends Component
 */
Component.filter = function() {
	Component.apply(this, arguments);
};

Component.filter.prototype.__proto__ = Component.prototype;
/**
 * @inheritdoc Component#init
 */
Component.filter.prototype.init = function() {
	this.isStructured = true;
};
/**
 * @inheritdoc Component#getComponentType
 */
Component.filter.prototype.getComponentType = function() {
	return 'filter';
};