module.exports = function( gulp, plugins ) {
    gulp.task( 'build', 'builds a development version of the site', [
        'build:js',
        'templates',
        'build:scss',
        'images'
    ] );
};
