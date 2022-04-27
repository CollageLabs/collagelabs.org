
Current version: 0.2.5

## How to start hacking this website?

  * Install [Docker Community Edition](https://docs.docker.com/install/#supported-platforms) according with your operating system
  * Install [Docker Compose](https://docs.docker.com/compose/install/) according with your operating system.

      - [Linux](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)
      - [Mac](https://docs.docker.com/compose/install/#install-compose-on-macos)
      - [Windows](https://docs.docker.com/compose/install/#install-compose-on-windows-desktop-systems)

* Install a git client.
* Clone the repository at `https://github.com/CollageLabs/collagelabs.org`.

        git clone https://github.com/CollageLabs/collagelabs.org

* Open a terminal and navigate to the newly created folder.
* Change to the `develop` branch.

        git checkout develop

* Execute the following command to create the docker image (first time only):

        make image

* Execute the following command to install dependencies:

        make dependencies

* Execute the following command to start the project:

        make start

* Execute the following command to stop the project (you can also hit ctrl+C):

        make stop

## Made with 💖 and 🍔

![Banner](https://raw.githubusercontent.com/CollageLabs/collagelabs.org/develop/_images/promo-open-source.svg)

> Web [collagelabs.org](http://collagelabs.org/) · GitHub [@CollageLabs](https://github.com/CollageLabs) · Twitter [@CollageLabs](https://twitter.com/CollageLabs)