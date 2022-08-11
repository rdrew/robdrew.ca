//@format
const yaml = require('js-yaml');
const fs = require('fs');
const { SITE, PORT, BSREWRITE, PATHS } = loadConfig();
//var server = require('browser-sync').create();
//global.server = server;
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

function loadConfig() {
  var ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// BrowserSync
function bsInit__local(done) {
  browsersync.init({
    server: "."
  });
  done();
}

// BrowserSync Reload
function bsReload(done) {
  browsersync.reload();
  done();
}


// Compile CSS
function styles() {
  'use strict';
  return gulp
    .src(PATHS.Scss.Dir + '/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass
        .sync({
          includePaths: PATHS.Scss.Libraries
        })
        .on('error', sass.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.Css.Dir))
    .pipe(browsersync.stream());
}

// Watch Files
function watchFiles() {
  'use strict';
  gulp.watch('./scss/**/*.scss', styles);
}

// Group complex tasks
const build = gulp.parallel(styles);
const watch_local = gulp.series(
  styles,
  gulp.parallel(watchFiles, bsInit__local)
);

// Export tasks
exports.build = build;
exports.styles = styles;
exports.local = watch_local;
exports.default = watch_local;
