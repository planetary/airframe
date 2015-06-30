module.exports = function(gulp) {
    gulp.task('build', 'builds all the registered static resources from assets into build', [
        // Add your build tasks here (must be prefixed with build:)
        'build:fonts',
        'build:images',
        'build:scripts',
        'build:styles',
        'build:templates'
    ]);
};
