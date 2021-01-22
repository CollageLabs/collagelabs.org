FROM dockershelf/node:14
LABEL maintainer "Luis Alejandro Martínez Faneyth <luis@luisalejandro.org>"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

RUN echo "Set disable_coredump false" >> /etc/sudo.conf

RUN apt-get update && \
    apt-get install net-tools netcat-openbsd

RUN route -n | awk '/^0.0.0.0/ {print $2}' > /tmp/host_ip.txt
RUN echo "HEAD /" | nc `cat /tmp/host_ip.txt` 8000 | grep squid-deb-proxy \
    && (echo "Acquire::http::Proxy \"http://$(cat /tmp/host_ip.txt):8000\";" > /etc/apt/apt.conf.d/30proxy) \
    || echo "No squid-deb-proxy detected on docker host"

RUN apt-get update && \
    apt-get install gnupg git sudo libpng-dev libpng-dev build-essential \
                    build-essential autoconf automake gcc \
                    ruby2.7 ruby2.7-dev python2.7-dev

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -sS https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] https://dl-ssl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list

RUN apt-get update && \
    apt-get install yarn google-chrome-stable

RUN gem install bundler

RUN useradd -ms /bin/bash node
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node
