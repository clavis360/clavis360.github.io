'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');

gulp.task('sass', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sassGlob())
        .pipe(sass({ style: 'compressed', sourceComments: 'map', errLogToConsole: true }))
        .pipe(autoprefixer('last 2 version', "> 1%", 'ie 8', 'ie 9'))
        .pipe(gulp.dest('dist/css'))
        .on('error', gutil.log)
        .pipe(browserSync.stream());
});

gulp.task('views', function buildHTML() {
    return gulp.src('src/views/**/*.pug')
        .pipe(pug({
            // Your options in here.
        }))
        .pipe(gulp.dest('dist'))
        .on('error', gutil.log)
        .pipe(browserSync.stream())
});

gulp.task('image', () => {
    return gulp.src('src/assets/*')
        .pipe(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ], {
                verbose: true
            }))
        .pipe(gulp.dest('dist/assets'))
        .pipe(browserSync.stream())
})
gulp.task('serve', ['sass', 'views', 'image'], () => {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/views/**/*.pug", ['views']);
    gulp.watch("src/assets/*", ['image']);
    gulp.watch("dist/**/*.html").on('change', browserSync.reload);
})

gulp.task('build', ['sass', 'views', 'image'], () => console.log("building..."));