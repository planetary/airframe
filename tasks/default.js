module.exports = function( gulp, plugins ) {
    gulp.task( 'default', 'builds the site, serves it, and watches files for changes', [
        'build',
        'watch',
        'browser-sync'
    ] );
};
