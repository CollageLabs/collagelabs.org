
SHELL = bash -e

image:

	docker build --rm -t collagelabs/collagelabs.github.io:latest .

start:

	lando start
	lando yarn run start

stop:

	lando stop

destroy:

	lando stop
	lando destroy -y
	lando poweroff
	docker container prune -f
	docker image prune -f
	docker network prune -f
	docker volume prune -f
	lando --clear

clean:

	rm -rf node_modules Gemfile.lock yarn.lock vendor .bundle