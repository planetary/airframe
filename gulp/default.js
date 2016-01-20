const runSequence = require('run-sequence');


module.exports = function(gulp) {
    gulp.task(
        'default',
        'builds the site, serves it locally and redeploys when files are changed',
        function() {
            runSequence('serve', 'watch');
        }
    );
};
