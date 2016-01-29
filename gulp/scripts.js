const CONFIG = {
    lint: [
        // js files to lint (ignore vendor, dependencies and outputs)
        '**/*.js',
        '**/*.jsx',
        '!assets/scripts/vendor/**/*',
        '!build/**/*',
        '!node_modules/**/*'
    ],
    build: {
        // maps output filenames to entry points
        'scripts/bundle.js': ['assets/scripts/index.js']
    }
};


const browserify = require('browserify');
const browserSync = require('browser-sync');
const extend = require('deep-extend');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const watchify = require('watchify');


module.exports = function(gulp, plugins, env) {
    const outputs = [];

    Object.keys(CONFIG.build).forEach(function(output) {
        const inputs = CONFIG.build[output];
        const bundler = browserify(inputs, extend(watchify.args, {
            // browserify options
            extensions: ['.js', '.jsx'],

            debug: env === 'local',
            fullPaths: env === 'local',
            insertGlobals: false,
            transform: ['babelify', 'brfs', 'bulkify', 'envify']
        }));

        bundler.rebuild = function(errCb) {
            return bundler.bundle()
                .on('error', plugins.notify.onError(function(err) {
                    if(errCb && typeof errCb === 'function')
                        errCb(err.stack);

                    return err.message;
                }))
                .pipe(source(output))
                .pipe(buffer())
                .pipe(plugins.sourcemaps.init({loadMaps: true}))
                .pipe(plugins.if(env !== 'local',  // don't minify during development
                    plugins.uglify({compress: true})
                ))
                .pipe(plugins.sourcemaps.write('.'))
                .pipe(gulp.dest(gulp.outputPath))
                .pipe(browserSync.reload({stream: true}))
                .pipe(plugins.notify({message: `${output} complete`, onLast: true}));
        };

        outputs.push(bundler);
    });


    gulp.task(
        'build:scripts',
        'bundles all client-side javascript files into the build folder via browserify',
        function(next) {
            let count = outputs.length;
            let failed = 0;

            outputs.forEach(function(output) {
                output.rebuild(function() {
                    failed++;
                }).on('finish', function() {
                    if(--count === 0) {
                        return next(failed > 0
                            ? new Error(`${failed} bundle(s) have failed`)
                            : null
                        );
                    }
                });
            });
        }
    );


    gulp.task(
        'watch:scripts',
        'waits for client-side javascript files to change, then rebuilds them',
        function() {
            outputs.forEach(function(output) {
                watchify(output).on('update', output.rebuild);
                output.rebuild();
            });
        }
    );


    gulp.task('lint:scripts', 'lints all non-vendor js(x) files against .eslintrc', function() {
        return gulp
            .src(CONFIG.lint)
            .pipe(plugins.eslint())
            .pipe(plugins.eslint.format('stylish'))
            .pipe(plugins.eslint.failAfterError());
    });
};
