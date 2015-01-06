var gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    bower = require('gulp-bower'),
    fs = require('fs'),
    jade = require('gulp-jade'),
    scsslint = require('gulp-scss-lint'),
    newer = require('gulp-newer'),
    image = require('gulp-image'),
    prefix = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    colors = gutil.colors,
    notify = require('gulp-notify'),
    path = require('path'),
    install = require("gulp-install");

var destPath = "dist/";
var srcPath = "src/";


//this will handle errors for us
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

//concat, minify js
gulp.task('scripts', function() {
    gulp.src([srcPath + '**/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destPath + 'js'))
})

//concat, minify css
gulp.task('styles', function() {
    gulp.src([srcPath + '/sass/**/*.scss'])
    .pipe(sass({
        sourcemap: true,
        sourcemapPath: srcPath + '/sass',
        loadPath: ['bower_components/']
    }))
    .on('error', handleError)
    .pipe(csso())
    .pipe(prefix())
    .pipe(gulp.dest(destPath + 'css'))
})

gulp.task('install-dep', function() {

    gulp.src(['./bower.json', './package.json'])
        .pipe(install());

});

// grab libraries files from bower_components, minify and push in /dist
gulp.task('bower', function() {

    var jsFilter = gulpFilter('*.js');
    var cssFilter = gulpFilter('*.css');

    var check = fs.existsSync('./bower_components');
    if (!check) {
        console.log('No bower components installed.');
        return;
    }

    return gulp.src(mainBowerFiles({debugging:true}))

    // grab vendor js files from bower_components, minify and push in /dist
    .pipe(jsFilter)
    .pipe(gulp.dest(destPath + 'js/lib'))
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest(destPath + 'js/lib'))
    .pipe(jsFilter.restore())

    // grab vendor css files from bower_components, minify and push in /dist
    .pipe(cssFilter)
    .pipe(gulp.dest(destPath + 'css/lib'))
    .pipe(minifyCSS())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest(destPath + 'css/lib'))
    .pipe(cssFilter.restore())

});

//compile jade files
gulp.task('templates', function() {
    gulp.src(srcPath + 'jade/views/**/*.jade')
    .pipe(jade({
        'basedir': srcPath + 'jade'
    }))
    .pipe(gulp.dest(destPath))
});

//optimize images
gulp.task('img', function () {
  return gulp.src([srcPath + 'img/**'])
  .pipe(newer(destPath + 'img'))
  .pipe(image())
  .pipe(gulp.dest(destPath + 'img'));
});

// linting tasks to check for manifest adherance

var myCustomReporter = function (file) {
    if (!file.scsslint.success) {
        gutil.log(colors.red(file.scsslint.issues.length + ' SCSS issue' + (file.scsslint.issues.length == 1 ? '' : 's') + ' found in ') + file.path);
        var messages = new Array();
        file.scsslint.issues.forEach(function (issue) {
            messages.push(":" + issue.line + " " + issue.reason);
        });

        file.pipe(notify({
            title: file.scsslint.issues.length + ' SCSS issue' + (file.scsslint.issues.length == 1 ? '' : 's') + ' found',
            message: messages.join("\n"),
            "icon": path.join(__dirname, "fail.png"), // case sensitive
        }));
    }
}

gulp.task('scss-lint', function() {
    gulp.src(srcPath + '/sass/**/*.scss')
    .pipe(scsslint({
        'config': '.scss-lint.yml',
        'customReport': myCustomReporter
    }));
});

gulp.task('watch', function() {
    gulp.watch(srcPath + 'js/**', ['scripts']);
    gulp.watch(srcPath + 'sass/**', ['scss-lint', 'styles']);
    gulp.watch(srcPath + '**/*.jade', ['templates']);
    gulp.watch(srcPath + 'img/**', ['img']);
})

gulp.task('default', ['install-dep', 'scripts', 'styles', 'templates', 'img', 'watch'])
