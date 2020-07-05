.build-moniteur-win:
	npm install && npm run build:win

.build-moniteur-linux:
	npm install && npm run build:linux

.publish-moniteur-win:
	npm install && npm run publish:win

.publish-moniteur-linux:
	npm install && npm run publish:linux

.build: .build-moniteur-linux .build-moniteur-linux

default: .build