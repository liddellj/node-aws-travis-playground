PATH := node_modules/.bin:$(PATH)
GIT_BRANCH := $(shell git branch | sed -n -e 's/^\* \(.*\)/\1/p')
NPM_VERSION := $(shell node -pe "require('./package.json').version")

all: test build

build: clean
	babel src -d lib --experimental

pre-release: test
	if [ "$(GIT_BRANCH)" != "master" ]; then \
		echo "Current branch is $(GIT_BRANCH). Versioning must be performed on master."; \
		exit 1; \
	fi;

release-patch: pre-release
	npm version patch
	git push --follow-tags

release-minor: pre-release
	npm version minor
	git push --follow-tags

release-major: pre-release
	npm version major
	git push --follow-tags

clean:
	rm -rf lib dynamodb

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

docker-build:
	docker build --no-cache -t liddellj/my-app:$(NPM_VERSION) .

docker-run: docker-build
	docker run -t -i -P liddellj/my-app:$(NPM_VERSION)

docker-push: docker-build
	docker login -e $(DOCKER_EMAIL) -p $(DOCKER_PASSWORD) -u $(DOCKER_USERNAME)
	if [ -n "$(CI)" ] && [ -n "$(TRAVIS_TAG)" ]; then \
		docker push liddellj/my-app:$(NPM_VERSION); \
		sed -i -e s/my-app/my-app:$(NPM_VERSION)/g Dockerrun.aws.json; \
	else \
		@echo "Only push to Docker from Travis"; \
		exit 1; \
	fi

dynamodb: clean
	mkdir dynamodb
	wget -P ./dynamodb http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest.tar.gz -nv
	cd dynamodb; tar xfz dynamodb_local_latest.tar.gz
	java -Djava.library.path=./dynamodb/DynamoDBLocal_lib -jar ./dynamodb/DynamoDBLocal.jar -inMemory &

.PHONY: all build pre-release release-patch release-minor release-major clean lint test watch coverage docker-build docker-run docker-push dynamodb