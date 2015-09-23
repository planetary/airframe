const del = require('del');
const path = require('path');


module.exports = function(gulp) {
    gulp.task('clean', 'deletes all build artifacts', function(next) {
        del([path.join(gulp.outputPath, '**', '*')], next);
    });
};
