const proxyquire = require('proxyquire');

const {gulp} = require('../gulp');


describe('gulp clean', function() {
    this.timeout(10000);


    describe('clean', function() {
        it('should attempt to delete all files in the build folder', function(done) {
            proxyquire('../gulp/clean', {del(path) {
                path.length.should.equal(1);
                path[0].should.equal(path.join(gulp.outputPath, '**', '*'));
                done();
            }})(gulp);

            gulp.start(['clean']);
        });
    });
});
