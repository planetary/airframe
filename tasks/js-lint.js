module.exports = function( gulp, plugins ) {
    gulp.task( 'js-lint', 'runs jshint against the unbundled scripts', function() {
        gulp.src( [
            'src/scripts/**/*.js',
            '!src/scripts/vendor/**/*'
        ] ).pipe( plugins.jshint() );
    } );

    gulp.task( 'watch:js-lint', 'watches src/scripts/ for changes and runs the js-lint task', function() {
        gulp.watch( [
            'src/scripts/**/*.js',
            '!src/scripts/vendor/**/*'
        ], [ 'js-lint' ] );
    } );
};
