var gulp = require( 'gulp' ),
    gulpFilter = require( 'gulp-filter' ),
    rename = require( 'gulp-rename' ),
    uglify = require( 'gulp-uglify' ),
    sass = require( 'gulp-sass' ),
    concat = require( 'gulp-concat' ),
    csso = require( 'gulp-csso' ),
    fs = require( 'fs' ),
    jade = require( 'gulp-jade' ),
    scsslint = require( 'gulp-scss-lint' ),
    newer = require( 'gulp-newer' ),
    image = require( 'gulp-image' ),
    prefix = require( 'gulp-autoprefixer' ),
    gutil = require( 'gulp-util' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    colors = gutil.colors,
    notify = require( 'gulp-notify' ),
    path = require( 'path' ),
    watchify = require( 'watchify' ),
    browserify = require( 'browserify' ),
    source = require( 'vinyl-source-stream' ),
    buffer = require( 'vinyl-buffer' );

var destPath = 'dist/';
var srcPath = 'src/';

// this will handle errors for us
var errorHandler = function( err ) {
    notify.onError( {
        message: "<%= error.message %>"
    } ).apply( this, arguments );

    this.emit( 'end' );
};

// concat, minify js
var args = watchify.args;
args.debug = true;

var bundler = browserify( './src/js/index.js', args );
// add any other browserify options or transforms here
bundler.transform( 'brfs' );

gulp.task( 'bundle:dev', bundle ); // so you can run `gulp bundle:dev` to build the file
gulp.task( 'bundle:watch', function() {
    var watcher = watchify( bundler );
    bundler.on( 'update', watcher ); // on any dep update, runs the bundler
} );

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on( 'error', errorHandler )
    .pipe( source( 'bundle.js' ) )
    // optional, remove if you dont want sourcemaps
      .pipe( buffer() )
      .pipe( sourcemaps.init( { loadMaps: true } ) ) // loads map from browserify file
      .pipe( sourcemaps.write( './' ) ) // writes .map file
    //
    .pipe( gulp.dest( './dist/js' ) )
    .pipe( notify ( { message: 'browserify bundler task complete' } ) );
}

// concat, minify css
gulp.task( 'styles', function() {
    gulp.src( [ srcPath + '/sass/**/*.scss' ] )
        .pipe( sass( {
            sourcemap: true,
            sourcemapPath: srcPath + '/sass'
        } ) )
        .on( 'error', errorHandler )
        .pipe( csso() )
        .pipe( prefix() )
        .pipe( gulp.dest( destPath + 'css' ) );
} );

//compile jade files
gulp.task( 'templates', function() {
    gulp.src( srcPath + 'jade/views/**/*.jade' )
        .pipe( jade( {
            'basedir': srcPath + 'jade'
        } ) )
        .on( 'error', errorHandler )
        .pipe( gulp.dest( destPath ) );
} );

//optimize images
gulp.task( 'img', function () {
    return gulp.src( [ srcPath + 'img/**' ] )
        .pipe( newer( destPath + 'img' ) )
        .pipe( image() )
        .pipe( gulp.dest( destPath + 'img' ) );
} );

// linting tasks to check for manifest adherance
var scssLinter = function( file ) {
    if ( !file.scsslint.success ) {
        gutil.log( colors.red( file.scsslint.issues.length + ' SCSS issue' + ( file.scsslint.issues.length == 1 ? '' : 's' ) + ' found in ' ) + file.path );
        var messages = new Array();
        file.scsslint.issues.forEach( function ( issue ) {
            messages.push( ":" + issue.line + " " + issue.reason );
        } );

        file.pipe( notify( {
            title: file.scsslint.issues.length + ' SCSS issue' + ( file.scsslint.issues.length == 1 ? '' : 's' ) + ' found',
            message: messages.join( "\n" ),
            "icon": path.join( __dirname, "fail.png" ), // case sensitive
        } ) );
    }
};

gulp.task( 'scss-lint', function() {
    gulp.src( srcPath + '/sass/**/*.scss' )
        .pipe( scsslint( {
            'config': '.scss-lint.yml',
            'customReport': scssLinter
        } ) );
} );

gulp.task( 'watch', function() {
    gulp.watch( srcPath + 'js/**', [ 'bundle:watch' ] );
    gulp.watch( srcPath + 'sass/**', [ 'scss-lint', 'styles' ] );
    gulp.watch( srcPath + '**/*.jade', [ 'templates' ] );
    gulp.watch( srcPath + 'img/**', [ 'img' ] );
} );

gulp.task( 'default', [ 'bundle:dev', 'styles', 'templates', 'img' ] );
