#!/bin/sh

source /home/postfirerecovery_env/bin/activate
cd /home/postfirerecovery
git reset --hard HEAD
git pull
gulp build
python manage.py collectstatic
service nginx restart
