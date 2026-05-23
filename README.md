# Topmate Alternative - Mentor Matching Platform

A full-stack platform connecting mentees with mentors using AI-powered matching, 1:1 sessions, cohort courses, and community features.

## 🏗️ Architecture Overview

```
tpmatee/
├── backend/              # FastAPI services
├── web/                  # Next.js dashboard & creator profiles
├── mobile/               # React Native Expo app
├── infra/                # Docker, K8s, CI/CD configs
├── docs/                 # Architecture & API docs
└── scripts/              # Setup & deployment helpers
```

## 🚀 Quick Start

### Phase 1: MVP (Weeks 1-4)
- [ ] Auth (Clerk integration)
- [ ] Creator profiles
- [ ] 1:1 booking system
- [ ] Payment processing (Razorpay)
- [ ] Email notifications
- [ ] Basic dashboard

### Stack
- **Backend**: FastAPI + PostgreSQL + Redis
- **Frontend**: Next.js 14 + React
- **Mobile**: React Native + Expo
- **Infrastructure**: Docker + Kubernetes (EKS)
- **CI/CD**: GitHub Actions

## 📋 Environment Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Web
cd web
npm install

# Mobile
cd mobile
npm install
```

## 🔧 Development

```bash
# Start all services
docker-compose -f infra/docker-compose.dev.yml up

# Run migrations
cd backend && alembic upgrade head

# Start web dev server
cd web && npm run dev

# Start mobile
cd mobile && npx expo start
```

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Specification](./docs/API.md)
- [Database Schema](./docs/SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 📄 License

MIT

---

**Status**: Phase 1 - MVP Building 🔨
