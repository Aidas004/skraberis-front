run:
	docker run -it -d -p 3000:3000 --name scraper-front my-react-app

stop:
	docker stop scraper-front
	docker rm scraper-front

build:
	docker build -t my-react-app .