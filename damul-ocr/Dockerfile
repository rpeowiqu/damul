# Build stage
FROM python:3.9-slim AS build
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 소스 복사
COPY . .

# Run stage
FROM python:3.9-slim
WORKDIR /app

# 빌드 스테이지에서 설치된 패키지 복사
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=build /app .

# 환경변수 설정
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT="prod"

# 포트 설정
EXPOSE 8000

# 실행 명령
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]