const mockGulpDest = require('mock-gulp-dest');
const through = require('through2');

const {copyAllProperties} = require('./helpers');
const {gulp, plugins, env} = require('../gulp');


describe('gulp styles', function() {
    describe('build:styles', function() {
        let mock;


        beforeEach(function() {
            mock = mockGulpDest(gulp);
        });


        afterEach(function() {
            mock.restore();
        });


        it('should attempt to build all scss files and notify on success', function(done) {
            this.timeout(3000);

            require('../gulp/styles')(gulp, plugins, env);

            gulp.task('test:build:styles', ['build:styles'], function() {
                done();
            });

            gulp.start(['test:build:styles']);
        });


        it('should fail gracefully when gulp-scss throws an error', function(done) {
            this.timeout(3000);

            const notify = function() {
                return through.obj(function(file, enc, cb) {
                    return cb(
                        new plugins.util.PluginError('test', 'Task should not have completed.')
                    );
                });
            };
            notify.onError = function(func) {
                const result = func({
                    message: 'test',
                    fileName: 'file.js',
                    lineNumber: 0
                });

                result.match('test').should.be.ok;
                result.match('file.js').should.be.ok;
                result.match('0').should.be.ok;

                return function() {
                    done();
                };
            };

            const plugs = copyAllProperties(plugins, {});
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

            const watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                paths.length.should.equal(1);
                paths.indexOf('assets/styles/**/*.scss').should.not.equal(-1);
                tasklist.indexOf('build:styles').should.not.equal(-1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:styles']);
        });
    });


    describe('lint:styles', function() {
        it('should lint the scss files', function(done) {
            let called = false;
            let failReporter = false;
            const plugs = copyAllProperties(plugins, {});
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
                called.should.be.true;
                failReporter.should.be.true;
                done();
            });

            gulp.start(['test:lint:styles']);
        });
    });
});
