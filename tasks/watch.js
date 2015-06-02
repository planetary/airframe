module.exports = function( gulp, plugins ) {
    gulp.task( 'watch', 'waits for changes in project files and attempts to rebuild them', [
        // Add your watch tasks here (must be prefixed with watch:)
        'watch:templates',
        'watch:scss',
        'watch:js',
        'watch:bundle',
        'watch:images'
    ] );
};
