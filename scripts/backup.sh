#!/bin/sh
mkdir /var/backups/postfirerecovery
cd /var/backups/postfirerecovery
chown postgres /var/backups/postfirerecovery
NOW=\$(date +"%Y-%m-%d")
su -c - postgres "pg_dump -c postfirerecovery > /var/backups/postfirerecovery/postfirerecovery-\$NOW.sql"
OLD=\$(date --date='7 day ago' +"%Y-%m-%d")
rm -f /var/backups/postfirerecovery/postfirerecovery-\$OLD.sql
mkdir /var/backups/postfirerecovery/uploads
