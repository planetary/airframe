module.exports = function( gulp, plugins ) {
    gulp.task( 'watch', 'watches all the files', [
        'watch:templates',
        'watch:styles',
        'watch:js-lint',
        'watch:bundle',
        'watch:images'
    ] );
};
