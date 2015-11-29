var mockGulpDest = require('mock-gulp-dest');
var build = require('../gulp/build');

var tasks = require('../gulp');
var gulp = tasks.gulp;
var plugins = tasks.plugins;

process.env.DISABLE_NOTIFIER = true;

describe('gulp build', function() {
    var mock;

    beforeEach(function() {
        mock = mockGulpDest(gulp);
    });

    afterEach(function() {
        mock.restore();
    });

    describe('build', function() {
        it('should not generate rev-manifest.json in a local environment', function(done) {
            this.timeout(10000);

            build(gulp, plugins, 'local');

            gulp.task('test:build:no-rev-manifest', false, ['build'], function() {
                mock.assertDestNotContains('rev-manifest.json');
                done();
            });
            gulp.start(['test:build:no-rev-manifest']);
        });

        it('should generate rev-manifest.json in a production environment', function(done) {
            this.timeout(10000);

            build(gulp, plugins, 'production');

            gulp.task('test:build:has-rev-manifest', false, ['build'], function() {
                mock.assertDestContains('rev-manifest.json');
                done();
            });
            gulp.start(['test:build:has-rev-manifest']);
        });
    });
});
