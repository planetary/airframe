var assert = require('assert');
var mockGulpDest = require('mock-gulp-dest');
var through = require('through2');
var rewire = require('rewire');

var copyAllProperties = require('./helpers').copyAllProperties;
var tasks = require('../gulp');
var gulp = tasks.gulp;
var plugins = tasks.plugins;
var env = tasks.env;

describe('gulp scripts', function() {
    describe('build:scripts', function() {
        var mock;

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
            var scripts = rewire('../gulp/scripts');
            var bundleCount = 0;

            scripts.__set__({
                browserify: function() {
                    // the below will cause browserify to error (intentionally)
                    var args = [null].concat(Array.prototype.slice.apply(arguments, [1]));
                    var browserify = require('browserify').apply(this, args);
                    var bundle = browserify.bundle;
                    browserify.bundle = function() {
                        bundleCount++;
                        return bundle.apply(browserify, arguments);
                    };
                    return browserify;
                },
                browserSync: {
                    reload: function() {
                        return through.obj(function(file, enc, cb) {
                            return cb();
                        });
                    }
                },
                paths: {
                    build: {
                        'scripts/bundle.js': ['assets/scripts/index.js'],
                        'scripts/test.js': ['assets/scripts.index.js']
                    }
                }
            });
            scripts(gulp, plugins, 'local');

            gulp.task('test:build:scripts', ['build:scripts'], function() {
                assert(bundleCount === 2);
                done();
            });

            gulp.start(['test:build:scripts']);
        });

        it('should fail gracefully when the browserify build throws an error', function(done) {
            var notify = function() {
                return through.obj(function(file, enc, cb) {
                    return cb();
                });
            };
            notify.onError = function(func) {
                var result = func({
                    message: 'test'
                });

                assert.ok(result.match('test'));
                done();

                return function() {};
            };

            var plugs = copyAllProperties(plugins, {});
            plugs.notify = notify;

            var scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify: function() {
                    // the below will cause browserify to error (intentionally)
                    var args = [null].concat(Array.prototype.slice.apply(arguments, [1]));
                    return require('browserify').apply(this, args);
                }
            });
            scripts(gulp, plugs, 'local');

            gulp.start(['build:scripts']);
        });
    });

    describe('watch:scripts', function() {
        it('should fail gracefully without a bundler#rebuild error callback', function(done) {
            var gotError = false;
            var notify = function() {
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

            var plugs = copyAllProperties(plugins, {});
            plugs.notify = notify;

            var scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify: function() {
                    // the below will cause browserify to error (intentionally)
                    var args = [].concat(Array.prototype.slice.apply(arguments, [1]));
                    return require('browserify').apply(this, args);
                },

                watchify: function() {
                    return {
                        on: function() {}
                    };
                }
            });
            scripts(gulp, plugs, 'local');

            gulp.task('test:watch:scripts', ['watch:scripts'], function() {
                assert.ok(gotError);
                done();
            });

            gulp.start(['test:watch:scripts']);
        });

        it('should attempt to watch all scripts with watchify', function(done) {
            var outputs = [];
            var watchOutputs = [];

            var scripts = rewire('../gulp/scripts');
            scripts.__set__({
                browserify: function() {
                    var args = Array.prototype.slice.apply(arguments);
                    outputs = outputs.concat(args[0]);

                    return require('browserify').apply(this, arguments);
                },

                watchify: function(output) {
                    watchOutputs = watchOutputs.concat(output._options.entries);

                    return {
                        on: function() {}
                    };
                }
            });
            scripts(gulp, plugins, 'local');

            gulp.task('test:watch:scripts', ['watch:scripts'], function() {
                assert(outputs.length > 0);
                assert(outputs.length === watchOutputs.length);
                done();
            });

            gulp.start(['test:watch:scripts']);
        });
    });

    describe('lint:scripts', function() {
        it('should lint the scripts', function(done) {
            var called = false;
            var plugs = copyAllProperties(plugins, {});
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
                assert.ok(called);
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
