const {gulp} = require('../gulp');


describe('gulp images', function() {
    this.timeout(10000);


    describe('watch:images', function() {
        it('should attempt to watch and build all image files', function(done) {
            const watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                paths.length.should.equal(1);
                paths.indexOf('assets/images/**/*').should.not.equal(-1);
                tasklist.indexOf('build:images').should.not.equal(-1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:images']);
        });
    });
});
