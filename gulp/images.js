var browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    var paths = [
        // images that should be compressed
        'assets/images/**/*'
    ];


    gulp.task('build:images', 'compresses images and moves them to the build folder', function() {
        return gulp.src(paths, {'base': gulp.inputPath})
            .pipe(plugins.newer(gulp.outputPath))
            .pipe(plugins['if'](
                // don't minify during development
                ['development', '', undefined].indexOf(process.env.NODE_ENV) === -1,
                plugins.imagemin()
            ))
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'Image minification complete', 'onLast': true}));
    });


    gulp.task('watch:images', 'watches the source images folders and recompresses them when ' +
                              'changed', ['build:images'], function() {
        gulp.watch(paths, ['build:images']);
    });
};
