var path = require('path');


module.exports = function(gulp, plugins) {
    gulp.task('build', 'builds all the registered static resources from assets into build', [
        // Add your build tasks here (must be prefixed with build:)
        'build:fonts',
        'build:images',
        'build:scripts',
        'build:styles',
        'build:templates'
    ], function(next) {
        if(['development', '', undefined].indexOf(process.env.NODE_ENV) !== -1) {
            // don't create revisions during development
            return next();
        }

        var rev = new plugins.revAll();

        gulp.src(path.join(gulp.outputPath, '**', '*'))
            .pipe(plugins.filter(function(file) {
                // forgive me father, for I have sinned
                return !/(\.[0-9a-f]{8}\..{2,}|rev-manifest.json|\.map)$/.test(file.path);
            }))
            .pipe(rev.revision())
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(rev.manifestFile())
            .pipe(gulp.dest(gulp.outputPath))
            .on('finish', next)
            .on('error', next);
    });
};
