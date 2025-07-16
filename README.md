# RAFIQ | ERP System for Employee Tracking  - Backend

This repository contains the backend service for an RAFI is an ERP-based Employee Tracking System. The system is designed to help managers assign and monitor tasks, track employee locations in real-time, and evaluate performance using KPIs. Built with NestJS and PostgreSQL, it incorporates modern backend practices such as asynchronous queues, WebSockets, and caching.

## Features

- **Task Management**: Assign tasks to employees and monitor their progress.
- **Live Location Tracking**: Real-time GPS updates via WebSocket or HTTP.
- **KPI Engine**: Automatically calculates delivery performance metrics.
- **Asynchronous Processing**: RabbitMQ queue integration for scalable location updates and task events.
- **Caching**: Reduces database load using Memcached.
- **Role-Based Access**: Differentiated access for managers and employees.
- **Clean Architecture**: Modular codebase with clear domain separation.

## Architecture
<img width="812" height="571" alt="Screenshot 2025-06-09 223357" src="https://github.com/user-attachments/assets/fadefb1f-e87e-49fd-859d-15fa1ee081ed" />


## Tech Stack

| Category        | Technology        | Description                                               |
|----------------|-------------------|-----------------------------------------------------------|
| Backend        | NestJS            | Scalable Node.js framework with TypeScript support       |
| Database       | PostgreSQL        | Relational database with TypeORM ORM                     |
| Messaging Queue| RabbitMQ          | Queue system for background processing                   |
| Realtime       | WebSocket         | Location streaming and live updates                      |
| Caching        | Memcached         | Improves performance by reducing DB reads                |


## Core Workflow

### 1️⃣ Authentication & Authorization

- Users (Admins, Managers, Employees) log in via secured API endpoints.
- Authentication uses **JWT (JSON Web Tokens)**.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system access.
  - **Manager**: Assign and monitor tasks.
  - **Employee**: View and update their tasks.

---

### 2️⃣ Task Assignment

- Admins and Managers assign tasks via the dashboard.
- Tasks are stored in **PostgreSQL**.
- Tasks can be pushed to Employee mobile apps through notifications or API calls.

---

### 3️⃣ Real-Time Tracking

- Employees' mobile devices send periodic location updates:
  - Via **WebSockets** or background services.
- Backend processes updates:
  - **Caches** them in **Memcached** for fast dashboard rendering.
  - Sends updates to **RabbitMQ** for:
    - Notifications
    - Further processing
    - System integrations

---

### 4️⃣ Task Updates & KPI Calculation

- When an Employee completes a task:
  - System calculates KPIs:
    - **Completion Rate**
    - **Delivery Time**
    - **Distance Traveled**
  - KPI data is stored and associated with the Employee's record.

---

<img width="1415" height="724" alt="Picture4" src="https://github.com/user-attachments/assets/a2dbcaab-ba2d-432a-bc0c-05f7ec204a83" />


