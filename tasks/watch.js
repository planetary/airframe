module.exports = function( gulp, plugins ) {
    gulp.task( 'watch', [
        'watch:templates',
        'watch:styles',
        'watch:js-lint',
        'watch:bundle',
        'watch:images'
    ] );
};
