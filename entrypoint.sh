#!/bin/sh
php script/make-db.php
php -S 0.0.0.0:80 -t /app/public_html &
exec crond -f -l 8
