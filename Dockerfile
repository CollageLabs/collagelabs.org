FROM dockershelf/node:16
LABEL maintainer "Luis Alejandro Martínez Faneyth <luis@luisalejandro.org>"

ARG UID=1000
ARG GID=1000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

RUN apt-get update && \
    apt-get install gnupg dirmngr git sudo libpng-dev \
                    build-essential autoconf automake gcc \
                    ruby3.1 ruby3.1-dev python3.10-dev

RUN dirmngr --debug-level guru

RUN gpg --lock-never --no-default-keyring \
        --keyring /usr/share/keyrings/yarn.gpg \
        --keyserver hkp://keyserver.ubuntu.com:80 \
        --recv-keys 23E7166788B63E1E
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN gpg --lock-never --no-default-keyring \
        --keyring /usr/share/keyrings/google-chrome.gpg \
        --keyserver hkp://keyserver.ubuntu.com:80 \
        --recv-keys 78BD65473CB3BD13
RUN echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update && \
    apt-get install yarn google-chrome-stable

RUN gem install bundler

RUN EXISTUSER=$(getent passwd | awk -F':' '$3 == '$UID' {print $1}') && \
    [ -n "${EXISTUSER}" ] && deluser ${EXISTUSER} || true

RUN EXISTGROUP=$(getent group | awk -F':' '$3 == '$GID' {print $1}') && \
    [ -n "${EXISTGROUP}" ] && delgroup ${EXISTGROUP} || true

RUN groupadd -g "${GID}" collagelabs || true
RUN useradd -u "${UID}" -g "${GID}" -ms /bin/bash collagelabs

RUN echo "collagelabs ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/collagelabs

USER collagelabs

RUN mkdir -p /home/collagelabs/app

WORKDIR /home/collagelabs/app

CMD tail -f /dev/null
