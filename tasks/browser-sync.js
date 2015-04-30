var browserSync = require( 'browser-sync' );
var hygienist = require( 'hygienist-middleware' );

module.exports = function( gulp, plugins, path ) {
    gulp.task( 'browser-sync', 'serves the build using BrowserSync', function() {
        browserSync({
            server: {
                baseDir: "./build",
                middleware: hygienist("./build")
            }
        });
    } );
};
