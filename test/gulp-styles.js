var assert = require('assert');
var mockGulpDest = require('mock-gulp-dest');
var through = require('through2');

var copyAllProperties = require('./helpers').copyAllProperties;
var tasks = require('../gulp');
var gulp = tasks.gulp;
var plugins = tasks.plugins;
var env = tasks.env;

describe('gulp styles', function() {
    describe('build:styles', function() {
        var mock;

        beforeEach(function() {
            mock = mockGulpDest(gulp);
        });

        afterEach(function() {
            mock.restore();
        });

        it('should attempt to build all scss files and notify on success', function(done) {
            require('../gulp/styles')(gulp, plugins, env);

            gulp.task('test:build:styles', ['build:styles'], function() {
                done();
            });

            gulp.start(['test:build:styles']);
        });

        it('should fail gracefully when gulp-scss throws an error', function(done) {
            var notify = function() {
                return through.obj(function(file, enc, cb) {
                    return cb(
                        new plugins.util.PluginError('test', 'Task should not have completed.')
                    );
                });
            };
            notify.onError = function(func) {
                var result = func({
                    message: 'test',
                    fileName: 'file.es6',
                    lineNumber: 0
                });

                assert.ok(result.match('test'));
                assert.ok(result.match('file.es6'));
                assert.ok(result.match('0'));

                return function() {
                    done();
                };
            };

            var plugs = copyAllProperties(plugins, {});
            plugs.sass = function() {
                return through.obj(function(file, enc, cb) {
                    return cb(new plugins.util.PluginError('test', 'test'));
                });
            };
            plugs.notify = notify;

            require('../gulp/styles')(gulp, plugs, env);

            gulp.start(['build:styles']);
        });
    });

    describe('watch:styles', function() {
        it('should attempt to watch and build all scss files', function(done) {
            require('../gulp/styles')(gulp, plugins, env);

            var watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                assert(paths.length === 1);
                assert.notEqual(paths.indexOf('assets/styles/**/*.scss'), -1);
                assert.notEqual(tasklist.indexOf('build:styles'), -1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:styles']);
        });
    });

    describe('lint:styles', function() {
        it('should lint the scss files', function(done) {
            var called = false;
            var failReporter = false;
            var plugs = copyAllProperties(plugins, {});
            plugs.scssLint = function() {
                called = true;

                return through.obj(function(file, enc, cb) {
                    cb();
                });
            };
            plugs.scssLint.failReporter = function() {
                failReporter = true;

                return through.obj(function(file, enc, cb) {
                    cb();
                });
            };

            require('../gulp/styles')(gulp, plugs, env);

            gulp.task('test:lint:styles', ['lint:styles'], function() {
                assert.ok(called);
                assert.ok(failReporter);
                done();
            });

            gulp.start(['test:lint:styles']);
        });
    });
});
