var browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    var paths = {
        'input': [
            // fonts that should be compressed
            'assets/fonts/**/*'
        ],
        // destination path
        'output': 'build/fonts'
    };

    gulp.task('build:fonts', 'moves fonts to the build folder', function() {
        return gulp.src(paths)
            .pipe(plugins.newer(paths.output))
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'Font compilation complete', 'onLast': true}));
    });

    gulp.task('watch:fonts', 'watches the source fonts for changes and moves them to the build ' +
                             'folder when they do', ['build:fonts'], function() {
        gulp.watch(paths, ['build:fonts']);
    });
};
