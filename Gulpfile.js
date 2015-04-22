var gulp = require('gulp'),
    server = require('gulp-express'), //Plugin for Express app-server
    babel = require("gulp-babel"), //For converting ES6 to ES5;
    rename = require('gulp-rename'), //Renaming of files,
    jasmine = require('gulp-jasmine'), //Testing with Jasmine
    runSequence = require('run-sequence');


var paths = {
  src: {
    js: 'src',
    server: 'server.js'
  },
  dest: {
    path: 'dest',
    server: 'serverES5.js'
  }
};

/**
  Runs tests
  Expects tests to be in sub-folders called __test__
**/
gulp.task('run_tests', function() {
  console.log('### RUNNING TESTS ###');
  return gulp.src(paths.dest.path + '/**/__test__/*.js')
    .pipe(jasmine());
});

//Starts the server
gulp.task('server_dev', function() {
  console.log('### STARTING SERVER ###');
  return server.run([paths.dest.server]);
});

//Starts the server with 'production' as Node environment
gulp.task('server_prod', function() {
  console.log('### STARTING SERVER ###');
  var options = {
    cwd: undefined
  }
  options.env = process.env;
  options.env.NODE_ENV = 'production';

  return server.run([paths.dest.server], options);
});

/**
  Creates a ES6 to ES5 transpiled copy of server.js
  called serverES5.js
**/
gulp.task('es5ifyServerJS', function() {
  console.log ('### ES5IFY SERVER.JS ###');
  return gulp.src(paths.src.server)
    .pipe(babel())
    .pipe(rename(paths.dest.server))
    .pipe(gulp.dest('.'));
});


/**
  Creates ES6 to ES5 transpiled copies of js files in /app
  and puts the copies in /dest, keeping the same structure
**/
gulp.task('es5ifySrc', function() {
  console.log ('### ES5IFY SCRIPTS IN /SRC ###');
  return gulp.src([paths.src.js+'/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest(paths.dest.path));
});

gulp.task('copy_non_js_files', function() {
  return gulp.src(['!'+paths.src.js+'/**/*.js', paths.src.js+'/**/*.*'])
    .pipe(gulp.dest(paths.dest.path));
});

gulp.task('build_js', function(callback) {
  runSequence('es5ifySrc', 'es5ifyServerJS', callback);
});

gulp.task('build', function(callback) {
  runSequence('build_js', 'copy_non_js_files', callback);
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

//Wathces changes on files and executes task when changes are detected
gulp.task('watch', function(callback) {
  console.log('### WATCHING ###');
  gulp.watch([paths.src.server, paths.src.js + '/**/*.js'], ['run_dev']);
});

gulp.task('watch_tests', function(callback) {
  console.log('### WATCHING TESTS ###');
  gulp.watch([paths.src.js + '/**/*.js'], ['build_and_test']);
});

gulp.task('test', function(callback) {
  runSequence('build_and_test', 'watch_tests', callback);
});

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
