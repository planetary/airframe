module.exports = function( gulp, plugins ) {
    var colors = plugins.util.colors;

    var linterErrors = function( file ) {
        if( !file.scsslint.success ) {
            plugins.util.log(colors.red(file.scsslint.issues.length + ' issues found in ' + file.path));

            file.scsslint.issues.forEach(function (issue) {
                var severity = issue.severity === 'warning' ? 'W' : 'E';
                var logMsg = colors.cyan(file.path) + ':' + colors.magenta(issue.line) + ' [' + severity + '] ' + issue.reason;

                plugins.util.log(logMsg);
            });
        } else {
            plugins.util.log(colors.green('Linting passed for ' + file.path));
        }
    };

    gulp.task( 'scss-lint', function() {
        gulp.src( [ 'src/styles/**/*.scss', '!src/styles/vendor/**/*' ] )
        .pipe( plugins.scssLint( {
            'config': '.scss-lint.yml',
            'customReport': linterErrors
        } ) );
    } );
};