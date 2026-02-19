# 🏠 Homelab Dashboard

A modern, self-hosted dashboard for managing your homelab applications and monitoring system resources in real-time.

![Homelab Dashboard](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## Dashboard Preview
<img width="1907" height="970" alt="image" src="https://github.com/user-attachments/assets/cc600c7f-8bf1-44b8-8af4-e4269f8e2e66" />


---

## ✨ Features

- 📊 **Real-time System Metrics** - Monitor CPU, Memory, and Disk usage with live updates
- 🏷️ **Application Management** - Full CRUD operations for your self-hosted services
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations powered by Framer Motion
- 🐳 **Docker Ready** - One-command deployment with Docker Compose
- 💾 **SQLite Database** - Lightweight, file-based storage for application data
- ⚡ **Fast & Lightweight** - Built with Vite for optimized builds and quick loading

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Go 1.21+** | API Server |
| **Gorilla Mux** | HTTP Routing |
| **SQLite** | Database |
| **gopsutil** | System Metrics |

### Deployment
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Orchestration |
| **Nginx** | Frontend Serving |

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (Recommended)
- OR for local development:
  - Node.js 18+
  - Go 1.21+

### Docker Deployment (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/homelab-dashboard.git
cd homelab-dashboard
```

2. **Start the application:**
```bash
docker-compose up -d
```

3. **Access the dashboard:**
- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:8080

### Local Development

#### Backend Setup

```bash
cd backend

# Download dependencies
go mod download

# Run the server
go run cmd/main.go
```

The API will be available at `http://localhost:8080`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 📖 Usage

### Managing Applications

1. **Add a new application:** Click the "+" button and fill in the details (name, URL, description, optional icon)
2. **Edit an application:** Click on any app card to modify its details
3. **Delete an application:** Use the delete button on any app card (with confirmation)
4. **Access applications:** Click on any app card to open the service in a new tab

### Monitoring System Resources

The dashboard displays real-time metrics in the header/sidebar:
- **CPU Usage** - Overall processor utilization
- **Memory Usage** - RAM consumption (used/total)
- **Storage Usage** - Disk space utilization

Metrics refresh automatically every 5 seconds.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Backend server port |
| `DATABASE_PATH` | `data/homelab.db` | SQLite database file path |
| `METRICS_INTERVAL` | `5` | Metrics collection interval (seconds) |
| `MOUNT_POINT` | `/` (or `C:\` on Windows) | Disk mount point for metrics |

### Docker Compose Configuration

Edit [`docker-compose.yml`](./docker-compose.yml) to customize:
- Port mappings
- Volume locations
- Environment variables

> **💡 Tip:** For host-level metrics on Linux, uncomment the `pid: host` section in `docker-compose.yml`

---

## 🔌 API Endpoints

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/apps` | List all applications |
| `GET` | `/api/apps/{id}` | Get a single application |
| `POST` | `/api/apps` | Create a new application |
| `PUT` | `/api/apps/{id}` | Update an application |
| `DELETE` | `/api/apps/{id}` | Delete an application |

### Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/metrics` | Get current system metrics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |

---

## 📦 Application Data Model

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "url": "https://example.com",
  "icon": "https://example.com/icon.png",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## 📁 Project Structure

```
homelab-dashboard/
├── backend/
│   ├── cmd/
│   │   └── main.go          # Application entry point
│   ├── internal/
│   │   ├── database/        # SQLite database layer
│   │   ├── handlers/        # HTTP request handlers
│   │   ├── metrics/         # System metrics collector
│   │   └── models/          # Data models
│   ├── go.mod
│   └── go.sum
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── docker-compose.yml
├── prd.md
└── README.md
```

---

## 🛠️ Development

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
go build -o main cmd/main.go
```

### Running Tests

**Backend:**
```bash
cd backend
go test ./...
```

**Frontend:**
```bash
cd frontend
npm test
```

---

## 🔍 Troubleshooting

### Backend won't start
- ✅ Ensure Go 1.21+ is installed
- ✅ Run `go mod download` to fetch dependencies
- ✅ Check if port 8080 is available

### Frontend won't start
- ✅ Ensure Node.js 18+ is installed
- ✅ Run `npm install` to install dependencies
- ✅ Check if port 3000 is available

### Docker issues
- ✅ Ensure Docker and Docker Compose are installed
- ✅ Run `docker-compose down` and `docker-compose up -d` to restart
- ✅ Check logs with `docker-compose logs -f`

### Metrics not showing
- On Linux, the container may need additional permissions to access host metrics
- Uncomment the `pid: host` section in `docker-compose.yml` for host-level metrics

---

## 📸 Screenshots

Check out the [`screenshoot-web/`](./screenshoot-web/) directory for dashboard screenshots.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - feel free to use and modify as needed.

---

## 🙏 Acknowledgments

- Built with ❤️ for the homelab community
- Inspired by the need for a simple, self-hosted dashboard

---

## 📬 Contact

For questions or support, please open an issue on the GitHub repository.

---

<div align="center">

**Made with [React](https://react.dev/) + [Go](https://go.dev/) + [Docker](https://www.docker.com/)**

⭐ Star this repo if you find it helpful!

</div>
