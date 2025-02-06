# Build stage
FROM node:latest AS build
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=build /app/dist .

# 포트 설정
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]

