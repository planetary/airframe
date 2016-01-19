const path = require('path');


module.exports = function(gulp, plugins, env) {
    gulp.task('build', 'builds all the registered static resources from assets into build', [
        // Add your build tasks here (must be prefixed with build:)
        'build:fonts',
        'build:images',
        'build:scripts',
        'build:styles',
        'build:templates'
    ], function(next) {
        if(env === 'local')  // don't create revisions during development
            return next();

        const rev = new plugins.revAll({
            dontRenameFile: [/.*\.html/]
        });

        gulp.src(path.join(gulp.outputPath, '**', '*'))
            .pipe(plugins.filter(function(file) {
                return !/(\.[0-9a-f]{8}\..{2,}|rev-manifest\.json|\.map)$/.test(file.path);
            }))
            .pipe(rev.revision())
            .pipe(gulp.dest(gulp.outputPath))
            .pipe(rev.manifestFile())
            .pipe(gulp.dest(gulp.outputPath))
            .on('finish', next)
            .on('error', next);
    });
};
