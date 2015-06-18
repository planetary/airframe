var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    extend = require('util-extend'),
    watchify = require('watchify');


module.exports = function(gulp, plugins) {
    var paths = {
        'watch': [
            // js files to watch for changes
            'assets/scripts/**/*.js'
        ],
        'lint': [
            // js files to lint (ignore vendor)
            'gulp/*.js',
            'assets/scripts/**/*.js',
            '!assets/scripts/vendor/**/*'
        ],
        'build': [
            // js files to build
            './assets/scripts/index.js'
        ],
        // destination folder
        'output': 'build/js'
    };


    var bundler = browserify(paths.build, extend(watchify.args, {
        // browserify options
        'extensions': ['.jsx'],
        'debug': true,
        'fullPaths': true,
        'insertGlobals': true,
        'transform': ['brfs', 'bulkify']
    }));
    var bundle = function() {
        bundler.bundle()
            .on('error', plugins.notify.onError(function(err) {
                return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
            }))
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({'loadMaps': true}))
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'JS compilation complete', 'onLast': true}));
    };


    gulp.task('build:js', 'bundles all client-side javascript files into the build folder via ' +
                          'browserify', bundle);


    gulp.task('watch:js:browserify', 'waits for client-side javascript files to change, then ' +
                                     'rebuilds them', function() {
        watchify(bundler).on('update', bundle);

        return bundle();
    });


    // gulp.task('watch:js:serve', 'waits for server-side javascript files to change, then ' +
    //                              'restarts the development server', function() {
    // });


    gulp.task('watch:js', 'waits for both server-side and client-side javascript files to ' +
                          'change, then redeploys them', [
        // 'watch:js:serve',
        'watch:js:browserify'
    ]);


    gulp.task('lint:js', 'lints all non-vendor js files against .jshintrc and ' +
                          '.jscsrc', function() {
        return gulp
            .src(paths.lint)
            .pipe(plugins.jshint())
            .pipe(plugins.jscs())
            .on('error', function() {})
            .pipe(plugins.jscsStylish.combineWithHintResults())
            .pipe(plugins.jshint.reporter('jshint-stylish'))
            .pipe(plugins.jshint.reporter('fail'));
    });
};
