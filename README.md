# TradeBoard — Mini Service Request Board

A full-stack job board for local trade service requests. Anyone can browse and view jobs without an account. Creating, updating, and deleting jobs requires login.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Project structure

```
├── Backend/   # Express API (MongoDB, JWT auth)
└── Frontend/  # Next.js web app
```

## Environment variables

### Backend (`Backend/.env`)

Create `Backend/.env` from the example below:

```env
MONGODB_URI=mongodb://localhost:27017/tradeboard
PORT=5000
JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=7d
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | API server port (default: `5000`) |
| `JWT_SECRET` | Secret used to sign JWT tokens — use a long random value in production |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`, `24h`) |

### Frontend (`Frontend/.env.local`)

Create `Frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (must include `/api`) |

## Setup

1. **Clone the repository** and open the project root.

2. **Backend**

   ```bash
   cd Backend
   npm install
   ```

   Add `Backend/.env` with the variables above.

3. **Frontend**

   ```bash
   cd Frontend
   npm install
   ```

   Add `Frontend/.env.local` with `NEXT_PUBLIC_API_URL` pointing at your API.

4. **(Optional) Seed sample jobs**

   With MongoDB running and `MONGODB_URI` set:

   ```bash
   cd Backend
   npm run seed
   ```

## Run instructions

Start MongoDB, then run the API and the web app in separate terminals.

### Backend

```bash
cd Backend
npm run dev
```

The API listens on `http://localhost:5000` (or the port set in `PORT`).

Production:

```bash
cd Backend
npm start
```

### Frontend

```bash
cd Frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:

```bash
cd Frontend
npm run build
npm start
```

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/jobs` | No | List jobs (filters: `category`, `status`, `search`; pagination: `page`, `limit` default 5) |
| `GET` | `/api/jobs/:id` | No | Job details |
| `POST` | `/api/jobs` | Yes | Create a job |
| `PATCH` | `/api/jobs/:id` | Yes | Update job status |
| `DELETE` | `/api/jobs/:id` | Yes | Delete a job |
| `POST` | `/api/auth/register` | No | Register |
| `POST` | `/api/auth/login` | No | Login |
| `GET` | `/api/auth/me` | Yes | Current user |

Send the JWT from login/register as `Authorization: Bearer <token>` for protected routes.
