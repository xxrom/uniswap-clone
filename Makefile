# Updating build for updating in netlify.app
build:
	yarn --cwd ./client-next/
	yarn --cwd ./client-next/ build && yarn --cwd ./client-next/ export
