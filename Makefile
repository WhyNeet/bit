start_services:
	docker-compose up -d
	docker-compose -f milvus-standalone-docker-compose.yml up -d
	localstack start -d
	awslocal s3api create-bucket --bucket testing-bucket --region us-east-1
build_images:
	sudo docker build -f Dockerfile.web -t whyneet/bit-web .
	sudo docker build -f Dockerfile.api -t whyneet/bit-api .
