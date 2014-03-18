/**
 * Playready class
 *
 * @author Mautilus s.r.o.
 * @class Playready
 * @mixins Events
 * @mixins Deferrable
 */
function Playready() {
	Events.call(this);
	Deferrable.call(this);

	this.construct.apply(this, arguments);
};

Playready.prototype.__proto__ = Events.prototype;
Playready.prototype.__proto__.__proto__ = Deferrable.prototype;

/**
 * Construct object
 *
 * @param {String} manifest Manifest URL address
 * @constructor
 */
Playready.prototype.construct = function(manifest) {
	this.ready = false;
	this.manifest = manifest;
};
/**
 * Destruct object
 *
 * @private
 */
Playready.prototype.desctruct = function() {

};
/**
 * @private
 */
Playready.prototype.setStreams = function(streams) {
	this.streams = streams || [];
};
/**
 * Get one stream by its type
 *
 * @param {String} type
 * @param {String} [name]
 * @param {String} [language]
 */
Playready.prototype.getStream = function(type, name, language) {
	for (var i in this.streams) {
		if (this.streams[i] && this.streams[i].type === type && ((language && this.streams[i].language === language)) || (name && this.streams[i].name === name)) {
			return this.streams[i];
		}
	}

	return false;
};
/**
 * Get array of streams by type, name or language
 *
 * @param {String} type
 */
Playready.prototype.getStreams = function(type) {
	var streams = [];

	for (var i in this.streams) {
		if (this.streams[i] && this.streams[i].type === type) {
			streams.push(this.streams[i]);
		}
	}

	return streams;
};
/**
 * Get subtitles
 *
 * @param {String} language
 * @param {Function} callback
 * @param {Object} cbscope
 */
Playready.prototype.getSubtitles = function(language, callback, cbscope) {
	var scope = this,
		stream = this.getStream('text', language),
		t = 0;

	if (stream) {
		this.subtitles = {};

		if (stream.cs) {
			for (var i in stream.cs) {
				if (stream.cs[i]) {
					if (stream.cs[i].t && !stream.cs[i].d) {
						t = parseInt(stream.cs[i].t);
					}

					Ajax.request(stream.url.replace(/\{bitrate\}/ig, stream.bitrate).replace(/\{start time\}/ig, t)).done((function(t) {
						return function(resp) {
							if (callback) {
								callback.call(cbscope || scope, scope.fixTTML(resp), t / 10000);
							}
						};
					})(t));

					if (stream.cs[i].d) {
						t += parseInt(stream.cs[i].d);
					}
				}
			}
		}
	}
};
/**
 * @private
 */
Playready.prototype.fixTTML = function(ttml) {
	ttml = ttml
		.replace(/^[^\<]+/, '')
		.replace(/\sp\d+\:/g, ' tts:')
		.replace(/\sxmlns\:p[45]/g, ' xmlns:tts');

	return ttml;
};
/**
 * Fetch manifest
 */
Playready.prototype.fetch = function() {
	var base = String(this.manifest).replace(/\/manifest$/i, '/');

	return Ajax.request(this.manifest, {
		type: 'xml'
	}).done(function(xml) {
		var streams = [],
			scope = this;

		if (xml) {
			xml = $(xml);

			xml.find('StreamIndex').each(function() {
				var stream = $(this),
					qLevel, cs = [];

				if (stream.attr('QualityLevels') == 1) {
					qLevel = stream.find('QualityLevel').eq(0);

					if (stream.attr('Type') === 'text') {
						stream.find('c').each(function() {
							var c = $(this);

							cs.push({
								t: c.attr('t') || '',
								n: c.attr('n'),
								d: c.attr('d') || ''
							});
						});
					}
				}

				streams.push({
					index: streams.length,
					type: stream.attr('Type') || '',
					subtype: stream.attr('Subtype') || '',
					language: stream.attr('Language') || '',
					name: stream.attr('Name') || '',
					url: stream.attr('Url') ? base + stream.attr('Url') : '',
					bitrate: qLevel ? qLevel.attr('Bitrate') : '',
					fourCC: qLevel ? qLevel.attr('FourCC') : '',
					cs: cs
				});
			});

			scope.setStreams(streams);
			scope.ready = true;
		}
	}, this);
};