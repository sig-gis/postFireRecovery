#!/bin/bash

#source /home/postfirerecovery_env/bin/activate
cd /home/postfirerecovery
git reset --hard HEAD
git pull
gulp build
python manage.py collectstatic
service supervisor restart
service nginx restart
