cd /root/proj/HELLO13/shell

date "+%Y-%m-%d %H:%M:%S" >> ./crontab.log

git add -f ./crontab.log
git commit -m 'Crontab daily push.'
git pull origin
git push origin
