module.exports = function( gulp, plugins ) {
    var paths = [
        // JS files to watch and lint
        'tasks/*.js',
        'src/scripts/**/*.js',
        '!src/scripts/vendor/**/*'
    ];


    gulp.task( 'lint:js', 'lints all javascript files with both jscs and jshint', function() {
        return gulp
            .src( paths )
            .pipe( plugins.jshint() )
            .pipe( plugins.jscs() )
            .on( 'error', function() { } )
            .pipe( plugins.jscsStylish.combineWithHintResults() )
            .pipe( plugins.jshint.reporter( 'jshint-stylish' ) )
            .pipe( plugins.jshint.reporter( 'fail' ) );
    } );


    gulp.task( 'watch:js', 'waits for javascript files to change, then lints them ', function() {
        return gulp.watch( paths, [ 'lint:js' ] );
    } );
};
