run:
	docker run -it -d -p 3000:3000 --name scraper-front scraper-front

stop:
	docker stop scraper-front
	docker rm scraper-front

build:
	docker build --platform linux/amd64 -t scraper-front .

portainerpush:
	docker image save scraper-front | pigz --fast | docker --context portainer-pix load
