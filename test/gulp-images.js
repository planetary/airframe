var assert = require('assert');

var tasks = require('../gulp');
var gulp = tasks.gulp;

describe('gulp images', function() {
    describe('watch:images', function() {
        it('should attempt to watch and build all image files', function(done) {
            var watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                assert(paths.length === 1);
                assert.notEqual(paths.indexOf('assets/images/**/*'), -1);
                assert.notEqual(tasklist.indexOf('build:images'), -1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:images']);
        });
    });
});
