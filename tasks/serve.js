var extend = require( 'util' )._extend,
    http = require( 'http' ),
    ecstatic = require( 'ecstatic' );

module.exports = function( gulp, plugins, path ) {
    gulp.task( 'serve', function() {
        var port = 4900;
        http.createServer( ecstatic( {
            root: 'build',
            cache: 0
        } ) ).listen( port );

        plugins.util.log( plugins.util.colors.blue( 'Server started, listening on ' + port ) );
    } );
};
