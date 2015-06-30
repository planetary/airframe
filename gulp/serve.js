var browserSync = require('browser-sync'),
    ecstatic = require('ecstatic'),
    http = require('http'),
    path = require('path');


module.exports = function(gulp) {
    var ports = {
        'frontend': 3000,
        'backend': 4900
    };


    gulp.task('serve:browsersync', 'proxies the localhost server via BrowserSync to ' +
                                   'dynamically update assets', function() {
        browserSync({
            'port': ports.frontend,
            'files': path.join('.', gulp.outputPath, '**', '*'),
            'proxy': 'http://localhost:' + ports.backend
        });
    });


    gulp.task('serve', 'serves static templates locally', ['serve:browsersync'], function() {
        // quick hack; should be replaced with nodemon or something similar as soon as a backend is
        // decided upon
        http.createServer(ecstatic({
            'root': './build',
            'cache': 0
        })).listen(ports.backend);
    });
};
