# Build stage
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# Gradle 의존성 먼저 복사 및 다운로드
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x ./gradlew

# 의존성 다운로드
RUN ./gradlew dependencies

# 소스 복사 및 빌드
COPY src ./src
RUN ./gradlew clean build -x test --no-daemon

# Run stage
FROM openjdk:17-slim
WORKDIR /app

# 빌드 결과물 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 환경변수 설정
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE="prod"

# 포트 설정
EXPOSE 8080

# 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]

