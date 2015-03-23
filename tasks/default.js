module.exports = function( gulp, plugins ) {
    gulp.task( 'default', [
        'build',
        'watch',
        'serve'
    ] );
};
