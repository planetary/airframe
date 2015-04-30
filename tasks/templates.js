var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

module.exports = function( gulp, plugins ) {
    var errorHandler = function( err ) {
        plugins.notify.onError( {
            message: "<" + "%= error.message %" + ">"
        } ).apply( this, arguments );

        this.emit( 'end' );
    };

    // compile jade files
    gulp.task( 'templates', 'compiles the jade templates to the build folder', function() {
        gulp.src( [ 'src/templates/views/**/*.jade', '!src/templates/views/**/_*.jade' ] )
            .pipe( plugins.jade( {
                basedir: 'src/templates'
            } ) )
            .on( 'error', errorHandler )
            .pipe( gulp.dest( 'build' ) )
            .pipe( reload( { stream:true } ) );
    } );

    gulp.task( 'watch:templates', 'watches the templates for changes and runs the templates task', function() {
        gulp.watch( 'src/templates/**/*.jade', [ 'templates' ] );
    } );
};
