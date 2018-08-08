var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('default', () => {
    return gutil.log('Gulp is running');
});

gulp.task('sass', function() {
    return gulp.src('source/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('source/css'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'source'
        }
    })
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('source/scss/**/*.scss', ['sass']);
});