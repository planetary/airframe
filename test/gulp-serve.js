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
                    opts.tunnel.should.be.true;
                    opts.open.should.be.false;
                    done();

                    return {
                        emitter: {
                            on() {}
                        }
                    };
                }
            }})(gulp);

            gulp.start(['serve:browsersync']);
        });


        it('should define a handler for an error emitted from BrowserSync\'s localtunnel instance',
            function(done) {
                proxyquire('../gulp/serve', {
                    'browser-sync': {
                        init() {
                            return {
                                emitter: {
                                    on(event, fn) {
                                        event.should.equal('service:running');
                                        fn.should.be.ok;
                                        fn();
                                    }
                                },

                                instance: {
                                    tunnel: {
                                        tunnel_cluster: { // eslint-disable-line
                                            on(event, fn) {
                                                event.should.equal('error');
                                                fn.should.be.ok;

                                                (() => fn('test')).should.throw('test');
                                                fn('check firewall');

                                                done();
                                            }
                                        }
                                    }
                                }
                            };
                        }
                    }
                })(gulp);

                gulp.start(['serve:browsersync']);
            }
        );
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
