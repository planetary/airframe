var assert = require('assert');
var proxyquire = require('proxyquire');

var tasks = require('../gulp');
var gulp = tasks.gulp;

describe('gulp default', function() {
    describe('default', function() {
        it('should attempt to serve and watch all requisite files', function(done) {
            proxyquire('../gulp/default', {'run-sequence': function() {
                assert(arguments.length === 2);

                var args = Array.prototype.slice.apply(arguments);
                assert.notEqual(args.indexOf('serve'), -1);
                assert.notEqual(args.indexOf('watch'), -1);
                done();
            }})(gulp);

            gulp.start(['default']);
        });
    });
});
