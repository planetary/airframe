const browserSync = require('browser-sync');
const ecstatic = require('ecstatic');
const http = require('http');
const path = require('path');


module.exports = function(gulp) {
    const ports = {
        'frontend': 8080,
        'backend': 4900
    };


    gulp.task(
        'serve:browsersync',
        'proxies the localhost server via BrowserSync to dynamically update assets',
        function(cb) {
            browserSync.init({
                'port': ports.frontend,
                'files': false,
                'proxy': 'http://localhost:' + ports.backend,
                'tunnel': true,
                // Stop the browser from automatically opening
                'open': false
            }, function() {
                cb();
            });
        }
    );


    gulp.task('serve', 'serves static templates locally', ['serve:browsersync'], function() {
        // quick hack; should be replaced with nodemon or something similar as soon as a backend is
        // decided upon
        http.createServer(ecstatic({
            'root': './build',
            'cache': 0
        })).listen(ports.backend);
    });
};
