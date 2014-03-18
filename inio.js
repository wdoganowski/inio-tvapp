var Inio_JSON = [{
	"component": "wrapper",
	"id": "filters",
	"attrs": {
		"title": "Filters",
		"allowedComponents": ["wrapper"]
	},
	"items": [{
		"component": "wrapper",
		"id": "sections",
		"attrs": {
			"title": "Sections",
			"allowedComponents": ["filter"]
		},
		"items": [{
			"component": "filter",
			"id": "home",
			"attrs": {
				"title": "Home",
				"icon": "home",
				"href": "home"
			},
			"items": []
		}, {
			"component": "filter",
			"id": "movies",
			"attrs": {
				"title": "Movies",
				"icon": "movies"
			},
			"items": [{
				"component": "brightcove.filter",
				"id": "brightcove",
				"attrs": {}
			}]
		}]
	}]
}, {
	"component": "wrapper",
	"id": "content",
	"attrs": {
		"title": "Content",
		"allowedComponents": ["wrapper", "brightcove.search", "brightcove.playlist", "brightcove.video"]
	},
	"items": [{
		"component": "brightcove.search",
		"id": "carousel",
		"attrs": {
			"all": "tag:carousel",
			"any": "",
			"none": ""
		}
	}, {
		"component": "brightcove.search",
		"id": "editors_choice",
		"attrs": {
			"all": "tag:editors_choice",
			"any": "",
			"none": ""
		}
	}, {
		"component": "brightcove.playlist",
		"id": "catalog",
		"attrs": {}
	}, {
		"component": "brightcove.video",
		"id": "detail",
		"attrs": {}
	}]
}, {
	"component": "wrapper",
	"id": "providers",
	"attrs": {
		"title": "Providers",
		"allowedComponents": ["brightcove"]
	},
	"items": [{
		"component": "brightcove",
		"id": "brightcove",
		"attrs": {
			"token": "epI8wg4rr0ZrvlaudDayPIg4df-Ho-o_6D_lsvq8O3RE1Dkwk5DTGA.."
		}
	}]
}, {
	"component": "configuration",
	"id": "configuration",
	"attrs": {
		"version": "1.0.1",
		"appName": "inio"
	}
}];