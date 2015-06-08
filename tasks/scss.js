var browserSync = require( 'browser-sync' );


module.exports = function( gulp, plugins ) {
    var paths = {
        'watch': [
            // scss files to watch for changes
            'src/styles/**/*.scss'
        ],
        'lint': [
            // scss files to lint (ignore vendor)
            'src/styles/**/*.scss',
            '!src/styles/vendor/**/*'
        ],
        'build': [
            // scss files to build
            'src/styles/main.scss'
        ],
        // destination folder
        'output': 'build/css'
    };


    gulp.task( 'build:scss', 'rebuilds all scss files', function() {
        gulp
            .src( paths.build )
            .pipe( plugins.sourcemaps.init() )
            .pipe( plugins.sass() )
            .on( 'error', plugins.notify.onError( function( err ) {
                return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
            } ) )
            .pipe( plugins.autoprefixer() )
            .pipe( plugins.minifyCss() )
            .pipe( plugins.sourcemaps.write( '.' ) )
            .pipe( gulp.dest( paths.output ) )
            .pipe( browserSync.reload( { 'stream': true } ) )
            .pipe( plugins.notify( { 'message': 'SCSS compilation complete', 'onLast': true } ) );
    } );


    gulp.task( 'watch:scss:incremental', 'only rebuilds changed scss files', function() {
        return gulp.watch( paths.watch, [ 'build:scss' ] );
    } );


    gulp.task( 'watch:scss', 'waits for scss files to change, then rebuilds them', [
        'build:scss',
        'watch:scss:incremental'
    ] );


    gulp.task( 'lint:scss', 'lints all scss files with scss-lint', function() {
        return gulp
            .src( paths.lint )
            .pipe( plugins.scssLint( { 'customReport': plugins.scssLintStylish } ) )
            .pipe( plugins.scssLint.failReporter() );
    } );
};
