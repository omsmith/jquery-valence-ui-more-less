var coveralls = require('gulp-coveralls'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	vui = require('vui-helpers');

gulp.task( 'jshint', function() {
	return gulp.src( ['gulpfile.js', 'moreLess.js', 'test/*.js'] )
		.pipe( jshint() )
		.pipe( jshint.reporter('default') );
} );

gulp.task( 'coverage', function() {
	return gulp.src( 'test/output/coverage/**/lcov.info' )
		.pipe( coveralls() );
} );

gulp.task( 'test', [ 'jshint' ], function () {
	return vui.test( {
		files: [
			'bower_components/jquery/jquery.min.js',
			'bower_components/jquery.ui/ui/jquery.ui.core.js',
			'bower_components/jquery.ui/ui/jquery.ui.widget.js',
			'moreLess.js',
			'test/**/*Spec.js',
			'moreLess.css'
		],
		preprocessors: {
			'moreLess.js': ['coverage']
		}
	} ) ;
} );
