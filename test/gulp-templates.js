const mockGulpDest = require('mock-gulp-dest');
const through = require('through2');

const {gulp, plugins, env} = require('../gulp');
const {copyAllProperties} = require('./helpers');


describe('gulp templates', function() {
    this.timeout(10000);
    let mock;


    beforeEach(function() {
        mock = mockGulpDest(gulp);
    });


    afterEach(function() {
        mock.restore();
    });


    describe('build:templates', function() {
        it('should fail gracefully when gulp-jade throws an error', function(done) {
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
                    fileName: 'file.jade',
                    lineNumber: 0
                });

                result.match('test').should.be.ok;
                result.match('file.jade').should.be.ok;
                result.match('0').should.be.ok;

                return function() {
                    done();
                };
            };

            const plugs = copyAllProperties(plugins, {});
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

            const watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                paths.length.should.equal(1);
                paths.indexOf('assets/templates/**/*.jade').should.not.equal(-1);
                tasklist.indexOf('build:templates').should.not.equal(-1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:templates']);
        });
    });
});
