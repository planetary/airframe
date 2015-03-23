module.exports = function( gulp, plugins ) {
    // optimize images
    gulp.task( 'images', function() {
        return gulp.src( [ 'src/img/**' ] )
            .pipe( plugins.newer( 'build/img' ) )
            .pipe( plugins.image() )
            .pipe( gulp.dest( 'build/img' ) );
    } );

    gulp.task( 'watch:images', function() {
        gulp.watch( 'src/img/**/*.scss', [ 'images' ] );
    } );
};
