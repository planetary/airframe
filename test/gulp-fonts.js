var assert = require('assert');

var tasks = require('../gulp');
var gulp = tasks.gulp;

describe('gulp fonts', function() {
    describe('watch:fonts', function() {
        it('should attempt to watch and build all font files', function(done) {
            var watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                assert.equal(paths.length, 1);
                assert.notEqual(paths.indexOf('assets/fonts/**/*'), -1);
                assert.notEqual(tasklist.indexOf('build:fonts'), -1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:fonts']);
        });
    });
});
