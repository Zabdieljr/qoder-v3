# Use OpenJDK 21 with slim base
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Expose port
EXPOSE 8080

# Set memory options for Railway
ENV JAVA_OPTS="-Xmx512m -XX:+UseContainerSupport"

# Run the application
CMD ["java", "-jar", "-Dspring.profiles.active=production", "target/qoder-v3-0.0.1-SNAPSHOT.jar"]