"use strict";

let gulp = require('gulp');
let exec = require('child_process').exec;

let sass = require('gulp-sass');

/**
 * 开发环境
 */
gulp.task('server', () => {
    // let cmd = 'sed -ig \'s/^ENV:.*$/ENV: develop/\' _config.yml';
    let cmd = 'jekyll serve';

    exec(cmd).stdout.on('data', (chunk) => {
        console.log(chunk);
    });

    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});

gulp.task('sass', () => {
    // Gets all files ending with .scss in src/static/scss and children dirs
    return gulp.src('src/static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/static/css'));
});

// Gulp watch syntax
gulp.task('watch', () => {
    // watchers
    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});