# Asset Management System (In Development Enviorment)

A full-stack asset-management application for registering users, tracking assets, issuing assets to employees, and managing return and asset requests through role-based dashboards.

## Tech stack

- Frontend: React, Vite, React Router, Axios
- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA
- Database: MySQL
- Authentication: JSON Web Tokens (JWT)

## Project structure

```text
Asset_management/
├── frontend/   # React single-page application
└── backend/    # Spring Boot REST API
```

## Prerequisites

- Node.js and npm
- Java 17+
- Maven 3.6+
- MySQL

## Configuration

The backend reads its configuration from environment variables. Set these before starting it:

```text
DATABASE_URL=jdbc:mysql://localhost:3306/asset_management
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use_a_long_random_secret
```

Create the `asset_management` MySQL database first, or adjust `DATABASE_URL` to use an existing database. Hibernate is configured to update the schema automatically.

## Run locally

Start the backend from the `backend` directory:

```bash
mvn spring-boot:run
```

Start the frontend in a second terminal from the `frontend` directory:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. The Spring Boot API uses its configured/default server port (typically `8080`).

## Available features

- User registration and JWT login
- Role-based protected dashboards
- Asset creation and status tracking
- Asset issue, return, and request workflows
- Employee, manager, stock-manager, and asset-issuer dashboard data

## API overview

Key API routes include:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/asset/create-asset
GET  /api/asset/status
POST /api/assets/issue-request
POST /api/assets/return-request
POST /api/assets/asset-request
GET  /api/dashboard/{employee|manager|stock-manager|asset-issuer}
```

## Frontend commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm test         # Run frontend tests
```
