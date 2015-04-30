module.exports = function( gulp, plugins ) {
    gulp.task( 'build', 'builds a development version of the site', [
        'bundle:dev',
        'templates',
        'styles',
        'images'
    ] );
};
