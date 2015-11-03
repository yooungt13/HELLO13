cd /Users/hello13/Documents/Proj/HELLO13

date "+%Y-%m-%d %H:%M:%S" >> ./shell/crontab.log

git add -f ./shell/crontab.log
git commit -m 'Crontab daily push.'
git pull origin
git push origin