'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	assets = require('./assets'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins({
		rename: {
			'gulp-angular-templatecache': 'templateCache'
		}
	});

// CSS linting task
function csslint() {
	return gulp.src(assets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter());
}

// JS linting task
function jshint() {
	var _assets = _.union(
		assets.server.gulpConfig,
		assets.client.js
	);

	return gulp.src(_assets)
		.pipe(plugins.jshint().on('error', function (e) {
			console.log(e);
		}))
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
}

// JS minifying task
function uglify() {
	var _assets = _.union(
		assets.client.js,
		assets.client.templates
	);

	return gulp.src(_assets, { allowEmpty: true })
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('application.min.js'))
		.pipe(gulp.dest('./postfirerecovery/static/dist/'));
}

// CSS minifying task
function cssmin() {
	return gulp.src(assets.client.css)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat('application.min.css'))
		.pipe(gulp.dest('./postfirerecovery/static/dist/'));
}

// Lint CSS and JavaScript files.
const lint = gulp.series(csslint, jshint);

function watch() {
	gulp.watch(assets.client.js, gulp.series(uglify));
	gulp.watch(assets.client.css, gulp.series(cssmin));
}

// Lint project files and minify them into two production files.
const build = gulp.series(lint, gulp.parallel(uglify, cssmin));

// Export the tasks
exports.csslint = csslint;
exports.jshint = jshint;
exports.uglify = uglify;
exports.cssmin = cssmin;
exports.lint = lint;
exports.watch = watch;
exports.build = build;
exports.default = build;  // set the default task in case you run just `gulp`
