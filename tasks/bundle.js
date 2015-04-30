/**
 * Compile JavaScript with Browserify.
 *
 * ---------------------------------------------------------------
 *
 * Compiles the js bundle from `src/js` into a single file and places
 * them into `build/js` directory.
 *
 */
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var watchify = require( 'watchify' );
var browserify = require( 'browserify' );

var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

module.exports = function( gulp, plugins, path ) {
    var errorHandler = function( err ) {
        plugins.notify.onError( {
            message: "<" + "%= error.message %" + ">"
        } ).apply( this, arguments );

        this.emit( 'end' );
    };

    var entryPoints = [ './src/scripts/index.js' ];

    var args = watchify.args;
    args.extensions = [ '.jsx' ];
    args.debug = true;
    args.fullPaths = false;
    args.insertGlobals = true;

    var bundler = browserify( entryPoints, args );

    // add any other browserify options or transforms here
    bundler.transform( 'brfs' );
    bundler.transform( 'bulkify' );

    gulp.task( 'bundle:dev', 'watches src/scripts/index.js require tree for changes and runs browserify', bundle ); // so you can run `gulp bundle:dev` to build the file

    gulp.task( 'watch:bundle', 'runs browserify, using src/scripts/index.js as an entry point', function() {
        var watcher = watchify( bundler );
        watcher.on( 'update', bundle ); // on any dep update, runs the bundler
        bundle();
    } );

    function bundle() {
      return bundler.bundle()
        // log errors if they happen
        .on( 'error', errorHandler )
        .pipe( source( 'bundle.js' ) )
        // optional, remove if you dont want sourcemaps
          .pipe( buffer() )
          .pipe( plugins.sourcemaps.init( { loadMaps: true } ) ) // loads map from browserify file
          .pipe( plugins.sourcemaps.write( './' ) ) // writes .map file
        //
        .pipe( gulp.dest( './build/js' ) )
        .pipe( reload( { stream: true } ) )
        .pipe( plugins.notify( { message: 'browserify bundler task complete', onLast: true } ) );
    }
};
