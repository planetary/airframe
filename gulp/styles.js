var browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    var paths = {
        'lint': [
            // scss files to lint (ignore vendor)
            'assets/styles/**/*.scss',
            '!assets/styles/vendor/**/*'
        ],
        'watch': [
            // scss files to watch for changes when triggering rebuilds
            'assets/styles/**/*.scss'
        ],
        'build': [
            // scss files to build
            'assets/styles/main.scss'
        ]
    };


    gulp.task('build:styles', 'compiles all scss files into the build folder', function() {
        return gulp.src(paths.build, {'base': gulp.inputPath})
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            .on('error', plugins.notify.onError(function(err) {
                return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
            }))
            .pipe(plugins.autoprefixer())
            .pipe(plugins['if'](
                // don't minify during development
                ['development', '', undefined].indexOf(process.env.NODE_ENV) === -1,
                plugins.minifyCss()
            ))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'SCSS compilation complete', 'onLast': true}));
    });


    gulp.task('watch:styles', 'waits for scss files to change, then rebuilds ' +
                              'them', ['build:styles'], function() {
        return gulp.watch(paths.watch, ['build:styles']);
    });


    gulp.task('lint:styles', 'lints all non-vendor scss files against scss-lint.yml', function() {
        return gulp.src(paths.lint)
            .pipe(plugins.scssLint({'customReport': plugins.scssLintStylish}))
            .pipe(plugins.scssLint.failReporter());
    });
};
