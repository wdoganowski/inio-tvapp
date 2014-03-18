/**
 * Manages scenes
 *
 * @author Mautilus s.r.o.
 * @class Router
 * @singleton
 * @mixins Events
 * @mixins Deferrable
 */
var Router = (function() {
	function Factory() {
		Events.call(this);
		Deferrable.call(this);

		/**
		 * @property {Object} config General config hash
		 */
		this.config = null;
		/**
		 * @property {Array} scenes All registered scenes
		 */
		this.scenes = [];
		/**
		 * @property {Array} history Scene history
		 */
		this.history = [];
		/**
		 * @property {Scene} activeScene Currently active scene
		 */
		this.activeScene = null;
		/**
		 * @property {String} activeSceneName Currently active scene's name
		 */
		this.activeSceneName = null;
		/**
		 * @property {String} activeSceneArgs Currently active scene's arguments
		 */
		this.activeSceneArgs = null;

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;
	Factory.prototype.__proto__.__proto__ = Deferrable.prototype;

	/**
	 * @event scene
	 * Will be called when a scene is changed, args: sceneName, Scene, config
	 * @param {String} name
	 * @param {Object} scene
	 * @param {Array} arguments
	 */
	Factory.prototype.init = function(config) {
		this.configure(config);

		this.showPromise = null;
	};
	/**
	 * Set class config hash
	 *
	 * @param {Object} config Hash of parameters
	 */
	Factory.prototype.configure = function(config) {
		this.config = $.extend(true, this.config || {}, config);
	};
	/**
	 * Register new Scene
	 *
	 * @chainable
	 * @param {String} name Unique scene name
	 * @param {Scene} Scene
	 */
	Factory.prototype.addScene = function(name, Scene) {
		this.scenes[name] = Scene;
		return this;
	};
	/**
	 * Find registered scene by its name
	 *
	 * @param {String} name
	 * @returns {Scene} Returns FALSE if not found
	 */
	Factory.prototype.getScene = function(name) {
		return (this.scenes[name] || false);
	};
	/**
	 * Go to the specified scene
	 *
	 * @param {Boolean} [historyPush=false] Set to FALSE if you don't want to push this scene into a history stack
	 * @param {String} [name] Scene's name
	 * @returns {Scene} Return FALSE if failed
	 */
	Factory.prototype.go = function(name) {
		var args = Array.prototype.slice.call(arguments, 0),
			scene, currentScene, destruct = true,
			show, hide, onShow, onHide, historyPush, render, promise = new Promise();

		if (typeof name === 'boolean') {
			historyPush = name;
			name = args[1];
			args = args.slice(1);
		}

		console.log('[Router] Go to ' + name);

		onHide = function() {
			if (typeof scene === 'function') {
				currentScene = new scene(name, args.slice(1));

			} else {
				currentScene = scene;
			}

			this.showPromise = show = currentScene.show.apply(currentScene, args.slice(1));

			if (show instanceof Promise) {
				show.then(function(status) {
					if (status) {
						onShow.call(this);

					} else if (this.activeScene) {
						if (currentScene.revert() === true) {
							// go back if rejected
							this.go.apply(this, this.activeSceneArgs);
						}

						promise.reject();
					}
				}, this);

			} else if (show !== false) {
				onShow.call(this);

			} else {
				// go back if rejected
				this.go.apply(this, this.activeSceneArgs);

				promise.reject();
			}
		};

		onShow = function() {
			if (this.activeScene) {
				this.activeScene.remove();

				if (destruct) {
					this.activeScene.desctruct();
				}
			}

			if (historyPush !== false) {
				this.history.unshift(args);
			}

			this.activeScene = currentScene;
			this.activeSceneName = name;
			this.activeSceneArgs = args;

			this.trigger('scene', name, this.activeScene, args);

			render = this.activeScene.render();

			if (render instanceof Promise) {
				render.done(function() {
					this.activeScene.focus();
					promise.resolve();

				}, this).fail(function() {
					promise.reject();
				});

			} else {
				this.activeScene.focus();
				promise.resolve();
			}
		};

		if ((scene = this.getScene(name)) !== false) {
			if (this.activeScene === scene && this.activeScene.isVisible) {
				this.activeSceneArgs = args;

				if (typeof this.activeScene.refresh === 'function') {
					if (this.activeScene.refresh.apply(this.activeScene, this.activeSceneArgs.slice(1)) === false) {
						return false;
					}
				}
			}

			if (this.showPromise instanceof Promise && this.showPromise.state !== this.showPromise.STATE_RESOLVED) {
				this.showPromise.reject();
			}

			if (this.activeScene) {
				hide = this.activeScene.hide();

				if (hide instanceof Promise) {
					hide.then(function(status) {
						if (!status) {
							destruct = false;
						}

						onHide.call(this);
					}, this);

				} else if (hide === false) {
					destruct = false;
					onHide.call(this);

				} else {
					onHide.call(this);
				}

			} else {
				onHide.call(this);
			}
		}

		return promise;
	};
	/**
	 * Routes to the previous scene
	 *
	 * @returns {Scene} Return FALSE if failed
	 */
	Factory.prototype.goBack = function() {
		var args, promise, returnScene = null;

		if ((args = this.history.shift())) {
			if (args && args[0] === this.activeSceneName) {
				return this.goBack();
			}

			returnScene = (args && args[0] ? this.getScene(args[0]) : null);
			if (returnScene)
				returnScene.onBeforeGoBack(this.activeSceneName);
			promise = new Promise();

			this.go.apply(this, args).then(function(status) {
				if (status) {
					promise.resolve();

				} else {
					promise.reject();
				}
			});

		} else {
			promise = new Promise();
			promise.reject();
		}

		return promise;
	};
	/**
	 * Check, if given scene name is the current active scene
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 */
	Factory.prototype.isSceneActive = function(name) {
		return (this.activeSceneName === name);
	};
	/**
	 * Clear router history
	 */
	Factory.prototype.clearHistory = function() {
		this.history = [];
	};
	/**
	 * Shift the last scene from a history
	 *
	 * @param {String} [sceneName] sceneName
	 * @returns {Object}
	 */
	Factory.prototype.shiftHistory = function(sceneName) {
		if (sceneName) {
			if (this.history[0] && this.history[0][0] === sceneName) {
				return this.history.shift();
			}

			return false;
		}

		return this.history.shift();
	};

	return new Factory();
})();