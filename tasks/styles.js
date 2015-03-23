
//this will handle errors for us
var handleError = function( err ) {
    console.log( err.toString() );
    this.emit( 'end' );
};

module.exports = function( gulp, plugins ) {
    // concat, minify css
    gulp.task( 'styles', function() {
        gulp.src(['./src/styles/**/*.scss'])
        .pipe( plugins.sass( {
            sourcemap: true,
            sourcemapPath: 'src/styles'
        } ) )
        .on( 'error', handleError )
        .pipe( plugins.csso() )
        .pipe( plugins.autoprefixer() )
        .pipe( gulp.dest( './build/css' ) )
        .pipe( plugins.notify( { message: 'scss compilation complete', onLast: true } ) );
    } );

    gulp.task( 'watch:styles', function() {
        gulp.watch( 'src/styles/**/*.scss', [ 'scss-lint', 'styles' ] );
    } );
};