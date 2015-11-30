var chai = require('chai');
var gulp = require('gulp-help')(require('gulp'));
var proxyquire = require('proxyquire');

chai.should();

describe('gulp serve', function() {
    describe('serve:browsersync', function() {
        it('should start BrowserSync with the correct options', function(done) {
            proxyquire('../gulp/serve', {'browser-sync': {
                init: function(opts) {
                    (typeof opts.port).should.not.equal('undefined');
                    opts.files.should.be.false;
                    opts.proxy.match('http://localhost:').should.be.ok;
                    opts.tunnel.should.be.true;
                    opts.open.should.be.false;
                    done();
                }
            }})(gulp);

            gulp.start(['serve:browsersync']);
        });
    });

    describe('serve', function() {
        it('should start BrowserSync and then create an ecstatic server', function(done) {
            proxyquire('../gulp/serve', {
                'browser-sync': {
                    init: function(opts, next) {
                        next();
                    }
                },
                'http': {
                    createServer: function() {
                        arguments[0].name.should.equal('middleware');
                        done();

                        return {
                            listen: function() {}
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
