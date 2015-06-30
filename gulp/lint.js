module.exports = function(gulp) {
    gulp.task('lint', 'runs all registered linters and out prints any detected issues', [
        // Add your lint tasks here (must be prefixed with lint:)
        'lint:scripts',
        'lint:styles'
    ]);
};
