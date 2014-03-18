/**
 * Component.brightcove.search
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.search
 * @extends Component
 */
Component.brightcove.search = function() {
	Component.apply(this, arguments);
};

Component.brightcove.search.prototype.__proto__ = Component.prototype;

/**
 * @inheritdoc Component#init
 */
Component.brightcove.search.prototype.init = function() {
	this.provider = Content.find('providers.brightcove');
};
/**
 * @inheritdoc Component#defaultAttributes
 */
Component.brightcove.search.prototype.defaultAttributes = function() {
	return {
		'all': '',
		'any': '',
		'none': '',
		'sort_by': 'DISPLAY_NAME:ASC',
		'page_size': 99
	};
};
/**
 * @inheritdoc Component#normalize
 */
Component.brightcove.search.prototype.normalize = function(attrs) {
	var model = {
		id: attrs.id,
		title: attrs.name,
		coverImg: attrs.videoStillURL,
		thumbnail: attrs.thumbnailURL,
		description: attrs.longDescription,
		duration: attrs.length,
		videoUrl: attrs.HLSURL
	};

	if (attrs.customFields) {
		Inio.extend(model, {
			actors: attrs.customFields.actors.split(/\,\s?/),
			directors: attrs.customFields.directors.split(/\,\s?/),
			countries: attrs.customFields.countries.split(/\,\s?/),
			parentalRating: attrs.customFields.parentalrating,
			rating: attrs.customFields.rating,
			year: attrs.customFields.year
		});
	}

	return model;
};
/**
 * @inheritdoc Component#load
 */
Component.brightcove.search.prototype.load = function(filterId) {
	var promise = new Promise();

	Content.ajax(this.provider.attr('endpoint'), {
		type: 'json',
		data: {
			command: 'search_videos',
			all: this.attr('all'),
			any: this.attr('any'),
			none: this.attr('none'),
			video_fields: 'id%2Cname%2ClongDescription%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CHLSURL',
			media_delivery: 'http_ios',
			sort_by: this.attr('sort_by'),
			page_size: this.attr('page_size'),
			token: this.provider.attr('token')
		}
	}).done(function(resp) {
		if (resp && resp.items) {
			this.populate(resp.items).done(function() {
				promise.resolve();
			}, this);
		}
	}, this);

	return promise.done(function() {
		this.loaded = true;
	}, this);
};