/**
 * Component.brightcove.video
 *
 * @author Mautilus s.r.o.
 * @class Component.brightcove.video
 * @extends Component
 */
Component.brightcove.video = function() {
	Component.apply(this, arguments);
};

Component.brightcove.video.prototype.__proto__ = Component.prototype;

/**
 * @inheritdoc Component#init
 */
Component.brightcove.video.prototype.init = function() {
	this.provider = Content.find('providers.brightcove');
};
/**
 * @inheritdoc Component#defaultAttributes
 */
Component.brightcove.video.prototype.defaultAttributes = function() {
	return {};
};
/**
 * @inheritdoc Component#normalize
 */
Component.brightcove.video.prototype.normalize = function(attrs) {
	var model = {
		id: attrs.id,
		title: attrs.name,
		coverImg: attrs.videoStillURL,
		description: attrs.longDescription,
		duration: attrs.length,
		videoUrl: attrs.HLSURL // 'http://techslides.com/demos/sample-videos/small.ogv'
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
Component.brightcove.video.prototype.load = function(videoId) {
	var promise = new Promise();

	Content.ajax(this.provider.attr('endpoint'), {
		type: 'json',
		data: {
			command: 'find_video_by_id',
			video_id: videoId,
			video_fields: 'id%2Cname%2CshortDescription%2ClongDescription%2CpublishedDate%2Ctags%2CcustomFields%2CvideoStillURL%2CthumbnailURL%2Clength%2CplaysTotal%2CplaysTrailingWeek%2CHLSURL',
			media_delivery: 'http_ios',
			token: this.provider.attr('token')
		}
	}).done(function(resp) {
		if (resp && resp.id) {
			this.populate([resp]).done(function() {
				promise.resolve();
			}, this);
		}
	}, this);

	return promise.done(function() {
		this.loaded = true;
	}, this);
};