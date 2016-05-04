"use strict";

let gulp = require('gulp');
let exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));

/**
 * 线上发布
 */
const SERVER_URL = 'root@43.241.219.90';

// 将build好的资源文件deploy至静态服务器
gulp.task('cp2static', ['scripts', 'styles', 'images'], (end) => {
    const LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/deploy/static/*',
          REMOTE_PATH = '/root/proj/combo/static';

    let cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, (err, stdout) => {
        if (err) {
            console.log('Copy2Static failed: ' + err);
        } else {
            end();
        }
    });
});

// 将build好的文件deploy至服务端
gulp.task('cp2server', ['cp2static'], (end) => {
    const LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/deploy/*',
          REMOTE_PATH = '/usr/share/nginx/html',
          REMOTE_PREVIEW_PATH = '/usr/share/nginx/preview';

    let cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, (err, stdout) => {
        if (err) {
            console.log('Copy2Server failed: ' + err);
        } else {
            end();
        }
    });
});

// 执行发布过程
gulp.task('deploy', ['cp2static', 'cp2server'], () => {
    console.log('Deploy complete.');
});

// 执行preview分支发布
gulp.task('preview', ['cp2static', 'cp2server'], () => {
    console.log('Preview Deploy complete.');
});

// push到github
gulp.task('push2git', (end) => {
    let cmd = 'git add .;git commit -m "Gulp deploy.";git pull origin;git push origin';
    exec(cmd, (err, stdout) => {
        if (err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
            end();

            process.exit(0);
        }
    });
});


