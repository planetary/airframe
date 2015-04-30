//this will handle errors for us
var handleError = function( err ) {
    console.log( err.toString() );
    this.emit( 'end' );
};

var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;

module.exports = function( gulp, plugins ) {
    // concat, minify css
    gulp.task( 'styles', 'compiles the scss to the build folder', function() {
        gulp.src(['./src/styles/**/*.scss'])
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.sass())
        .on( 'error', handleError )
        .pipe( plugins.minifyCss() )
        .pipe( plugins.autoprefixer() )
        .pipe( plugins.sourcemaps.write() )
        .pipe( gulp.dest( './build/css' ) )
        .pipe( reload( { stream: true } ) )
        .pipe( plugins.notify( { message: 'scss compilation complete', onLast: true } ) );
    } );

    gulp.task( 'watch:styles', 'watches the scss files and runs the styles task', function() {
        gulp.watch( 'src/styles/**/*.scss', [ 'scss-lint', 'styles' ] );
    } );
};
