var browserSync = require( 'browser-sync' ),
    ecstatic = require( 'ecstatic' ),
    http = require( 'http' );


module.exports = function( gulp ) {
    var paths = [
        // files that should be watched for changes and pushed onto browsers when they do
        './build/**/*'
    ];
    var ports = {
        'frontend': 3000,
        'backend': 4900
    };


    gulp.task( 'serve:browsersync', 'proxies the localhost server via BrowserSync to ' +
                                    'dynamically update assets', function() {
        browserSync( {
            'port': ports.frontend,
            'files': paths,
            'proxy': 'http://localhost:' + ports.backend
        } );
    } );


    gulp.task( 'serve', 'serves static templates locally', [ 'serve:browsersync' ], function() {
        // quick hack; should be replaced with nodemon or something similar as a backend is decided
        http.createServer( ecstatic( {
            'root': './build',
            'cache': 0
        } ) ).listen( ports.backend );
    } );
};
