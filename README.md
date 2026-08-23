# Job Tracker

Aplicação full-stack para organizar vagas de emprego e acompanhar processos seletivos em um único lugar, com foco principal no desenvolvimento backend utilizando Java e Spring Boot.

O projeto foi criado para consolidar conhecimentos em construção de APIs REST, autenticação, autorização, persistência de dados, testes e conteinerização.

> Status: em desenvolvimento.

## Backend

O backend disponibiliza uma API REST com:

- Cadastro e login de usuários.
- Autenticação stateless com JWT.
- Senhas protegidas com BCrypt.
- CRUD de vagas de emprego.
- Alteração individual do status de uma vaga.
- Busca e filtros com Spring Data JPA Specifications.
- Isolamento dos dados por usuário autenticado.
- Validação dos dados de entrada.
- Tratamento global de exceções.
- Migrations versionadas com Flyway.
- Testes unitários com JUnit e Mockito.

## Tecnologias

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Bean Validation
- JWT
- PostgreSQL
- Flyway
- Maven
- JUnit e Mockito
- Docker e Docker Compose

## Frontend

O frontend permite utilizar os recursos da API por meio de uma dashboard com visualizações em Kanban e lista. A interface foi construída com React, TypeScript, Vite e Tailwind CSS.

## Estrutura

```text
jobtracker/
|-- backend/
|-- frontend/
```

O principal objetivo técnico do projeto é demonstrar a construção de uma aplicação backend organizada, segura e integrada a uma interface web funcional.
