var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var filters = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

gulp.task('default', () => {
    return gutil.log('Gulp is running');
});

gulp.task('sass', function() {
    return gulp.src('src/assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded',
        precision: 10
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('src/assets/css'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    })
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
});