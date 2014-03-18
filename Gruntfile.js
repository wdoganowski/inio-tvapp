module.exports = function(grunt, projectPath) {

	grunt.initConfig({
		pkg: grunt.file.readJSON(projectPath + '/package.json'),

		clean: ['dist'],

		concat: {
			options: {
				separator: ';',
				stripBanners: true
			},
			inio: {
				src: ['inio/inio.js', 'inio/*.js', 'inio/*/default.js'],
				dest: 'dist/inio.js'
			},
			inio_samsung: {
				src: ['inio/*/samsung.js'],
				dest: 'dist/inio.samsung.js'
			},
			inio_lg: {
				src: ['inio/*/lg.js'],
				dest: 'dist/inio.lg.js'
			},
			inio_philips: {
				src: ['inio/*/philips.js'],
				dest: 'dist/inio.philips.js'
			},
			inio_alliance: {
				src: ['inio/*/alliance.js'],
				dest: 'dist/inio.alliance.js'
			},
			inio_dunehd: {
				src: ['inio/*/dunehd.js'],
				dest: 'dist/inio.dunehd.js'
			},
			framework: {
				src: ['framework/helpers.js', 'framework/deferrable.js', 'framework/events.js', 'framework/model.js', 'framework/**/*.js'],
				dest: 'dist/framework.js'
			},
			application: {
				src: ['application/**/*.js'],
				dest: 'dist/application.js'
			},
			content: {
				src: ['content/**/*.js'],
				dest: 'dist/content.js'
			}
		},

		uglify: {
			options: {
				mangle: true,
				compress: true,
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy hh:MM") %> */\n'
			},
			dist: {
				files: {
					'dist/inio.min.js': ['<%= concat.inio.dest %>'],
					'dist/inio.samsung.min.js': ['<%= concat.inio_samsung.dest %>'],
					'dist/inio.lg.min.js': ['<%= concat.inio_lg.dest %>'],
					'dist/inio.philips.min.js': ['<%= concat.inio_philips.dest %>'],
					'dist/inio.alliance.min.js': ['<%= concat.inio_alliance.dest %>'],
					'dist/inio.dunehd.min.js': ['<%= concat.inio_dunehd.dest %>'],
					'dist/framework.min.js': ['<%= concat.framework.dest %>'],
					'dist/application.min.js': ['<%= concat.application.dest %>'],
					'dist/content.min.js': ['<%= concat.content.dest %>']
				}
			}
		},

		package: {
			samsung: {
				ignore: ['/dist', '/inio', '/framework', '/application', '/bundle', '/content', '/template', '/css', '/Gruntfile.js', '/package.json'],
				scripts: ['dist/inio.min.js', 'dist/inio.samsung.min.js', 'dist/framework.min.js', 'dist/application.min.js', 'dist/content.min.js'],
				styles: ['dist/main.css'],
				templates: 'template/*.mustache',
				enclose: {
					'config.xml': 'bundle/samsung/config.xml',
					'widget.info': 'bundle/samsung/widget.info'
				},
				dest: 'dist/package/samsung/<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmddhhMM") %>.zip'
			},
			lg: {
				ignore: ['/dist', '/inio', '/framework', '/application', '/bundle', '/content', '/template', '/css', '/Gruntfile.js', '/package.json'],
				scripts: ['dist/inio.min.js', 'dist/inio.lg.min.js', 'dist/framework.min.js', 'dist/application.min.js', 'dist/content.min.js'],
				styles: ['dist/main.css'],
				templates: 'template/*.mustache',
				dest: 'dist/package/lg/<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmddhhMM") %>.zip'
			},
			philips: {
				ignore: ['/dist', '/inio', '/framework', '/application', '/bundle', '/content', '/template', '/css', '/Gruntfile.js', '/package.json'],
				scripts: ['dist/inio.min.js', 'dist/inio.philips.min.js', 'dist/framework.min.js', 'dist/application.min.js', 'dist/content.min.js'],
				styles: ['dist/main.css'],
				templates: 'template/*.mustache',
				dest: 'dist/package/philips/<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmddhhMM") %>.zip'
			},
			alliance: {
				ignore: ['/dist', '/inio', '/framework', '/application', '/bundle', '/content', '/template', '/css', '/Gruntfile.js', '/package.json'],
				scripts: ['dist/inio.min.js', 'dist/inio.alliance.min.js', 'dist/framework.min.js', 'dist/application.min.js', 'dist/content.min.js'],
				styles: ['dist/main.css'],
				templates: 'template/*.mustache',
				dest: 'dist/package/alliance/<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmddhhMM") %>.zip'
			},
			dunehd: {
				ignore: ['/dist', '/inio', '/framework', '/application', '/bundle', '/content', '/template', '/css', '/Gruntfile.js', '/package.json'],
				scripts: ['dist/inio.min.js', 'dist/inio.dunehd.min.js', 'dist/framework.min.js', 'dist/application.min.js', 'dist/content.min.js'],
				styles: ['dist/main.css'],
				templates: 'template/*.mustache',
				dest: 'dist/package/dunehd/<%= pkg.name %>_<%= pkg.version %>_<%= grunt.template.today("yyyymmddhhMM") %>.zip'
			}
		},

		less: {
			production: {
				options: {
					paths: ['css'],
					cleancss: true
				},
				files: {
					'dist/main.css': 'css/main.less'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');

	// additional available modules
	//grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-sass');
	//grunt.loadNpmTasks('grunt-contrib-handlebars');
	//grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('build', ['clean', 'concat', 'uglify', 'less', 'package']);

};