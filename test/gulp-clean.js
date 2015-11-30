var assert = require('assert');
var proxyquire = require('proxyquire');

var tasks = require('../gulp');
var gulp = tasks.gulp;

describe('gulp clean', function() {
    describe('clean', function() {
        it('should attempt to delete all files in the build folder', function(done) {
            proxyquire('../gulp/clean', {'del': function(path) {
                assert(path.length, 1);
                assert(path[0], path.join(gulp.outputPath, '**', '*'));
                done();
            }})(gulp);

            gulp.start(['clean']);
        });
    });
});
