FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl cron \
    && curl -fsSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb \
    && dpkg -i /tmp/debsuryorg-archive-keyring.deb \
    && echo "deb [signed-by=/usr/share/keyrings/debsuryorg-archive-keyring.gpg] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        php7.4-cli php7.4-curl php7.4-gd php7.4-mbstring \
        php7.4-mysql php7.4-sqlite3 php7.4-xml \
    && rm -rf /var/lib/apt/lists/* /tmp/debsuryorg-archive-keyring.deb

WORKDIR /app

RUN echo '*/5 * * * * (cd /app/script && php cron-queue-sizes.php && php cron-queue.php && php cron-globals.php && php cron-cache.php) >> /proc/1/fd/1 2>&1' | crontab -

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

