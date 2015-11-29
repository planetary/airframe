var assert = require('assert');
var mock = require('mock-fs');
var proxyquire = require('proxyquire');

describe('gulp', function() {
    describe('loader', function() {
        it('should run without a NODE_ENV defined', function(done) {
            var fs = mock.fs({
                'package.json': '{}',
                'gulp': {
                    'index.es6': 'module.exports = {};'
                }
            });

            var index = proxyquire('../gulp/index', {'fs': fs}).index({NODE_ENV: null});
            assert(index.env, 'local');
            done();
            mock.restore();
        });

        it('should attempt to load all sibling and child gulp tasks in ./gulp dir',
            function(done) {
                var fs = mock.fs({
                    'package.json': '{}',
                    'gulp': {
                        'index.es6': 'module.exports = {};',
                        'subdir': {
                            'index.es6': 'gulp.task("test:subdir", function(){});'
                        }
                    }
                });

                try {
                    proxyquire('../gulp/index', {'fs': fs}).index(process.env);

                    // This should fail because the index file should attempt to `require()` subdir
                    // and consequently fail (because mock-fs doesn't overwrite require).
                    assert.fail();
                } catch(err) {
                    assert(err.message, "Cannot find module './subdir'");
                    done();
                } finally {
                    mock.restore();
                }
            }
        );
    });
});
