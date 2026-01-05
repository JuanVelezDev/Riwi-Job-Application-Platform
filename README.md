# RiwiTalentRidge - Enterprise Job Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![NestJS](https://img.shields.io/badge/framework-NestJS-red) ![TypeORM](https://img.shields.io/badge/ORM-TypeORM-orange) ![Docker](https://img.shields.io/badge/container-Docker-blue)

**Technical Assessment** developed by **Juan Velez** (JuanVelezDev).

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [Prerequisites](#-prerequisites)
6. [Installation & Setup](#-installation--setup)
7. [Environment Variables](#-environment-variables)
8. [Testing Strategy](#-testing-strategy)
9. [API Documentation](#-api-documentation)
10. [Deployment](#-deployment)
11. [Troubleshooting](#-troubleshooting)

---

## 🌟 Project Overview
**RiwiTalentRidge** is a scalable, full-stack recruitment platform designed to bridge the gap between technology talent ("Coders") and hiring companies. It facilitates the entire lifecycle of a job application, from vacancy creation to candidate application and tracking.

The system is built with a **Monolithic Architecture** where the robust NestJS backend serves both the secure API endpoints and the static frontend assets, ensuring a simplified deployment pipeline.

---

## 🏗 Architecture
The solution implements a **Layered Architecture** using NestJS modules:

*   **Controller Layer**: Handles HTTP requests and Input Validation (DTOs).
*   **Service Layer**: Contains Business Logic and strict typing.
*   **Data Access Layer**: Uses TypeORM Entities to interact with PostgreSQL.
*   **Frontend Layer**: Vanilla JavaScript/TailwindCSS client served statically by the Backend.

---

## ⚡ Key Features

### 🔐 Authentication & Security
*   **JWT Strategies**: Secure stateless authentication.
*   **Role-Based Access Control (RBAC)**: Distinct guards for `Admin`, `Gestor`, and `Coder`.
*   **API Key Protection**: Public endpoints protected via `x-api-key`.

### 👥 User Roles
1.  **Admin**: System superuser. Can manage all resources (Seed credential: `admin@riwi.io`).
2.  **Gestor**: Hiring Manager. Can create, edit, close, and view metrics of Vacancies.
3.  **Coder**: Candidate. Can search vacancies, filter by seniority/tech, and apply (Max 3 active applications).

### 🤖 AI Integration
*   **Smart Chatbot**: Integrated OpenAI assistant that guides users on employability, CV tips, and interview preparation.
*   **Context Aware**: The bot understands the "Riwi" context and provides specific advice.

### 📊 Metrics & Dashboard
*   **Real-time Counters**: Efficient SQL aggregation to show applicant counts per vacancy.
*   **Dynamic Filters**: "Smart Search" across titles, technologies, and seniority levels.

---

## 🛠 Technology Stack

| Component | Technology | Version | Description |
|-----------|------------|---------|-------------|
| **Backend** | NestJS | 10.x | Modular Node.js Framework |
| **Database** | PostgreSQL | 15+ | Relational Database |
| **ORM** | TypeORM | 0.3.x | Data Mapper Pattern |
| **Frontend** | Vanilla JS | ES6+ | Lightweight Client |
| **Styling** | TailwindCSS | 3.x | Utility-first CSS |
| **Container** | Docker | 24.x | Containerization |
| **AI** | OpenAI API | GPT-3.5 | Chatbot Intelligence |

---

## ⚙️ Prerequisites
Ensure your environment meets these requirements:
*   **Docker Desktop** (Engine 20.10+)
*   **Node.js** v18.0.0 or higher
*   **Git**

---

## 🚀 Installation & Setup

### Method A: Docker (Recommended for Production/Review)
This method spins up the Backend, Database, and Seeders automatically.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/JuanVelezDev/Assesment.git
    cd Assesment
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)).

3.  **Launch Services**
    ```bash
    docker-compose up --build
    ```
    *Wait ~30 seconds for PostgreSQL to initialize.*

4.  **Access the Platform**
    *   **App**: [http://localhost:3000](http://localhost:3000)
    *   **Swagger**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Method B: Manual (Local Development)

1.  **Install Application**
    ```bash
    npm install
    ```

2.  **Database Connection**
    Ensure a local PostgreSQL instance is running and update `.env` `DB_HOST` to `localhost`.

3.  **Data Seeding**
    Initialize the database with default Administrative users:
    ```bash
    npx ts-node src/seed.ts
    ```

4.  **Run in Development Mode**
    ```bash
    npm run start:dev
    ```

---

## 🔐 Environment Variables
Create a `.env` file with the following configuration:

```ini
# --- Database Configuration ---
DB_HOST=db                # Use 'localhost' if running outside Docker
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret_password
DB_NAME=job_platform

# --- Security ---
JWT_SECRET=complex_secret_key_here
API_KEY=myapikey123       # For public endpoint protection

# --- External Services ---
OPENAI_API_KEY=sk-proj-... # Your OpenAI Key for Chatbot
PORT=3000
```

---

## 🧪 Testing Strategy

### Backend Unit Tests
We use **Jest** to validate service logic and controller integrity.
```bash
# Execute all test suites
npm run test

# Generate Coverage Report
npm run test:cov
```
*Current Coverage Target: >70% Statements*

### Manual Frontend Verification
Since the frontend relies on static interactions, verify the following flows:
1.  **Login**: Authenticate as `coder@riwi.io` (Pass: `password123`).
2.  **Search**: Type "Senior" in the search bar. Verify listing updates.
3.  **Chatbot**: Click the floating bubble and ask "Tips para mi CV".
4.  **Application**: Click "Postularme" on a vacancy. Verify the button changes state.

---

## � API Documentation

### Interactive Docs (Swagger)
Visit `/api/docs` for the interactive playground.

### Core Endpoints

#### Authentication
*   `POST /auth/login` - Authenticate User
*   `POST /auth/register` - Register new Coder

#### Vacancies
*   `GET /vacancies?search=Java&seniority=Senior` - Filtered list
*   `POST /vacancies` - Create (Gestor only)
*   `PATCH /vacancies/:id` - Edit/Close (Gestor only)

#### Applications
*   `POST /applications` - Submit application
*   `GET /applications/my` - View User's history

---

## 🚢 Deployment
Comprehensive deployment guides are available in the `docs/` directory:

1.  **[Database Schema](docs/database_schema.md)**: Visual Entity Relationship Diagram.

---

## 🔧 Troubleshooting

**Q: Docker fails with "Port 3000 already in use".**
A: Kill the local Node process (`fuser -k 3000/tcp`) or change `PORT` in `.env`.

**Q: "Relation 'users' does not exist" error.**
A: Ensure `synchronize: true` is set in TypeORM config (dev mode) or run the seed script.

**Q: Chatbot returns "Error connecting to AI".**
A: Verify your `OPENAI_API_KEY` in `.env`.
