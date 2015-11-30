var assert = require('assert');
var mockGulpDest = require('mock-gulp-dest');
var through = require('through2');

var copyAllProperties = require('./helpers').copyAllProperties;
var tasks = require('../gulp');
var gulp = tasks.gulp;
var plugins = tasks.plugins;
var env = tasks.env;

describe('gulp templates', function() {
    var mock;

    beforeEach(function() {
        mock = mockGulpDest(gulp);
    });

    afterEach(function() {
        mock.restore();
    });

    describe('build:templates', function() {
        it('should fail gracefully when gulp-jade throws an error', function(done) {
            this.timeout(5000);

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
                    fileName: 'file.jade',
                    lineNumber: 0
                });

                assert.ok(result.match('test'));
                assert.ok(result.match('file.jade'));
                assert.ok(result.match('0'));

                return function() {
                    done();
                };
            };

            var plugs = copyAllProperties(plugins, {});
            plugs.jade = function() {
                return through.obj(function(file, enc, cb) {
                    return cb(new plugins.util.PluginError('test', 'test'));
                });
            };
            plugs.notify = notify;

            require('../gulp/templates')(gulp, plugs, env);

            gulp.start(['build:templates']);
        });
    });

    describe('watch:templates', function() {
        it('should attempt to watch and build all template files', function(done) {
            require('../gulp/templates')(gulp, plugins, env);

            var watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                assert.equal(paths.length, 1);
                assert.notEqual(paths.indexOf('assets/templates/**/*.jade'), -1);
                assert.notEqual(tasklist.indexOf('build:templates'), -1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:templates']);
        });
    });
});
