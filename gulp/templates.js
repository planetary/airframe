var browserSync = require('browser-sync');


module.exports = function(gulp, plugins) {
    var paths = {
        'watch': [
            // jade files to watch for changes
            'assets/templates/**/*.jade'
        ],
        'lint': [
            // jade files to lint (ignore vendor)
            'assets/styles/**/*.scss',
            '!assets/styles/vendor/**/*'
        ],
        'build': [
            // jade files to build
            'assets/templates/views/**/*.jade',
            '!assets/templates/views/**/_*.jade'
        ],
        // input folder
        'input': 'assets/templates',
        // destination folder
        'output': 'build'
    };


    gulp.task('build:templates', 'compiles the jade templates to the build folder', function() {
        gulp.src(paths.build)
            .pipe(plugins.jade({'basedir': paths.input}))
            .on('error', plugins.notify.onError(function(err) {
                return err.message + ' in ' + err.fileName + ' at line ' + err.lineNumber;
            }))
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.reload({'stream': true}))
            .pipe(plugins.notify({'message': 'Jade compilation complete', 'onLast': true}));
    });


    gulp.task('watch:templates', 'watches the templates folder for changes and recompiles ' +
                                 'them', ['build:templates'], function() {
        gulp.watch(paths.watch , ['build:templates']);
    });
};
