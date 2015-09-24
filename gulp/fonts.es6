const browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    const paths = [
        // fonts that should be compressed
        'assets/fonts/**/*'
    ];


    gulp.task('build:fonts', 'moves fonts to the build folder', function() {
        return gulp.src(paths, {'base': gulp.inputPath})
            .pipe(plugins.newer(gulp.outputPath))
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'Font compilation complete', 'onLast': true}));
    });


    gulp.task(
        'watch:fonts',
        'watches the source fonts for changes and moves them to the build folder when they do',
        ['build:fonts'], function() {
            gulp.watch(paths, ['build:fonts']);
        }
    );
};
