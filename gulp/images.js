const CONFIG = {
    paths: [
        // images that should be compressed
        'assets/images/**/*'
    ]
};


const browserSync = require('browser-sync');


module.exports = function(gulp, plugins, env) {
    gulp.task('build:images', 'compresses images and moves them to the build folder', function() {
        return gulp.src(CONFIG.paths, {base: gulp.inputPath})
            .pipe(plugins.newer(gulp.outputPath))
            .pipe(plugins.if(env !== 'local',  // don't minify during development
                plugins.imagemin()
            ))
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(browserSync.reload({stream: true}))
            .pipe(plugins.notify({message: 'Image minification complete', onLast: true}));
    });


    gulp.task(
        'watch:images',
        'watches the source images folders and recompresses them when changed',
        ['build:images'],
        function() {
            gulp.watch(CONFIG.paths, ['build:images']);
        }
    );
};
