var gulp = require('gulp'),
compass = require('gulp-compass'),
concat = require('gulp-concat'),
refresh = require('gulp-livereload'),
lr = require('tiny-lr'),
server = lr(),
minifyCSS = require('gulp-minify-css'),
embedlr = require('gulp-embedlr'),
bower = require('gulp-bower');

gulp.task('scripts', function() {
  gulp.src(['src/**/*.js'])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(refresh(server))
})

gulp.task('styles', function() {
  gulp.src(['src/sass/**/*.scss'])
  .pipe(compass({
    sass: 'src/sass',
    image: 'src/img',
    css: 'dist/css',
    require: ['susy', 'breakpoint']
  }))
  .pipe(minifyCSS())
  .pipe(gulp.dest('dist/css'))
  .pipe(refresh(server))
})

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('dist/lib/'))
});

gulp.task('lr-server', function() {
  server.listen(35730, function(err) {
    if(err) return console.log(err);
  });
})

gulp.task('html', function() {
  gulp.src("src/*.html")
  .pipe(embedlr())
  .pipe(gulp.dest('dist/'))
  .pipe(refresh(server));
})

gulp.task('watch', function() {
  gulp.watch('src/js/**', ['scripts']);
  gulp.watch('src/sass/**', ['styles']);
  gulp.watch('src/**/*.html', ['html']);
})

gulp.task('default', ['bower', 'scripts', 'styles', 'html'])

gulp.task('watch', ['lr-server', 'watch'])

