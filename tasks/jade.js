var browserSync = require( 'browser-sync' );


module.exports = function( gulp, plugins ) {
    var paths = {
        'watch': [
            // jade files to watch for changes
            'src/templates/**/*.jade'
        ],
        'lint': [
            // jade files to lint (ignore vendor)
            'src/styles/**/*.scss',
            '!src/styles/vendor/**/*'
        ],
        'build': [
            // jade files to build
            'src/templates/views/**/*.jade',
            '!src/templates/views/**/_*.jade'
        ],
        // input folder
        'input': 'src/templates',
        // destination folder
        'output': 'build'
    };


    gulp.task( 'build:jade', 'compiles the jade templates to the build folder', function() {
        gulp.src( paths.build )
            .pipe( plugins.jade( { 'basedir': paths.input } ) )
            .on( 'error', plugins.notify.onError( function( err ) {
                return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
            } ) )
            .pipe( gulp.dest( paths.output ) )
            .pipe( browserSync.reload( { 'stream': true } ) )
            .pipe( plugins.notify( { 'message': 'Jade compilation complete', 'onLast': true } ) );
    } );


    gulp.task( 'watch:jade', 'watches the templates folder for changes and recompiles them',
               [ 'build:jade' ], function() {
        gulp.watch( paths.watch , [ 'build:jade' ] );
    } );
};
