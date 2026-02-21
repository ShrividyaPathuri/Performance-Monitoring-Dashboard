# Performance Monitoring Dashboard

Full-Stack Observability Simulation  
React + Node.js Backend | REST APIs | CI/CD

---

## Overview

The Performance Monitoring Dashboard is a full-stack observability simulation that ingests logs and system metrics through REST APIs, evaluates alert rules, and visualizes system behavior in real time.

This project demonstrates backend API design, alert rule evaluation, frontend visualization, and CI/CD automation.

---

## Architecture

### Frontend
- React (Vite)
- Chart.js for metric visualization
- Real-time dashboard updates
- Displays recent logs and active alerts

### Backend
- Node.js + Express
- REST API endpoints
- In-memory datastore (JSON-based)
- Alert rule engine:
  - Error spike detection
  - CPU threshold monitoring

---

## Features

- Log ingestion API
- Metric ingestion API
- Alert generation (CPU threshold, error spikes)
- Dashboard visualization
- Modular backend structure
- GitHub Actions CI
- Docker-ready configuration

---

## Project Structure


performance-monitoring-dashboard/
│
├── backend/
│ ├── src/
│ ├── test/
│ └── package.json
│
├── frontend/
│ ├── src/
│ └── package.json
│
├── docker-compose.yml
└── .github/workflows/ci.yml


---

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev

Backend runs on:

http://localhost:5050
Frontend
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
Sample API Usage
Ingest Metric

Windows (PowerShell):

curl -X POST http://localhost:5050/api/ingest/metric ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"cpu\",\"value\":92}"

Mac/Linux:

curl -X POST http://localhost:5050/api/ingest/metric \
  -H "Content-Type: application/json" \
  -d '{"name":"cpu","value":92}'
Ingest Log

Windows (PowerShell):

curl -X POST http://localhost:5050/api/ingest/log ^
  -H "Content-Type: application/json" ^
  -d "{\"level\":\"ERROR\",\"service\":\"api\",\"message\":\"Timeout while calling downstream\"}"

Mac/Linux:

curl -X POST http://localhost:5050/api/ingest/log \
  -H "Content-Type: application/json" \
  -d '{"level":"ERROR","service":"api","message":"Timeout while calling downstream"}'
Testing

Backend:

cd backend
npm test

Frontend:

cd frontend
npm test
