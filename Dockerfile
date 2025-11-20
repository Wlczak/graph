FROM php:7.4-alpine

RUN apk add --no-cache curl bash

WORKDIR /app

RUN echo "*/5 * * * * cd /app/script && php cron-queue-sizes.php && php cron-queue.php && php cron-globals.php && php cron-cache.php; >> /proc/1/fd/1 2>&1" > /etc/crontabs/root

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

