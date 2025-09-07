# Qoder V3

A Spring Boot application built with modern Java technologies.

## Features

- **Spring Boot 3.5.5** with Java 21
- **Spring Data JPA** for database operations
- **PostgreSQL** database support
- **Spring Security** with OAuth2 client support
- **Thymeleaf** templating engine
- **Spring AI** integration with PostgresML embedding
- **Flyway** database migrations
- **Spring Boot Actuator** for monitoring
- **RESTful APIs** with Spring Data REST

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL database

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qoder-v3
   ```

2. **Configure the database**
   Update `src/main/resources/application.properties` with your database settings.

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## Building the Project

To build the project:

```bash
./mvnw clean package
```

This will create a JAR file in the `target` directory.

## Testing

Run the tests with:

```bash
./mvnw test
```

## Technologies Used

- Spring Boot 3.5.5
- Spring Data JPA
- Spring Security
- Spring AI
- PostgreSQL
- Thymeleaf
- Flyway
- Maven
- Lombok

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.