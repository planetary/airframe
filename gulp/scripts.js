var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    extend = require('util-extend'),
    watchify = require('watchify');


module.exports = function(gulp, plugins) {
    var paths = {
        'lint': [
            // js files to lint (ignore vendor)
            'gulp/*.js',
            'assets/scripts/**/*.js',
            'assets/scripts/**/*.jsx',
            '!assets/scripts/vendor/**/*'
        ],
        'build': {
            // maps output filenames to entry points
            'scripts/bundle.js': ['assets/scripts/index.js']
        }
    };


    var outputs = [];

    Object.keys(paths.build).forEach(function(output) {
        var inputs = paths.build[output];
        var bundler = browserify(inputs, extend(watchify.args, {
            // browserify options
            'extensions': ['.jsx'],
            'debug': true,
            'fullPaths': true,
            'insertGlobals': true,
            'transform': ['reactify', 'brfs', 'bulkify']
        }));

        bundler.rebuild = function(errCb) {
            return bundler.bundle()
                .on('error', plugins.notify.onError(function(err) {
                    if(errCb)
                        errCb();

                    return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
                }))
                .pipe(source(output))
                .pipe(buffer())
                .pipe(plugins.sourcemaps.init({'loadMaps': true}))
                .pipe(plugins['if'](
                    // don't minify during development
                    ['development', '', undefined].indexOf(process.env.NODE_ENV) === -1,
                    plugins.uglify()
                ))
                .pipe(plugins.rev())
                .pipe(plugins.sourcemaps.write('.'))
                .pipe(gulp.dest(gulp.outputPath))
                .pipe(plugins.rev.manifest({'base': gulp.outputPath, 'merge': true}))
                .pipe(gulp.dest(gulp.outputPath))
                .pipe(browserSync.reload({'stream': true}))
                .pipe(plugins.notify({'message': output + ' complete', 'onLast': true}));
        };

        outputs.push(bundler);
    });

    gulp.task('build:scripts', 'bundles all client-side javascript files into the build folder ' +
                               'via browserify', function(next) {
        var count = outputs.length,
            failed = 0;

        outputs.forEach(function(output) {
            output.rebuild(function() {
                failed++;
            }).on('finish', function() {
                if(--count === 0)
                    next(failed > 0? new Error(failed + ' bundle(s) have failed'): null);
            });
        });
    });


    gulp.task('watch:scripts', 'waits for client-side javascript files to change, then rebuilds ' +
                               'them', function() {
        outputs.forEach(function(output) {
            watchify(output).on('update', output.rebuild);
            output.rebuild();
        });
    });


    gulp.task('lint:scripts', 'lints all non-vendor js(x) files against .jshintrc and ' +
                              '.jscsrc', function() {
        return gulp
            .src(paths.lint)
            .pipe(plugins.react())
            .pipe(plugins.jshint())
            .pipe(plugins.jscs())
            .on('error', function() {})
            .pipe(plugins.jscsStylish.combineWithHintResults())
            .pipe(plugins.jshint.reporter('jshint-stylish'))
            .pipe(plugins.jshint.reporter('fail'));
    });
};
