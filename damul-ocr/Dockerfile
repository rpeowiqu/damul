# Build stage
FROM python:3.9-slim AS build
WORKDIR /app

# 기본 패키지 설치
RUN apt update && apt install -y libgomp1

# 의존성 파일 복사 및 설치
COPY . /app/

RUN pip install -r requirements.txt

# 실행 명령
CMD uvicorn --host=0.0.0.0 --port 8000 main:app
