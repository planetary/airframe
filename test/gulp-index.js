const mock = require('mock-fs');
const proxyquire = require('proxyquire');


describe('gulp', function() {
    this.timeout(10000);


    describe('loader', function() {
        it('should run without a NODE_ENV defined', function(done) {
            const fs = mock.fs({
                'package.json': '{}',
                gulp: {
                    'index.js': 'module.exports = {};'
                }
            });

            const index = proxyquire('../gulp/index', {fs}).index({NODE_ENV: null});
            index.env.should.equal('local');
            done();
            mock.restore();
        });


        it('should attempt to load all sibling and child gulp tasks in ./gulp dir',
            function(done) {
                const fs = mock.fs({
                    'package.json': '{}',
                    gulp: {
                        'index.js': 'module.exports = {};',
                        subdir: {
                            'index.js': 'gulp.task("test:subdir", function(){});'
                        }
                    }
                });

                try {
                    proxyquire('../gulp/index', {fs}).index(process.env);

                    // This should fail because the index file should attempt to `require()` subdir
                    // and consequently fail (because mock-fs doesn't overwrite require).
                    done(new Error('Didn\'t require subdir.'));
                } catch(err) {
                    err.message.should.equal('Cannot find module \'./subdir\'');
                    done();
                } finally {
                    mock.restore();
                }
            }
        );
    });
});
