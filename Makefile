run := docker run --rm -ti \
       -v $(shell pwd):/app \
			 -v $(shell pwd)/node_modules:/app/node_modules:delegated \
			 -v $(shell echo $$HOME)/.npmrc:/root/.npmrc:ro \
			 -e GH_TOKEN=$$GH_TOKEN \
			 -e NPM_TOKEN=$$NPM_TOKEN \
			 -w /app node:9.4.0

entry-point := run
ifeq ($(entry-point),$(firstword $(MAKECMDGOALS)))
  entry-point-arguments := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(entry-point-arguments):;@:)
endif

# ---

node_modules: package.json
	@$(run) yarn install && touch $@

.PHONY: $(entry-point)
$(entry-point): node_modules
	@$(run) $(entry-point-arguments)
