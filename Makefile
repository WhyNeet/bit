start_services:
	docker-compose up -d
	docker-compose -f milvus-standalone-docker-compose.yml up -d
	localstack start -d
	awslocal s3api create-bucket --bucket testing-bucket --region us-east-1
build_images:
	docker build -f Dockerfile.web -t whyneet/bit-web .
	docker build -f Dockerfile.api -t whyneet/bit-api .
build_api_image:
	docker build -f Dockerfile.api -t whyneet/bit-api .
build_web_image:
	docker build -f Dockerfile.web -t whyneet/bit-web .
run_api_image:
	docker run -p 8080:8080 --env-file .env.api.docker.example -e PORT=8080 --network=host --name bit-api whyneet/bit-api
