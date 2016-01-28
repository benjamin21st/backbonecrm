/* globals require, console, process, __dirname */

'use strict';

var gulp = require('gulp'),
    gulpClean = require('gulp-clean'),
    sass = require('gulp-ruby-sass'),
    debug = require('gulp-debug'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    // minifyHTML = require('gulp-minify-html'),
    runSequence = require('run-sequence'),
    rjsOptimize = require('gulp-requirejs-optimize');


gulp.task('compile-css', function () {
  // Compile sass and/or scss files to css
  return sass('styles/sass')
    .pipe(gulp.dest('styles/css'));
});


gulp.task('compile-js', function () {
  /**
   * This job moves all development js files to production
   * folder
   * TODO: Add uglify to this job
   * @param  {[type]} 'js/src*.js' JS source files
   * @return {[type]}              JS output files
   */
  return gulp.src('js/src/**/*.js')
    .pipe(debug())
    .pipe(gulp.dest('js/build'));
});


gulp.task('compile-html', function () {
  /**
   * This job moves all html templates into the build folder,
   * TODO: add minification.
   */
  // if (buildForProduction) {
  //   return gulp.src('js/src/**/*.html')
  //     .pipe(minifyHTML())
  //     .pipe(gulp.dest('js/build'));
  // }

  return gulp.src('js/src/**/*.html')
    .pipe(gulp.dest('js/build'));
});


gulp.task('compile-templates', function () {
  /**
   * This job moves all html templates into the build folder,
   * TODO: add minification.
   */
  // if (buildForProduction) {
  //   return gulp.src('js/src/**/*.html')
  //     .pipe(minifyHTML())
  //     .pipe(gulp.dest('js/build'));
  // }

  return gulp.src('js/src/templates/*.html')
    .pipe(gulp.dest('js/build/templates'));
});


gulp.task('clean', function () {
  var args = process.argv,
      type = args[3] ? args[3].slice(2) : 'all',
      dest;

  if (type === 'js') {
    dest = 'js/build';
  } else if (type === 'css') {
    dest = 'styles/css';
  } else {
    dest = ['js/build', 'styles/css'];
  }

  return gulp.src(dest)
    .pipe(gulpClean());
});


gulp.task('newApp', function() {
  var fs = require('fs'),
      args = process.argv,
      newAppName = args[3].slice(2),
      currDir = __dirname,
      appDir;

  console.log('Creating new app: ' + newAppName);

  var createNewAppFolder = function (newAppName) {
    appDir = currDir + '/js/src/apps/' + newAppName;

    if (!fs.exists(appDir)) {
      fs.mkdir(appDir);
      createNewAppModules(appDir);
    } else {
      console.log('App with the same name exists.');
    }
  };

  var createNewAppModules = function (appDir) {
      var scriptsDir = appDir + '/scripts',
          templatesDir = appDir + '/templates',
          modelsDir = scriptsDir + '/models',
          viewsDir = scriptsDir + '/views';

      var dirs = [scriptsDir, templatesDir, modelsDir, viewsDir];

      console.log('>> Setting up app modules ...');

      for (var i = 0, len = dirs.length; i < len; i++) {
        if (!fs.exists(dirs[i])) {
          fs.mkdir(dirs[i]);
        } else {
          console.log('This directory already exists.');
        }
      }

  };


  return createNewAppFolder(newAppName);
});


gulp.task('default', ['compile-css', 'compile-js', 'compile-html'], function () {
  // body...
  gulp.watch('styles/sass/**/*.scss', ['compile-css']);
  gulp.watch('js/src/**/*.js', ['compile-js']);
  gulp.watch('js/src/**/*.html', ['compile-html']);
});


gulp.task('build', function () {
  runSequence('clean', [
    'compile-css', 'compile', 'compile-templates'
    ]);
});


gulp.task('compile', function () {
  var args = process.argv,
      appName = args[3] ? args[3].slice(2) : null,
      optimizeOpt = args[4] ? args[4].slice(2) : 'uglify',
      optionSet = [
        {
          'appName': 'app',
          'include': [
            'local_config', 'index', 'common', 'app'
          ]
        }],
      exclusions = ['chart'];

  var runCompilation = function (options) {
    return gulp.src('js/src/' + options.appName + '.js')
      .pipe(rjsOptimize({
        optimize: optimizeOpt,
        paths: {
          jquery:     '../vendor/jquery-2.1.3.min',
          underscore: '../vendor/lodash',
          backbone:   '../vendor/backbone',
          bootstrapOverlay:  '../vendor/bootstrapOverlay',
          handlebars: '../vendor/handlebars',
          text:       '../vendor/text',
          templates:  'templates/'
        },
        shim: {
          underscore: {
            exports: '_'
          },
          backbone: {
            deps: [
              'underscore',
              'jquery'
            ],
            exports: 'Backbone'
          },
          bootstrapOverlay: {
            deps: [
              'jquery'
            ],
            exports: 'bootstrapOverlay'
          },
          handlebars: {
            exports: 'Handlebars'
          }
        },

        exclude: [
          'jquery',
          'underscore',
          'backbone',
          'bootstrapOverlay',
          'handlebars',
          'text'
        ],

        include: options.include
        // [
        //   'local_config', 'index', 'common', appName
        // ]
      }))
      .pipe(gulp.dest('js/build/'));
  };

  runCompilation(optionSet[0]);
});
