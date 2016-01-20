const browserSync = require('browser-sync');
const ecstatic = require('ecstatic');
const http = require('http');


const ports = {
    frontend: 8080,
    backend: 4900
};


module.exports = function(gulp) {
    gulp.task(
        'serve:browsersync',
        'proxies the localhost server via BrowserSync to dynamically update assets',
        function(next) {
            const bs = browserSync.init({
                port: ports.frontend,
                files: false,
                proxy: `http://localhost:${ports.backend}`,
                tunnel: true,

                // Stop the browser from automatically opening
                open: false
            }, next);

            // From https://github.com/BrowserSync/browser-sync/issues/823
            // due to https://github.com/localtunnel/localtunnel/issues/81
            bs.emitter.on('service:running', function() {
                bs.instance.tunnel.tunnel_cluster.on('error', function(err) {
                    if(err.toString().indexOf('firewall') === -1)
                        throw err;
                    console.log('localtunnel connection lost; reconnecting...');
                });
            });
        }
    );


    gulp.task('serve', 'serves static templates locally', ['serve:browsersync'], function() {
        // quick hack; should be replaced with nodemon or something similar as soon as a backend is
        // decided upon
        http.createServer(ecstatic({
            root: './build',
            cache: 0
        })).listen(ports.backend);
    });
};
