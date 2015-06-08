module.exports = function( gulp, plugins ) {
    gulp.task( 'build', 'builds a development version of the site', [
        'build:img',
        'build:jade',
        'build:js',
        'build:scss'
    ] );
};
