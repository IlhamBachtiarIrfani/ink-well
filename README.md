# Documentation
## REST API Service
REST API Service is require this stack :
- mariadb
- mongodb
- rabbitmq

set ```.env``` file in ```api_service/.env``` with this format
```
IS_DEBUG=0

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_EXPIRED_TIME=

SALT_ROUNDS=
PASSWORD_SECRET_KEY=
```

## Machine Learning Service
REST API Service is require this stack :
- mongodb
- rabbitmq

set ```.env``` file in ```ml_service/.env``` with this format
```
IS_DEBUG=0

RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USER=
RABBITMQ_PASSWORD=
RABBITMQ_QUEUE=

MONGO_HOST=
MONGO_PORT=
MONGO_USER=
MONGO_PASSWORD=
MONGO_DB_NAME=

SENTENCE_SIMILARITY_THREAD=
ZERO_SHOT_CLASSIFICATION_THREAD=
```


# Installation
Run Docker Compose Up
```
docker compose up -d
```

Run ML Service
```
cd ml_service
python main.py
```

Run API Service
```
cd api_service
npm install
npm run build
npm run start:prod
```

# Development Docs

### Fine tune model
#### Sentence Similarity
```
python fine-tune-sentence-similarity.py
```

#### Zero-shot Classification
```
python fine-tune-zero-shot-classification.py
```
