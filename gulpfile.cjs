const gulp = require('gulp');
// const gulpHash = require('gulp-hash');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require("gulp-clean-css");

const browserSync = require('browser-sync').create();

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './dist',
    }
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function compileCSS() {
    return gulp.src('src/assets/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        // .pipe(hash({ template: '<%= name %>-<%= hash %>.min<%= ext %>' })) // Adds randomly generated hash to JS file name
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream()); 
}

function watchFiles() {
    gulp.watch('src/assets/images', gulp.series(reload));
    gulp.watch('dist/*.html', gulp.series(reload));
    gulp.watch('src/assets/scss/*.scss', gulp.series(compileCSS, reload));
}

exports.serve = serve;
exports.default = gulp.series(serve, watchFiles);