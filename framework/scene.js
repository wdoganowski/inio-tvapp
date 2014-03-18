/**
 * Scene abstract class
 *
 * @author Mautilus s.r.o.
 * @class Scene
 * @abstract
 * @extends View
 */
function Scene() {
	this.config = {
		/**
		 * @cfg {Boolean} focusOnRender Whether call a focus method after scene is rendered
		 */
		focusOnRender: true
	};
	
	View.apply(this, arguments);
};

Scene.prototype.__proto__ = View.prototype;

/**
 * @private
 */
Scene.prototype._onBeforeGoBack = function(fromScene) {
	if (this.onBeforeGoBack.apply(this, arguments) === false) {
		return false;
	}

	this.trigger('beforegoback', fromScene);
};
/*
 * This method is called, when you use Router.goBack on active scene, the
 * last scene fires this method with the name of the current scene.
 *
 * @template
 * @param {String} sceneName
 */
Scene.prototype.onBeforeGoBack = function(fromScene) {

};
/**
 * Refresh is called by the Router when scene is already visible, you can call anytime you need
 *
 * @template
 */
Scene.prototype.refresh = function() {

};