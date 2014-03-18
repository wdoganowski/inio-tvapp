/**
 * Application class
 *
 * @author Mautilus s.r.o.
 * @class App
 * @singleton
 * @mixins Events
 * @mixins Deferrable
 */
var App = (function() {
	function Factory() {
		Events.call(this);
		Deferrable.call(this);

		/**
		 * @property {Boolean} networkStatus Network status, TRUE if connected
		 */
		this.networkStatus = true;

		// Initialize this class when Inio is ready
		Inio.ready(function() {
			this.init();
		}, this);
	};

	Factory.prototype.__proto__ = Events.prototype;
	Factory.prototype.__proto__.__proto__ = Deferrable.prototype;

	/**
	 * @event network
	 * Will be called when network status changes
	 * @param {Boolean} status
	 */

	/**
	 * Initialize Application
	 */
	Factory.prototype.init = function() {
		var preloader;

		preloader = this.displayPreloader();

		Content.init().done(function() {
			this.configuration = Content.find('configuration');
			this.sections = Content.find('filters.sections');

			this.sections.load().done(function() {
				preloader(function() {
					this.run();
				}, this);
			}, this);
		}, this);
	};
	/**
	 * Register scenes and route to the `main` scene
	 *
	 * @private
	 */
	Factory.prototype.run = function() {
		var scope = this;

		this.$viewport = $('#viewport');
		this.$viewport.show();

		this.$overlay = $('<div id="overlay" />').appendTo(this.$viewport);
		this.$throbber = $('<div class="throbber"><div /></div>').appendTo(this.$viewport);
		this.$throbberInner = this.$throbber.find('div');

		this.header = new View_Header();
		this.sidebar = new View_Sidebar();
		this.navigation = new View_Navigation();
		this.dialog_exit = new View_Dialog_Exit();
		this.dialog_exit.on('exit', function() {
			Device.exit();

		}).on('close', function() {
			this.sidebar.focus();
		}, this);

		this.navigation.setItems(this.sections);

		$('#preloader').hide();

		// monitor network connection
		setInterval(function() {
			scope.checkNetworkConnection();
		}, 1000);

		Router
			.addScene('home', new Scene_Home)
			.addScene('catalog', new Scene_Catalog)
			.addScene('detail', new Scene_Detail)
			.addScene('player', new Scene_Player);

		this.render().done(function() {
			this.navigation.hide();

			Router.go('home');
		}, this)
	};
	/**
	 * @private
	 */
	Factory.prototype.checkNetworkConnection = function() {
		Device.checkNetworkConnection(function(status) {
			if (status !== this.networkStatus) {
				this.networkStatus = status;
				this.trigger('network', this.networkStatus);
			}
		}, this);
	};

	Factory.prototype.displayPreloader = function() {
		var timer, updateBar, bar, val, percent = 0;

		bar = $('#preloader').find('.progress-bar > span');
		val = $('#preloader').find('.percentage-value');

		updateBar = function() {
			bar.width(percent + '%');
			val.text(percent + '%');
		};

		timer = setInterval(function() {
			percent += Math.round(Math.random() * 10);

			if (percent > 100) {
				percent = 100;
				clearInterval(timer);
			}

			updateBar();
		}, 700);

		return function(callback, scope) {
			percent = 100;
			updateBar();
			clearInterval(timer);

			setTimeout(function() {
				if (typeof callback === 'function') {
					callback.call(scope || this);
				}
			}, 400);
		};
	};

	Factory.prototype.render = function() {
		return this.all(this.header.renderTo(this.$viewport), this.sidebar.renderTo(this.$viewport), this.navigation.renderTo(this.$viewport));
	};

	Factory.prototype.exit = function() {
		this.dialog_exit.open();
	};

	Factory.prototype.throbber = function(delayed, cls) {
		this.$throbber.show();
		this.$throbberInner.width('100%');

		if(cls){
			this.$throbber.addClass(cls);
			this.$throbber._removeCls = cls;
		}

		if(this._throbberTimeout){
			clearTimeout(this._throbberTimeout);
		}
	};

	Factory.prototype.throbberHide = function(immediately) {
		var scope = this;

		this.$throbberInner.addClass('no-anim');

		if(this._throbberTimeout){
			clearTimeout(this._throbberTimeout);
		}

		this._throbberTimeout = setTimeout(function(){
			scope.$throbberInner.width(0).removeClass('no-anim');
			scope.$throbber.hide();

			if(scope.$throbber._removeCls){
				scope.$throbber.removeClass(scope.$throbber._removeCls);
				scope.$throbber._removeCls = null;
			}
		}, immediately ? 0 : 450);
	};

	return new Factory();
})();