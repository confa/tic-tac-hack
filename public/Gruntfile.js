module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		javascripts: ['javascripts/*.js', 'javascripts/**/*.js', '!javascripts/libs/*.js'],
		uglify: {
			build: {
				src: '<%= javascripts %>',
				dest: 'publish/main.js'
			}
		},
		concat: {
			dist: {
				src: ['<%= javascripts %>'],
				dest: 'publish/main.js'				
			}
		},
		jshint: {
			all: ['Gruntfile.js', '<%= javascripts %>'],
			options: {
				sub: true,
				smarttabs: true,
				ignores: ['javascripts/libs/jquery-1.10.0.js', 'javascripts/libs/jquery-1.10.0.min.js']
			}
		},
		watch: {
			scripts: {
				files: ['<%= javascripts %>'],
				tasks: ['javascripts']
			},
			jade: {
				files: ['index.jade'],
				tasks: ['jade']
			},
			styles: {
				files: ['stylesheets/*.styl'],
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
					'index.html': 'index.jade'
				}
			}
		},
		stylus: {
			compile: {
				options: {
					'include css': true,
					'paths': ['stylesheets/styl'],
					'compress': true
				},
				files: {
					'publish/css.css': ['stylesheets/*.styl']
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');

	grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'jade', 'stylus']);
	grunt.registerTask('javascripts', ['jshint', 'uglify', 'concat']);
};