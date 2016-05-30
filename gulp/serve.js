const CONFIG = {
    ports: {
        frontend: 8080,
        backend: 4900
    }
};


const browserSync = require('browser-sync');
const ecstatic = require('ecstatic');
const http = require('http');


module.exports = function(gulp) {
    gulp.task(
        'serve:browsersync',
        'proxies the localhost server via BrowserSync to dynamically update assets',
        function(next) {
            browserSync.init({
                port: CONFIG.ports.frontend,
                files: false,
                proxy: `http://localhost:${CONFIG.ports.backend}`,

                // Stop the browser from automatically opening
                open: false
            }, next);
        }
    );


    gulp.task('serve', 'serves static templates locally', ['serve:browsersync'], function() {
        // quick hack; should be replaced with nodemon or something similar as soon as a backend is
        // decided upon
        http.createServer(ecstatic({
            root: './build',
            cache: 0
        })).listen(CONFIG.ports.backend);
    });
};
