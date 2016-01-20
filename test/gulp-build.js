const mockGulpDest = require('mock-gulp-dest');
const through = require('through2');

const {gulp, plugins} = require('../gulp');
const build = require('../gulp/build');
const {copyAllProperties} = require('./helpers');


describe('gulp build', function() {
    this.timeout(10000);


    let mock;
    beforeEach(function() {
        mock = mockGulpDest(gulp);
    });


    afterEach(function() {
        mock.restore();
    });


    describe('build', function() {
        it('should not generate rev-manifest.json in a local environment', function(done) {
            build(gulp, plugins, 'local');

            gulp.task('test:build:no-rev-manifest', false, ['build'], function() {
                mock.assertDestNotContains('rev-manifest.json');
                done();
            });
            gulp.start(['test:build:no-rev-manifest']);
        });


        it('should generate rev-manifest.json in a production environment', function(done) {
            let requestedManifest = false;

            const plugs = copyAllProperties(plugins, {});
            plugs.revAll = function() {
                const ra = new plugins.revAll(arguments[0]);
                ra.manifestFile = function() {
                    requestedManifest = true;
                    return through.obj(function(file, enc, cb) {
                        return cb();
                    });
                };

                return ra;
            };

            build(gulp, plugs, 'production');

            gulp.task('test:build:has-rev-manifest', false, ['build'], function() {
                requestedManifest.should.be.true;
                done();
            });
            gulp.start(['test:build:has-rev-manifest']);
        });


        it('should filter out non-revvable files when running revAll', function(done) {
            const plugs = copyAllProperties(plugins, {});
            plugs.revAll = function() {
                const ra = new plugins.revAll(arguments[0]);
                ra.manifestFile = function() {
                    return through.obj(function(file, enc, cb) {
                        return cb();
                    });
                };

                return ra;
            };
            plugs.filter = function(func) {
                func({path: 'rev-manifest.json'}).should.be.false;
                func({path: 'file.js.map'}).should.be.false;
                func({path: 'file.abcdef01.js'}).should.be.false;
                func({path: 'file.js'}).should.be.true;
                done();
            };

            build(gulp, plugs, 'production');

            gulp.start(['build']);
        });
    });
});
