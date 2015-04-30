module.exports = function( gulp, plugins ) {
    // optimize images
    gulp.task( 'images', 'compresses images and moves them to the build folder', function() {
        return gulp.src( [ 'src/img/**' ] )
            .pipe( plugins.newer( 'build/img' ) )
            .pipe( plugins.image() )
            .pipe( gulp.dest( 'build/img' ) );
    } );

    gulp.task( 'watch:images', 'watches the source images for changes and runs the images task', function() {
        gulp.watch( 'src/img/**/*', [ 'images' ] );
    } );
};
