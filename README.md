# 🚀 Browser Secure Code Server

A production-grade, containerized development environment designed for maximum security, isolation, and administrative control.

## ✨ Features

### 🛡️ Security & Isolation
- **Docker-Based Sandboxing**: Every developer session runs in a dedicated, resource-limited Docker container.
- **Path Traversal Protection**: Backend-enforced path sanitization prevents access to host system files.
- **Controlled Command Runner**: An allow-list system that permits safe commands (`npm`, `node`, `python`) while blocking dangerous ones (`sudo`, `apt`, `rm`).
- **Data Exfiltration Prevention**: Restricted Monaco Editor interface with disabled context menus and copy/paste/download blocks.

### 🖥️ Premium Interface
- **Modern UI/UX**: High-end glassmorphism design with dark mode and vibrant accents.
- **Integrated Workspace**: A unified view featuring a File Tree, high-performance Code Editor, and a custom Terminal.
- **Real-time Status Bar**: Live monitoring of container health and secure connection status.

### 📊 Administrative Hub
- **User Management**: Role-based access control (RBAC) for Admins and Developers.
- **Real-time Monitoring**: Visual metrics for server load, memory usage, and active container counts.
- **Audit Logging**: Comprehensive activity logs capturing every file change and command execution.
- **Project Assignments**: Secure folder-to-user mapping to ensure developers only see their own work.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+, Tailwind CSS, Lucide Icons, Monaco Editor.
- **Backend**: NestJS (TypeScript), Passport JWT, Dockerode.
- **Database**: PostgreSQL (via Prisma ORM).
- **Infrastructure**: Docker Compose, Nginx (Reverse Proxy), SSL/TLS termination.

## 🚦 Quick Start

For detailed installation and deployment instructions, please refer to the **[SETUP.md](./SETUP.md)**.

1. **Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. **Environment**: `cp .env.example .env`
3. **Launch**: `docker-compose up --build`

---

Developed with a focus on security, performance, and developer experience.
