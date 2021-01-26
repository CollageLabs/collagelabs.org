#!/usr/bin/env make -f
# -*- makefile -*-

SHELL = bash -e


image:
	@docker-compose -p collagelabs -f docker-compose.yml build --force-rm --pull

start:
	@docker-compose -p collagelabs -f docker-compose.yml up --remove-orphans -d

dependencies: start
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs bundle config path vendor/bundle
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs bundle install
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs yarn install

build_production: start
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs yarn run build:pwa:optim
