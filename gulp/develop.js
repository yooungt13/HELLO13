"use strict";

let gulp = require('gulp');
let exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));

let sass = require('gulp-sass');

/**
 * 开发环境
 */
gulp.task('server', () => {

    var env = argv.env || 'develop';

    // 切换环境并启动服务
    switchEnv(env);
    runServer();

    // 监控scss变化
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

let switchEnv = (ENV) => {
    // 若不为dev或prod，则不切换环境
    if (ENV !== 'develop' && ENV !== 'production') {
        return;
    }

    exec('sed -i.tmp \'s/^ENV:.*$/ENV: ' + ENV + '/\' _config.yml && rm _config.yml.tmp', (err, stdout) => {
        if (err) {
            console.log('Switch env: ' + err);
        } else {
            console.log('Switch env: ' + ENV);
        }
    });
}

let runServer = () => {
    exec('jekyll serve').stdout.on('data', (chunk) => {
        console.log(chunk);
    });
}