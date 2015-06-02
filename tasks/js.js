module.exports = function( gulp, plugins ) {
    var watching = false;
    var paths = [
        // JS files to watch and lint
        'tasks/*.js',
        'src/scripts/**/*.js',
        '!src/scripts/vendor/**/*'
    ];


    gulp.task( 'lint:js:jscs', 'lints all javascript files with jscs', function() {
        return gulp
            .src( paths )
            .pipe( plugins.jscs() )
            .pipe( plugins.jscsStylish() );
    } );


    gulp.task( 'lint:js:jshint', 'lints all javascript files with jshint', function() {
        return gulp
            .src( paths )
            .pipe( plugins.jshint() )
            .pipe( plugins.jshint.reporter( 'jshint-stylish' ) )
            .pipe( plugins.if( !watching, plugins.jshint.reporter( 'fail' ) ) );
    } );


    gulp.task( 'lint:js', 'lints all javascript files with both jscs and jshint', [
        'lint:js:jshint',
        'lint:js:jscs'
    ] );


    gulp.task( 'watch:js', 'waits for javascript files to change, then lints them ', function() {
        watching = true;

        return gulp.watch( paths, [ 'lint:js' ] );
    } );
};
