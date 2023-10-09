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

# Documentation

## Machine Learning Service
ML Service is require redis and mongodb

### Fine tune model
#### Sentence Similarity
```
python fine-tune-sentence-similarity.py
```

#### Zero-shot Classification
```
python fine-tune-zero-shot-classification.py
```

## Rest API Service
ML Service is require mysql, redis, and mongodb

