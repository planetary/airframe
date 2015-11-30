var chai = require('chai');
var proxyquire = require('proxyquire');

var tasks = require('../gulp');
var gulp = tasks.gulp;

chai.should();

describe('gulp default', function() {
    describe('default', function() {
        it('should attempt to serve and watch all requisite files', function(done) {
            proxyquire('../gulp/default', {'run-sequence': function() {
                arguments.length.should.equal(2);

                var args = Array.prototype.slice.apply(arguments);
                args.indexOf('serve').should.not.equal(-1);
                args.indexOf('watch').should.not.equal(-1);
                done();
            }})(gulp);

            gulp.start(['default']);
        });
    });
});
