#!/bin/sh

git reset --hard HEAD
git pull
python /home/postfirerecovery/postfirerecovery/manage.py collectstatic
