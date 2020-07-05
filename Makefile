.build-moniteur-win:
	cd app && npm install && npm run build:win

.build-moniteur-linux:
	cd app && npm install && npm run build:linux

.publish-moniteur-win:
	cd app && npm install && npm run publish:win

.publish-moniteur-linux:
	cd app && npm install && npm run publish:linux

.build: .build-moniteur-linux .build-moniteur-linux

default: .build