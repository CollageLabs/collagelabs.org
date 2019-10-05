![](https://rawcdn.githack.com/CollageLabs/collagelabs.org/57557046050b6515823f6c4ac819debcee40b346/_images/banner.svg)

---

[![](https://img.shields.io/github/release/CollageLabs/collagelabs.org.svg)](https://github.com/CollageLabs/collagelabs.org/releases) [![](https://img.shields.io/travis/CollageLabs/collagelabs.org.svg)](https://travis-ci.org/CollageLabs/collagelabs.org) [![](https://img.shields.io/github/issues-raw/CollageLabs/collagelabs.org/in%20progress.svg?label=in%20progress)](https://github.com/CollageLabs/collagelabs.org/issues?q=is%3Aissue+is%3Aopen+label%3A%22in+progress%22) [![](https://badges.gitter.im/CollageLabs/collagelabs.org.svg)](https://gitter.im/CollageLabs/collagelabs.org) [![](https://cla-assistant.io/readme/badge/CollageLabs/collagelabs.org)](https://cla-assistant.io/CollageLabs/collagelabs.org)

Current version: 0.1.0

## How to start hacking this website?

* Install [Docker Community Edition](https://docs.docker.com/install/#supported-platforms) according with your operating system
* Install [Lando](https://docs.devwithlando.io/installation/system-requirements.html) according with your operating system.

    - [Linux](https://docs.devwithlando.io/installation/linux.html)
    - [Mac](https://docs.devwithlando.io/installation/macos.html)
    - [Windows](https://docs.devwithlando.io/installation/windows.html)

* Install a git client.
* Clone the repository at `https://gitlab.com/CollageLabs/internal/collagelabs.org.git`.

        git clone https://gitlab.com/CollageLabs/internal/collagelabs.org.git

* Open a terminal and navigate to the newly created folder.
* Change to the `develop` branch.

        git branch develop

* Execute the following command to create the docker image (first time only):

        make image

* Execute the following command to start the project:

        make start

* Execute the following command to stop the project (you can also hit ctrl+C):

        make stop

## Made with :heart: and :hamburger:

![Banner](https://rawcdn.githack.com/CollageLabs/collagelabs.org/57557046050b6515823f6c4ac819debcee40b346/_images/promo-open-source.svg)

> Blog [collagelabs.org](http://collagelabs.org/blog) · GitHub [@CollageLabs](https://github.com/CollageLabs) · Twitter [@CollageLabs](https://twitter.com/CollageLabs)