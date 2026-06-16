# Auth Demo App

## Run locally

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and fill in:

- `MONGO_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `JWT_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Then start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example` and keep:

- `VITE_API_BASE_URL=http://localhost:5000/api`

Then start the app:

```bash
npm run dev
```

## Notes

- If login says `Please verify your email first`, open `/verify-register-otp` and submit the OTP from the registration email.
- Gmail SMTP requires a Google App Password, not your normal Gmail password.
- The frontend now falls back to `http://localhost:5000/api` if `VITE_API_BASE_URL` is missing.
