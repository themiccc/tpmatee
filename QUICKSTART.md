# Getting Started - Quick Reference

## 1️⃣ Initial Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/themiccc/tpmatee.git
cd tpmatee

# Setup Python environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup Node environments
cd ../web
npm install

cd ../mobile
npm install
```

## 2️⃣ Environment Configuration (5 minutes)

```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your values:
# - CLERK_SECRET_KEY (get from clerk.com)
# - RAZORPAY_KEY_ID & SECRET (get from razorpay.com)
# - STRIPE_SECRET_KEY (get from stripe.com)
# - SENDGRID_API_KEY (get from sendgrid.com)
# - DATABASE_URL (PostgreSQL connection)
```

## 3️⃣ Start Development Environment (1 command)

```bash
# From project root
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh

# This will:
# ✅ Start PostgreSQL in Docker
# ✅ Start Redis in Docker
# ✅ Run database migrations
# ✅ Start FastAPI backend
# ✅ Show all service URLs
```

## 4️⃣ Access Services

```
🔗 API Backend:     http://localhost:8000
📚 API Docs:        http://localhost:8000/docs
🌐 Web App:         http://localhost:3000
📱 Mobile:          npx expo start (from mobile folder)
💾 Database:        localhost:5432 (postgres:tpmatee)
⚡ Redis Cache:     localhost:6379
```

## 5️⃣ Test Auth Flow

```bash
# Signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "clerk_id": "user_123",
    "email": "test@example.com",
    "name": "Test User"
  }'

# Response: {"user": {...}, "access_token": "eyJhbGc..."}

# Use token for protected endpoints
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGc..."
```

## 6️⃣ Test Booking Flow

```bash
# 1. Create availability slot
curl -X POST http://localhost:8000/api/v1/bookings/slots \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start_time": "2026-06-01T10:00:00",
    "end_time": "2026-06-01T11:00:00"
  }'

# 2. Get available slots
curl http://localhost:8000/api/v1/bookings/slots/available/1

# 3. Create booking
curl -X POST http://localhost:8000/api/v1/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "creator_id": 1,
    "slot_id": 1,
    "service_id": 1
  }'
```

## 7️⃣ Test Payment Flow

```bash
# Initiate payment
curl -X POST http://localhost:8000/api/v1/payments/initiate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "gateway": "razorpay"
  }'

# Response: {"order_id": "order_xxx", "amount": 50000, ...}

# In browser: Use Razorpay test credentials
# Card: 4111111111111111 (test card)
# CVV: Any 3 digits
# Expiry: Any future date
```

## 8️⃣ Run Tests

```bash
# Backend tests
cd backend
pytest tests/

# Frontend linting
cd web
npm run lint
npm run type-check

# Mobile linting
cd mobile
npm run lint
```

## 9️⃣ Stop Services

```bash
# Stop all Docker services
docker-compose -f infra/docker-compose.dev.yml down

# Stop specific services
docker stop tpmatee-backend
docker stop postgres
docker stop redis
```

## 🔟 Deploy to Production

```bash
# Setup AWS EKS (one-time)
exksctl create cluster --name tpmatee-prod --region ap-south-1

# Deploy
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh

# Check deployment
kubectl get pods
kubectl logs -f deployment/tpmatee-backend
```

---

## 🚨 Troubleshooting

### Port already in use
```bash
# Change ports in docker-compose.dev.yml or:
lsof -i :8000  # Find what's using port 8000
kill -9 PID    # Kill the process
```

### Database connection failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string in .env
echo $DATABASE_URL

# Test connection
psql postgresql://tpmatee:tpmatee_dev_password@localhost:5432/tpmatee
```

### Frontend not loading
```bash
# Clear cache
rm -rf web/.next

# Reinstall
cd web && npm install && npm run dev
```

### Tests failing
```bash
# Run with verbose output
pytest tests/ -v

# Run specific test
pytest tests/test_auth.py::test_signup_success -v
```

---

## 📚 Documentation Links

- [Architecture](./docs/ARCHITECTURE.md) - System design
- [API Docs](./docs/API.md) - Endpoint specifications
- [Database Schema](./docs/SCHEMA.md) - Data model
- [Clerk Setup](./docs/CLERK_SETUP.md) - Auth integration
- [Deployment](./docs/DEPLOYMENT.md) - Production setup
- [Contributing](./CONTRIBUTING.md) - Development guide
- [Roadmap](./ROADMAP.md) - Feature roadmap

---

## 💡 Pro Tips

1. **Use API Docs** - Go to http://localhost:8000/docs for interactive API testing
2. **Check Logs** - Always check service logs for errors: `docker-compose logs -f backend`
3. **Database Inspection** - Use pgAdmin or `psql` to inspect database
4. **Caching Issues** - If tests fail, clear Redis: `redis-cli FLUSHALL`
5. **Environment Variables** - Always copy `.env.example` first, never commit `.env`

---

**You're all set! Start developing! 🚀**
