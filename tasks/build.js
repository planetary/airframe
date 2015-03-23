module.exports = function( gulp, plugins ) {
    gulp.task( 'build', [
        'bundle:dev',
        'templates',
        'styles',
        'images'
    ] );
};
