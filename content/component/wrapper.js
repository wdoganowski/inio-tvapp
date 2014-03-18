/**
 * Component.wrapper
 *
 * @author Mautilus s.r.o.
 * @class Component.wrapper
 * @extends Component
 */
Component.wrapper = function() {
	Component.apply(this, arguments);
};

Component.wrapper.prototype.__proto__ = Component.prototype;
/**
 * @inheritdoc Component#getComponentType
 */
Component.wrapper.prototype.getComponentType = function() {
	return 'wrapper';
};