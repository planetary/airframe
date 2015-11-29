var assert = require('assert');
var gulp = require('gulp-help')(require('gulp'));
var proxyquire = require('proxyquire');

describe('gulp serve', function() {
    describe('serve:browsersync', function() {
        it('should start BrowserSync with the correct options', function(done) {
            proxyquire('../gulp/serve', {'browser-sync': {
                init: function(opts) {
                    assert(typeof opts.port !== 'undefined');
                    assert(opts.files === false);
                    assert(opts.proxy.match('http://localhost:'));
                    assert(opts.tunnel === true);
                    assert(opts.open === false);
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
                        assert(arguments[0].name === 'middleware');
                        done();

                        return {
                            listen: function() {}
                        };
                    }
                }
            })(gulp);

            assert(gulp.tasks.serve.dep.length, 1);
            assert(gulp.tasks.serve.dep[0], 'serve:browsersync');

            gulp.start(['serve']);
        });
    });
});
