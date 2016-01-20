const proxyquire = require('proxyquire');

const {gulp} = require('../gulp');


describe('gulp default', function() {
    this.timeout(10000);


    describe('default', function() {
        it('should attempt to serve and watch all requisite files', function(done) {
            proxyquire('../gulp/default', {'run-sequence'(...args) {
                args.length.should.equal(2);
                args.indexOf('serve').should.not.equal(-1);
                args.indexOf('watch').should.not.equal(-1);
                done();
            }})(gulp);

            gulp.start(['default']);
        });
    });
});
