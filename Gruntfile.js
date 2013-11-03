module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		javascripts: ['public/javascripts/*.js', 'public/javascripts/**/*.js', '!public/javascripts/libs/*.js'],
		server_js: ['*.js'],
		uglify: {
			build: {
				src: '<%= javascripts %>',
				dest: 'public/publish/main.js'
			}
		},
		concat: {
			dist: {
				src: ['<%= javascripts %>'],
				dest: 'public/publish/main.js'				
			}
		},
		jshint: {
			client: ['Gruntfile.js', '<%= javascripts %>'],
			server: ['<%= server_js %>'],
			options: {
				sub: true,
				smarttabs: true,
				ignores: ['public/javascripts/libs/jquery-1.10.0.js', 'public/javascripts/libs/jquery-1.10.0.min.js']
			}
		},
		watch: {
			options:{
				livereload: true
			},
			scripts: {
				files: ['<%= javascripts %>'],
				tasks: ['javascripts']
			},
			server_js: {
				files: ['<%= server_js %>'],
				tasks: ['jshint:server'],
				options:{
					livereload: false
				}
			},
			jade: {
				files: ['public/index.jade', 'public/templates/*.jade'],
				tasks: ['jade']
			},
			styles: {
				files: ['public/stylesheets/*.styl'],
				tasks: ['stylus']
			}
		},
		jade: {
			compile: {
				options: {
					data: {
						debug: false
					}
				},
				files: {
					'public/index.html': 'public/index.jade'
				}
			}
		},
		stylus: {
			compile: {
				options: {
					'include css': true,
					'paths': ['public/stylesheets/styl'],
					'compress': true
				},
				files: {
					'public/publish/css.css': ['public/stylesheets/*.styl']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');

	grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'jade', 'stylus']);
	grunt.registerTask('javascripts', ['jshint:client', 'uglify', 'concat']);
};