/**
 * Component.brightcove.filter
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.filter
 * @extends Component
 */
Component.brightcove.filter = function() {
	Component.apply(this, arguments);
};

Component.brightcove.filter.prototype.__proto__ = Component.prototype;

/**
 * @inheritdoc Component#init
 */
Component.brightcove.filter.prototype.init = function() {
	this.provider = Content.find('providers.brightcove');
};
/**
 * @inheritdoc Component#defaultAttributes
 */
Component.brightcove.filter.prototype.defaultAttributes = function() {
	return {};
};
/**
 * @inheritdoc Component#load
 */
Component.brightcove.filter.prototype.load = function() {
	var promise = new Promise();

	Content.ajax(this.provider.attr('endpoint'), {
		type: 'json',
		data: {
			command: 'find_all_playlists',
			page_size: 99,
			page_number: 0,
			get_item_count: true,
			playlist_fields: 'id%2Cname',
			token: this.provider.attr('token')
		}
	}).done(function(resp) {
		if (resp && resp.items) {
			var items = [];

			for (var i in resp.items) {
				if (resp.items[i]) {
					items.push({
						id: resp.items[i].id,
						title: resp.items[i].name
					});
				}
			}

			this.populate(items).done(function() {
				promise.resolve();
			}, this);
		}
	}, this);

	return promise.done(function() {
		this.loaded = true;
	}, this);
};