//  Dependencies
var gulp = require('gulp'),
    server = require('gulp-express'), //Plugin for Express app-server
    babel = require("gulp-babel"), //For converting ES6 to ES5;
    rename = require('gulp-rename'), //Renaming of files,
    jasmine = require('gulp-jasmine'), //Testing with Jasmine
    sass = require('gulp-sass'), //For building CSS from Sass
    runSequence = require('run-sequence');

// Paths configuration
var paths = {
  src: {
    path: 'src',
    js: {
      path: 'src/js'
    },
    style: {
      path: 'src/style'
    },
    server: {
      path: 'server.js'
    },
    views: {
      path: 'src/views'
    }
  },
  dest: {
    path: 'dest',
    js: {
      path: 'dest/js'
    },
    server: {
      path: 'serverES5.js'
    }
  },
  www: {
    path: 'www',
    css: {
      path: 'www/css'
    }
  }
};

/**
  Runs tests
  Expects tests to be in sub-folders called __test__
**/
gulp.task('run_tests', function() {
  console.log('### RUNNING TESTS ###');
  return gulp.src(paths.dest.js.path + '/**/__test__/*.js')
    .pipe(jasmine());
});

//  Starts the server in dev mode
gulp.task('server_dev', function() {
  console.log('### STARTING SERVER IN DEV MODE ###');
  return server.run([paths.dest.server.path]);
});

//  Starts the server in production mode
gulp.task('server_prod', function() {
  console.log('### STARTING SERVER ###');
  var options = {
    cwd: undefined
  }
  options.env = process.env;
  options.env.NODE_ENV = 'production';

  return server.run([paths.dest.server.path], options);
});

/**
  Creates a ES6 to ES5 transpiled copy of server.js
  called serverES5.js
**/
gulp.task('es5ifyServerJS', function() {
  console.log ('### ES5IFY SERVER.JS ###');
  return gulp.src(paths.src.server.path)
    .pipe(babel())
    .pipe(rename(paths.dest.server.path))
    .pipe(gulp.dest('.'));
});


/**
  Creates ES6 to ES5 transpiled copies of js files in /src
  and puts the copies in /dest/js, keeping the same structure
**/
gulp.task('es5ifySrc', function() {
  console.log ('### ES5IFY SCRIPTS IN /SRC ###');
  return gulp.src([paths.src.js.path+'/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest(paths.dest.js.path));
});

// gulp.task('copy_non_js_files', function() {
//   return gulp.src(
//     [
//       '!'+paths.src.js.path+'/**/*.js',
//       paths.src.views.path+'/**/*.*'
//     ])
//     .pipe(gulp.dest(paths.dest.path));
// });

/**
  Runs the es5ify* jobs
**/
gulp.task('build_js', function(callback) {
  runSequence('es5ifySrc', 'es5ifyServerJS', callback);
});

gulp.task('build_css', function(callback) {
  console.log ('### BUILD CSS ###');
  gulp.src(paths.src.style.path+'/myApp.scss')
    .pipe(sass())
    .pipe(rename('app.css'))
    .pipe(gulp.dest(paths.www.css.path));
});

gulp.task('build', function(callback) {
  runSequence('build_js', 'build_css', callback);
});

gulp.task('build_and_test', function(callback) {
  runSequence('build', 'run_tests', callback);
});

gulp.task('run_dev', function(callback) {
  runSequence('build', 'run_tests', 'server_dev', callback);
});

gulp.task('run_prod', function(callback) {
  runSequence('build', 'server_prod', callback);
});

//  Wathces changes on files and executes task when changes are detected
gulp.task('watch', function(callback) {
  console.log('### WATCHING ###');
  gulp.watch([paths.src.server, paths.src.js + '/**/*.js'], ['run_dev']);
});

gulp.task('watch_tests', function(callback) {
  console.log('### WATCHING TESTS ###');
  gulp.watch([paths.src.js.path + '/**/*.js'], ['build_and_test']);
});

// gulp.task('test', function(callback) {
//   runSequence('build_and_test', 'watch_tests', callback);
// });

gulp.task('keep_alive', function(callback) {
});

//Default task. Run when gulp command is used
gulp.task('default', function(callback) {
 runSequence('run_dev', 'watch', callback);
});
gulp.task('dev', function(callback) {
  runSequence('run_dev', 'watch', callback);
});
gulp.task('prod', function(callback) {
  runSequence('run_prod', 'keep_alive', callback);
});
