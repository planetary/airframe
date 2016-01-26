const CONFIG = {
    watch: [
        // jade files to watch for changes
        'assets/templates/**/*.jade'
    ],
    build: [
        // jade files to build
        'assets/templates/views/**/*.jade',
        '!assets/templates/views/**/_*.jade'
    ]
};


const browserSync = require('browser-sync');
const path = require('path');


module.exports = function(gulp, plugins) {
    gulp.task(
        'build:templates',
        'compiles the jade templates to the build folder',
        function() {
            return gulp.src(CONFIG.build)
                .pipe(plugins.jade({basedir: path.join(gulp.inputPath, 'templates')}))
                .on('error', plugins.notify.onError(function(err) {
                    return `${err.message} in ${err.fileName} at line ${err.lineNumber}`;
                }))
                .pipe(gulp.dest(gulp.outputPath))
                .pipe(browserSync.reload({stream: true}))
                .pipe(plugins.notify({message: 'Jade compilation complete', onLast: true}));
        }
    );


    gulp.task(
        'watch:templates',
        'watches the templates folder for changes and recompiles them',
        ['build:templates'],
        function() {
            gulp.watch(CONFIG.watch, ['build:templates']);
        }
    );
};
