# Build stage
FROM node:22.12.0 AS build
WORKDIR /app

# 의존성 파일 복사 및 캐시 방지
COPY package*.json ./
RUN npm cache clean --force && rm -rf node_modules package-lock.json && npm install

# Rollup 네이티브 모듈 강제 설치
RUN npm install @rollup/rollup-linux-x64-gnu

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 빌드 결과물 복사
COPY --from=build /app/dist .

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 설정
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
