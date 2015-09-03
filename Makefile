PATH := node_modules/.bin:$(PATH)
GIT_BRANCH := $(shell git symbolic-ref HEAD --short)
NPM_VERSION := $(shell node -pe "require('./package.json').version")

build: clean
	babel src -d lib --experimental

release: test
	if [ "$(GIT_BRANCH)" != "master" ]; then \
		@echo "Versioning must be performed on the master branch"; \
		exit 1; \
	fi;
	npm version
	git push --follow-tags

clean:
	rm -rf lib

lint:
	eslint .

test: lint
	mocha --compilers js:babel/register --recursive

watch:
	npm test -- --watch

coverage:
	rm -rf ./coverage
	istanbul cover --report lcovonly node_modules/.bin/_mocha -- --compilers js:babel/register --recursive
	if [ -n "$(CI)" ]; then cat ./coverage/lcov.info | codecov; fi

docker-login:
	docker login -e $(DOCKER_EMAIL) -p $(DOCKER_PASSWORD) -u $(DOCKER_USERNAME)

docker-build:
	docker build --no-cache -t liddellj/my-app:$(NPM_VERSION) .

docker-run: docker-build
	docker run -t -i -P liddellj/my-app:$(NPM_VERSION)

docker-push: docker-build docker-login
	if [ -n "$(CI)" ] && [ -n "$(TRAVIS_TAG)" ]; then \
		docker push liddellj/my-app:$(NPM_VERSION); \
		sed -i -e s/my-app/my-app:$(NPM_VERSION)/g Dockerrun.aws.json; \
	else \
		@echo "Only push to Docker from Travis"; \
		exit 1; \
	fi

dynamodb:
	wget http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz
	tar xfz dynamodb_local_latest.tar.gz
	(java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory)

.PHONY: coverage test build