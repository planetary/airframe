module.exports = function( gulp, plugins ) {
    gulp.task( 'js-lint', function() {
        gulp.src( [
            'controllers/**/*.js',
            'public/**/*.js',
            'lib/**/*.js',
            'models/**/*.js'
        ] ).pipe( plugins.jshint() );
    } );

    gulp.task( 'watch:js-lint', function() {
        gulp.watch( [
            'controllers/**/*.js',
            'public/**/*.js',
            'lib/**/*.js',
            'models/**/*.js'
        ], [ 'js-lint' ] );
    } );
};
