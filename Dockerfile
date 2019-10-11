FROM dockershelf/node:12
LABEL maintainer "Luis Alejandro Martínez Faneyth <luis@luisalejandro.org>"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && \
    apt-get install gnupg git sudo libpng-dev libpng-dev build-essential ruby2.5 ruby2.5-dev

RUN ln -s /usr/lib/x86_64-linux-gnu/libruby-2.5.so.2.5 /usr/lib/x86_64-linux-gnu/libruby.so.2.5

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -sS https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] https://dl-ssl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list

RUN apt-get update && \
    apt-get install yarn google-chrome-stable

RUN gem install bundler

RUN useradd -ms /bin/bash node
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node
