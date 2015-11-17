var gulp = require('gulp');
var exec = require('child_process').exec;

var runSequence = require('run-sequence');

/**
 * 线上发布
 */

var SERVER_URL = 'root@43.241.219.90';

// 将build好的资源文件deploy至静态服务器
gulp.task('cp2static', ['scripts', 'styles'], function(end) {
    var LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/deploy/static/*',
        REMOTE_PATH = '/root/proj/combo/static';

    var cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Copy2Static failed: ' + err);
        } else {
            console.log('Copy2Static complete.');
            end();
        }
    });
});

// 将build好的文件deploy至服务端
gulp.task('cp2server', ['cp2static'], function(end) {
    var LOCAL_PATH = '/Users/hello13/Documents/Proj/HELLO13/deploy/*',
        REMOTE_PATH = '/usr/share/nginx/html';

    var cmd = 'scp -r ' + LOCAL_PATH + ' ' + SERVER_URL + ':' + REMOTE_PATH;

    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Copy2Server failed: ' + err);
        } else {
            console.log('Copy2Server complete.');
            end();
        }
    });
});

// 执行发布过程
gulp.task('deploy', function(end) {
    runSequence('cp2server', function(err) {
        if (err) {
            console.log('Deploy error: ' + err);
        } else {
            console.log('Deploy complete.');
            end();
        }
    });
});

// push到github
gulp.task('push2git', function(end) {
    var cmd = 'git add .;git commit -m "Gulp deploy.";git pull origin;git push origin';
    exec(cmd, function(err, stdout) {
        if (err) {
            console.log('Git push:' + err);
        } else {
            console.log(stdout);
            end();
        }
    });
});