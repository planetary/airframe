const {gulp} = require('../gulp');


describe('gulp fonts', function() {
    this.timeout(10000);


    describe('watch:fonts', function() {
        it('should attempt to watch and build all font files', function(done) {
            const watch = gulp.watch; // store gulp's watch method

            gulp.watch = function(paths, tasklist) {
                paths.length.should.equal(1);
                paths.indexOf('assets/fonts/**/*').should.not.equal(-1);
                tasklist.indexOf('build:fonts').should.not.equal(-1);

                gulp.watch = watch; // restore watch
                done();
            };

            gulp.start(['watch:fonts']);
        });
    });
});
