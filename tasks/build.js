module.exports = function( gulp, plugins ) {
    gulp.task( 'build', 'builds a development version of the site', [
        'build:img',
        'build:js',
        'templates',
        'build:scss',
    ] );
};
