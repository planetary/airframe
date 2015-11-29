var assert = require('assert');
var mock = require('mock-fs');
var proxyquire = require('proxyquire');

describe('gulp', function() {
    describe('loader', function() {
        var fs;

        before(function() {
            fs = mock.fs({
                'package.json': '{}',
                'gulp': {
                    'index.es6': 'module.exports = {};',
                    'subdir': {
                        'index.es6': 'gulp.task("test:subdir", function(){});'
                    }
                }
            });
        });

        after(function() {
            mock.restore();
        });

        it('should attempt to load all sibling and child gulp tasks in ./gulp dir',
            function(done) {
                try {
                    proxyquire('../gulp/index', {'fs': fs});

                    // This should fail because the index file should attempt to `require()` subdir
                    // and consequently fail (because mock-fs doesn't overwrite require).
                    assert.fail();
                } catch(err) {
                    assert(err.message === "Cannot find module './subdir'");
                    done();
                }
            }
        );
    });
});
