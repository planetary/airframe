const mockGulpDest = require('mock-gulp-dest');
const rewire = require('rewire');
const through = require('through2');

const {gulp, plugins, env} = require('../gulp');
const {copyAllProperties} = require('./helpers');


describe('gulp scripts', function() {
    this.timeout(10000);


    describe('build:scripts', function() {
        let mock;


        beforeEach(function() {
            mock = mockGulpDest(gulp);
        });


        afterEach(function() {
            mock.restore();
        });


        it('should attempt to build all scripts and notify on success', function(done) {
            require('../gulp/scripts')(gulp, plugins, 'local');

            gulp.task('test:build:scripts', ['build:scripts'], function() {
                done();
            });

            gulp.start(['test:build:scripts']);
        });


        it('should be able to run for multiple output files', function(done) {
            const scripts = rewire('../gulp/scripts');
            let bundleCount = 0;

            scripts.__set__({
                browserify() {
                    // the below will cause browserify to error (intentionally)
                    const args = [null].concat(Array.prototype.slice.apply(arguments, [1]));
                    const browserify = require('browserify').apply(this, args);
                    const bundle = browserify.bundle;
                    browserify.bundle = function() {
                        bundleCount++;
                        return bundle.apply(browserify, arguments);
                    };
                    return browserify;
                },
                browserSync: {
                    reload() {
                        return through.obj(function(file, enc, cb) {
                            return cb();
                        });
                    }
                },
                CONFIG: {
                    build: {
                        'scripts/bundle.js': ['assets/scripts/index.js'],
                        'scripts/test.js': ['assets/scripts.index.js']
                    }
                }
            });
            scripts(gulp, plugins, 'local');

            gulp.task('test:build:scripts', ['build:scripts'], function() {
                bundleCount.should.equal(2);
                done();
            });

            gulp.start(['test:build:scripts']);
        });


        it('should fail gracefully when the browserify build throws an error', function(done) {
            const notify = function() {
                return through.obj(function(file, enc, cb) {
                    return cb();
                });
            };
            notify.onError = function(func) {
                const result = func({
                    message: 'test'
                });

                result.match('test').should.be.ok;
                done();

                return function() {};
            };

            const plugs = copyAllProperties(plugins, {});
            plugs.notify = notify;

            const scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify() {
                    // the below will cause browserify to error (intentionally)
                    const args = [null].concat(Array.prototype.slice.apply(arguments, [1]));
                    return require('browserify').apply(this, args);
                }
            });
            scripts(gulp, plugs, 'local');

            gulp.start(['build:scripts']);
        });
    });


    describe('watch:scripts', function() {
        it('should fail gracefully without a bundler#rebuild error callback', function(done) {
            let gotError = false;
            const notify = function() {
                return through.obj(function(file, enc, cb) {
                    return cb();
                });
            };
            notify.onError = function(func) {
                gotError = true;
                func({
                    message: 'test'
                });

                return function() {};
            };

            const plugs = copyAllProperties(plugins, {});
            plugs.notify = notify;

            const scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify() {
                    // the below will cause browserify to error (intentionally)
                    const args = [].concat(Array.prototype.slice.apply(arguments, [1]));
                    return require('browserify').apply(this, args);
                },

                watchify() {
                    return {
                        on() {}
                    };
                }
            });
            scripts(gulp, plugs, 'local');

            gulp.task('test:watch:scripts', ['watch:scripts'], function() {
                gotError.should.be.true;
                done();
            });

            gulp.start(['test:watch:scripts']);
        });


        it('should attempt to watch all scripts with watchify', function(done) {
            let outputs = [];
            let watchOutputs = [];

            const scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify() {
                    const args = Array.prototype.slice.apply(arguments);
                    outputs = outputs.concat(args[0]);

                    return require('browserify').apply(this, arguments);
                },

                watchify(output) {
                    watchOutputs = watchOutputs.concat(output._options.entries);

                    return {
                        on() {}
                    };
                }
            });
            scripts(gulp, plugins, 'local');

            gulp.task('test:watch:scripts', ['watch:scripts'], function() {
                outputs.length.should.be.greaterThan(0);
                outputs.length.should.equal(watchOutputs.length);
                done();
            });

            gulp.start(['test:watch:scripts']);
        });
    });


    describe('lint:scripts', function() {
        it('should lint the scripts', function(done) {
            let called = false;
            const plugs = copyAllProperties(plugins, {});
            plugs.eslint = function() {
                called = true;

                return through.obj(function(file, enc, cb) {
                    cb();
                });
            };
            plugs.eslint.format = function() {
                return through.obj(function(file, enc, cb) {
                    cb();
                });
            };
            plugs.eslint.failAfterError = function() {
                called.should.be.true;
                done();

                return through.obj(function(file, enc, cb) {
                    cb();
                });
            };

            require('../gulp/scripts')(gulp, plugs, env);

            gulp.start(['lint:scripts']);
        });
    });
});
