.PHONY: build up logs fmt lint deploy

build:
	docker-compose up -d --build

up:
	docker-compose up  -d

logs:
	docker-compose logs -f

fmt:
	docker-compose exec api yarn run eslint src --fix

lint:
	docker-compose exec api yarn run eslint src

deploy:
	git push heroku `git subtree split --prefix src master`:master
