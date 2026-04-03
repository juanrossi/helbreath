.PHONY: build deploy optimize

build:
	GOOS=linux GOARCH=amd64 go build -o gameserver ./server/cmd/gameserver
	cd client && npm run build
	zip -r hbonline.zip client/dist/ gameserver
	rm gameserver

deploy: build
	hbdeploy
	rm hbonline.zip

optimize:
	find client/public/assets/spritesheets -name '*.png' | xargs oxipng -o 4 --strip safe -t 8
	find client/public/assets/minimaps -name '*.jpg' | xargs jpegoptim --strip-all -m85
