var gulp = require('gulp'),
gulpFilter = require('gulp-filter'),
mainBowerFiles = require('main-bower-files'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
compass = require('gulp-compass'),
concat = require('gulp-concat'),
minifyCSS = require('gulp-minify-css'),
bower = require('gulp-bower');

var destPath = "dist/";
var srcPath = "src/";

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
  .pipe(compass({
    sass: srcPath + 'sass',
    image: srcPath + 'img',
    css: destPath + 'css',
    require: ['susy', 'breakpoint']
  }))
  .pipe(minifyCSS())
  .pipe(gulp.dest(destPath + 'css'))
})

// grab libraries files from bower_components, minify and push in /dist
gulp.task('bower', function() {

  var jsFilter = gulpFilter('*.js');
  var cssFilter = gulpFilter('*.css');

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

gulp.task('html', function() {
  gulp.src(srcPath + '*.html')
  .pipe(gulp.dest(destPath))
})

gulp.task('watch', function() {
  gulp.watch(srcPath + 'js/**', ['scripts']);
  gulp.watch(srcPath + 'sass/**', ['styles']);
  gulp.watch(srcPath + '**/*.html', ['html']);
})

gulp.task('default', ['bower', 'scripts', 'styles', 'html'])

gulp.task('watch', ['watch'])

