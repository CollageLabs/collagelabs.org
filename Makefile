
SHELL = bash -e

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
