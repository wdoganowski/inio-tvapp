/**
 * Component.brightcove.playlist
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.playlist
 * @extends Component
 */
Component.brightcove.playlist = function() {
	Component.apply(this, arguments);
};

Component.brightcove.playlist.prototype.__proto__ = Component.prototype;

/**
 * @inheritdoc Component#init
 */
Component.brightcove.playlist.prototype.init = function() {
	this.provider = Content.find('providers.brightcove');
};
/**
 * @inheritdoc Component#defaultAttributes
 */
Component.brightcove.playlist.prototype.defaultAttributes = function() {
	return {};
};
/**
 * @inheritdoc Component#normalize
 */
Component.brightcove.playlist.prototype.normalize = function(attrs) {
	var model = {
		id: attrs.id,
		title: attrs.name,
		coverImg: attrs.videoStillURL,
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
Component.brightcove.playlist.prototype.load = function(filterId) {
	var promise = new Promise();

	Content.ajax(this.provider.attr('endpoint'), {
		type: 'json',
		data: {
			command: 'find_playlist_by_id',
			playlist_id: filterId,
			playlist_fields: 'id%2Cname%2Cvideos%2CvideoIds',
			video_fields: 'id%2Cname%2ClongDescription%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CHLSURL',
			media_delivery: 'http_ios',
			token: this.provider.attr('token')
		}
	}).done(function(resp) {
		if (resp && resp.videos) {
			this.populate(resp.videos).done(function() {
				promise.resolve();
			}, this);
		}
	}, this);

	return promise.done(function() {
		this.loaded = true;
	}, this);
};