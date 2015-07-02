var del = require('del'),
    path = require('path');


module.exports = function(gulp) {
    gulp.task('clean', 'deletes all build artifacts', function(next) {
        del([path.join(gulp.outputPath, '**', '*')], next);
    });
};
