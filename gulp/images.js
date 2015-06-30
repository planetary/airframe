var browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    var paths = {
        'build': [
            // images that should be compressed
            'assets/images/**/*'
        ],
        // destination folder
        'output': 'build/images'
    };


    gulp.task('build:images', 'compresses images and moves them to the build folder', function() {
        return gulp.src(paths.build)
            .pipe(plugins.newer(paths.output))
            .pipe(plugins.imagemin())
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'Image minification complete', 'onLast': true}));
    });


    gulp.task('watch:images', 'watches the source images folders and recompresses them when ' +
                              'changed', ['build:images'], function() {
        gulp.watch(paths.build, ['build:images']);
    });
};
