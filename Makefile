#!/usr/bin/env make -f
# -*- makefile -*-

SHELL = bash -e


image:
	@docker-compose -p collagelabs -f docker-compose.yml build --force-rm --pull

start:
	@docker-compose -p collagelabs -f docker-compose.yml up --remove-orphans -d

dependencies: start
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs bundle install --path=vendor/bundle
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs yarn install

build_production: start
	@docker-compose -p collagelabs -f docker-compose.yml exec \
		-T --user collagelabs collagelabs yarn run build:pwa:optim

console: start
	@docker-compose -p luisalejandro -f docker-compose.yml exec \
		--user luisalejandro luisalejandro bash

stop:
	@docker-compose -p luisalejandro -f docker-compose.yml stop luisalejandro

down:
	@docker-compose -p luisalejandro -f docker-compose.yml down \
		--remove-orphans

destroy:
	@docker-compose -p luisalejandro -f docker-compose.yml down \
		--rmi all --remove-orphans -v