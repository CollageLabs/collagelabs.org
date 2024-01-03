FROM dockershelf/node:18-bookworm
LABEL maintainer "Luis Alejandro Martínez Faneyth <luis@luisalejandro.org>"

ARG UID=1000
ARG GID=1000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN apt-get update && \
    apt-get install chromium gnupg dirmngr git sudo libpng-dev libtool \
                    build-essential autoconf automake gcc pkg-config \
                    ruby3.1 ruby3.1-dev python3-dev

RUN dirmngr --debug-level guru

RUN gpg --lock-never --no-default-keyring \
        --keyring /usr/share/keyrings/yarn.gpg \
        --keyserver hkp://keyserver.ubuntu.com:80 \
        --recv-keys 23E7166788B63E1E
RUN echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && \
    apt-get install yarn

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
