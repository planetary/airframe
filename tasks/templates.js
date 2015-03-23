module.exports = function( gulp, plugins ) {
    var errorHandler = function( err ) {
        plugins.notify.onError( {
            message: "<" + "%= error.message %" + ">"
        } ).apply( this, arguments );

        this.emit( 'end' );
    };

    // compile jade files
    gulp.task( 'templates', function() {
        gulp.src( [ 'src/templates/views/**/*.jade', '!src/templates/views/**/_*.jade' ] )
            .pipe( plugins.jade( {
                basedir: 'src/templates'
            } ) )
            .on( 'error', errorHandler )
            .pipe( gulp.dest( 'build' ) );
    } );

    gulp.task( 'watch:templates', function() {
        gulp.watch( 'src/templates/**/*.jade', [ 'templates' ] );
    } );
};
