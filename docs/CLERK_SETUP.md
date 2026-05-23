# Setup Clerk Auth Integration

## 1. Get Clerk API Keys

1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your **Secret Key** and **Publishable Key**
4. Add to `.env`:
   ```
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
   CLERK_FRONTEND_API_URL=https://your-app.clerk.accounts.com
   ```

## 2. Configure Clerk Webhook

1. In Clerk Dashboard → Webhooks
2. Add webhook endpoint: `https://your-domain.com/api/v1/auth/clerk-webhook`
3. Subscribe to events:
   - `user.created`
   - `user.deleted`
   - `user.updated` (optional)

## 3. Frontend Integration (Next.js)

```typescript
// pages/_app.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}
```

## 4. Login/Signup Buttons

```typescript
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export function AuthButtons() {
  return (
    <>
      <SignInButton />
      <SignUpButton />
      <UserButton />
    </>
  )
}
```

## 5. Get JWT Token

After user logs in with Clerk:

```typescript
import { useAuth } from '@clerk/nextjs'

export function MyComponent() {
  const { getToken } = useAuth()
  
  const callAPI = async () => {
    const token = await getToken()
    
    const response = await fetch('/api/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    return response.json()
  }
}
```

## 6. API Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Sign up with Clerk
       ▼
┌─────────────────────────┐
│ Clerk Dashboard         │
│ (OAuth provider)        │
└──────┬──────────────────┘
       │
       │ 2. Emit user.created webhook
       ▼
┌─────────────────────────┐
│ Backend webhook handler │
│ /auth/clerk-webhook     │
└──────┬──────────────────┘
       │
       │ 3. Create user in DB
       ▼
┌─────────────────────────┐
│ PostgreSQL users table  │
└──────┬──────────────────┘
       │
       │ 4. Frontend calls /auth/login
       ▼
┌─────────────────────────┐
│ Backend /auth/login     │
│ Generate JWT token      │
└──────┬──────────────────┘
       │
       │ 5. Return JWT
       ▼
┌─────────────────────────┐
│ Frontend stores JWT     │
│ in localStorage         │
└──────┬──────────────────┘
       │
       │ 6. Use JWT for all API calls
       ▼
┌─────────────────────────┐
│ Protected API endpoints │
│ Verify JWT token        │
└─────────────────────────┘
```

## 7. Testing with cURL

```bash
# Signup
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "clerk_id": "user_test_123",
    "email": "test@example.com",
    "name": "Test User"
  }'

# Response:
# {
#   "user": {...},
#   "access_token": "eyJhbGciOiJIUzI1NiIs...",
#   "token_type": "bearer"
# }

# Use token to call protected endpoint
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## 8. Troubleshooting

### Token verification fails
- Check `CLERK_SECRET_KEY` is correct
- Ensure token hasn't expired (24 hours by default)
- Verify `ALGORITHM` is `HS256`

### User not found after signup
- Check Clerk webhook is configured correctly
- Verify webhook endpoint is publicly accessible
- Check webhook event is being sent

### CORS errors
- Add frontend domain to `ALLOWED_ORIGINS` in `.env`
- Ensure credentials are included in fetch requests

## Next Steps

✅ Auth implementation complete!

Now build:
- [ ] Creator profile endpoints
- [ ] Booking system
- [ ] Payment integration
- [ ] Frontend UI components
