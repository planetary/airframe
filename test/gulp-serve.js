var assert = require('assert');
var gulp = require('gulp-help')(require('gulp'));
var proxyquire = require('proxyquire');

describe('gulp serve', function() {
    describe('serve:browsersync', function() {
        it('should start BrowserSync with the correct options', function(done) {
            proxyquire('../gulp/serve', {'browser-sync': {
                init: function(opts) {
                    assert.notEqual(typeof opts.port, 'undefined');
                    assert.equal(opts.files, false);
                    assert.ok(opts.proxy.match('http://localhost:'));
                    assert.equal(opts.tunnel, true);
                    assert.equal(opts.open, false);
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
                        assert.equal(arguments[0].name, 'middleware');
                        done();

                        return {
                            listen: function() {}
                        };
                    }
                }
            })(gulp);

            assert.equal(gulp.tasks.serve.dep.length, 1);
            assert.equal(gulp.tasks.serve.dep[0], 'serve:browsersync');

            gulp.start(['serve']);
        });
    });
});
