module.exports = function(gulp) {
    gulp.task('watch', 'waits for changes in project files and attempts to rebuild them', [
        // Add your watch tasks here (must be prefixed with watch:)
        'watch:fonts',
        'watch:images',
        'watch:scripts',
        'watch:styles',
        'watch:templates'
    ]);
};
