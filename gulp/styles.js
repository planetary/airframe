const CONFIG = {
    lint: [
        // scss files to lint (ignore vendor)
        'assets/styles/**/*.scss',
        '!assets/styles/vendor/**/*'
    ],
    watch: [
        // scss files to watch for changes when triggering rebuilds
        'assets/styles/**/*.scss'
    ],
    build: [
        // scss files to build
        'assets/styles/main.scss'
    ]
};


const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssnano = require('cssnano');


module.exports = function(gulp, plugins, env) {
    gulp.task('build:styles', 'compiles all scss files into the build folder', function() {
        return gulp.src(CONFIG.build, {base: gulp.inputPath})
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            .on('error', plugins.notify.onError(function(err) {
                return `${err.message} in ${err.fileName} at line ${err.lineNumber}`;
            }))
            .pipe(plugins.postcss(
                env === 'local'
                    ? [autoprefixer]  // don't minify during development
                    : [cssnano]       // cssnano automatically runs autoprefixer
             ))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(plugins.filter('**/*.css'))
            .pipe(browserSync.reload({stream: true}))
            .pipe(plugins.notify({message: 'SCSS compilation complete', onLast: true}));
    });


    gulp.task(
        'watch:styles',
        'waits for scss files to change, then rebuilds them',
        ['build:styles'],
        function() {
            gulp.watch(CONFIG.watch, ['build:styles']);
        }
    );


    gulp.task('lint:styles', 'lints all non-vendor scss files against scss-lint.yml', function() {
        return gulp.src(CONFIG.lint)
            .pipe(plugins.scssLint({customReport: plugins.scssLintStylish}))
            .pipe(plugins.scssLint.failReporter());
    });
};
