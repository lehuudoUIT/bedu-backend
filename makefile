.PHONY: run-mysql
run-mysql:
	@echo Starting postgres container
	-docker run -d \
		--name bedu-database-mysql \
		-e MYSQL_ROOT_PASSWORD=rootpassword \
		-e MYSQL_USER=bedu_user \
		-e MYSQL_PASSWORD=123456 \
		-e MYSQL_DATABASE=bedu \
		-p 3306:3306 \
		mysql:8.0


