/*global -$ */
'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var useref = require('gulp-useref');

gulp.task('styles', ['less'], function () {
  return gulp.src('app/styles/main.css')
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('less', function() {
  return gulp.src('app/styles/*.less')
  .pipe($.less())
  .pipe(gulp.dest('app/styles'))
  .pipe(gulp.dest('dist/styles'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
  //var assets = useref({searchPath: ['.tmp', 'app', '.']}).assets();

  return gulp.src(['app/*.html'])
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: false})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat(['app/fonts/**/*','bower_components/bootstrap/fonts/**/*']))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2,otf}'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/lib/fonts'))
    .pipe(gulp.dest('dist/lib/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task("lib", function(){
    gulp.src(['bower_components/angular/*.min.js','bower_components/angular/*.min.js.map'])
		.pipe(gulp.dest('.tmp/lib/js'))
        .pipe(gulp.dest('dist/lib/js'));
	gulp.src(['bower_components/angular-route/*.min.js','bower_components/angular-route/*.min.js.map'])
		.pipe(gulp.dest('.tmp/lib/js'))
        .pipe(gulp.dest('dist/lib/js'));
	gulp.src(['bower_components/bootstrap/dist/js/*.min.js'])
        .pipe(gulp.dest('.tmp/lib/js'))
		.pipe(gulp.dest('dist/lib/js'));
	gulp.src(['bower_components/bootstrap/dist/css/*.min.css','bower_components/bootstrap/dist/css/*.min.css.map'])
        .pipe(gulp.dest('.tmp/lib/css'))
		.pipe(gulp.dest('dist/lib/css'));
	gulp.src(['bower_components/jquery/dist/*.min.js'])
        .pipe(gulp.dest('.tmp/lib/js'))
		.pipe(gulp.dest('dist/lib/js'));
    gulp.src(['node_modules/underscore/*.js','node_modules/underscore/*.map'])
		.pipe(gulp.dest('dist/lib/js'))
		.pipe(gulp.dest('.tmp/lib/js'));		
});

gulp.task('clean', function () {
  require('del').bind(null, ['.tmp', 'dist/*']);
});

gulp.task('serve', ['styles', 'fonts','lib'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.less', ['styles', reload]);
  gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['jshint','lib', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});