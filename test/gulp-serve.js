const gulp = require('gulp-help')(require('gulp'));
const proxyquire = require('proxyquire');


describe('gulp serve', function() {
    this.timeout(10000);


    describe('serve:browsersync', function() {
        it('should start BrowserSync with the correct options', function(done) {
            proxyquire('../gulp/serve', {'browser-sync': {
                init(opts) {
                    (typeof opts.port).should.not.equal('undefined');
                    opts.files.should.be.false;
                    opts.proxy.match('http://localhost:').should.be.ok;
                    opts.open.should.be.false;
                    done();

                    return {};
                }
            }})(gulp);

            gulp.start(['serve:browsersync']);
        });
    });


    describe('serve', function() {
        it('should start BrowserSync and then create an ecstatic server', function(done) {
            proxyquire('../gulp/serve', {
                'browser-sync': {
                    init(opts, next) {
                        next();

                        return {
                            emitter: {
                                on() {}
                            }
                        };
                    }
                },
                http: {
                    createServer() {
                        arguments[0].name.should.equal('middleware');
                        done();

                        return {
                            listen() {}
                        };
                    }
                }
            })(gulp);

            gulp.tasks.serve.dep.length.should.equal(1);
            gulp.tasks.serve.dep[0].should.equal('serve:browsersync');

            gulp.start(['serve']);
        });
    });
});
