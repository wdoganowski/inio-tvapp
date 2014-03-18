/**
 * Component.configuration
 *
 * @author Mautilus s.r.o.
 * @class Component.configuration
 * @extends Component
 */
Component.configuration = function() {
	Component.apply(this, arguments);
};

Component.configuration.prototype.__proto__ = Component.prototype;
/**
 * @inheritdoc Component#getComponentType
 */
Component.configuration.prototype.getComponentType = function() {
	return 'configuration';
};