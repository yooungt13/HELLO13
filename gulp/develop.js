"use strict";

let gulp = require('gulp');
let exec = require('child_process').exec;
let spawn = require('child_process').spawn;

let sass = require('gulp-sass');

/**
 * 开发环境
 */
gulp.task('server', () => {
    // 切换环境并启动服务
    exec('jekyll serve').stdout.on('data', (chunk) => {
        console.log(chunk);
    });

    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});

gulp.task('sass', () => {
    return gulp.src('src/static/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/static/css'));
});

gulp.task('watch', () => {
    // watchers
    gulp.watch('src/static/scss/**/*.scss', ['sass']);
});

// 切换环境
gulp.task('develop', () => {
    switchEnv('develop');
    gulp.run('server');
});

gulp.task('production', () => {
    switchEnv('production');
    gulp.run('server');
});

let switchEnv = (ENV) => {
    exec('sed -i.tmp \'s/^ENV:.*$/ENV: ' + ENV + '/\' _config.yml && rm _config.yml.tmp', (err, stdout) => {
        if (err) {
            console.log('Switch env: ' + err);
        } else {
            console.log(stdout);
            end();
        }
    });
}