# 🏠 EstatePulse — Modern Real Estate Marketplace

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-6C63FF.svg)](https://react.dev/)
[![React](https://img.shields.io/badge/React-19.2-4ECDC4.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-RTK%20Query-764ABC.svg)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v26-339933.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![EstatePulse Hero Banner](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80)

A production-grade, SaaS-level real estate marketplace web application engineered with the **MERN stack** (MongoDB, Express.js, React.js 19, and Node.js), with **dual-token JWT authentication** using access and refresh tokens.

---

## 🌟 Key Features

- [x] **Dual-Token JWT Auth Pattern:** 15-minute access token in memory/headers and a 7-day `httpOnly` refresh token with automatic 401 retry interception.
- [x] **Role-Based Access Control (RBAC):** Distinct permissions for `user` (buyers/tenants), `agent` (certified brokers), and `admin`.
- [x] **Comprehensive Property Search and Multi-Filters:** Filter by city, sale/rent, property type (villa, apartment, house, commercial, or plot), price range, bedrooms, bathrooms, and full-text keywords.
- [x] **Interactive Maps:** React Leaflet integration pinpoints property coordinates with dark SaaS styling.
- [x] **Viewing Appointments Engine:** Buyers can schedule viewings for specific dates and time slots; agents can accept, complete, or decline appointments.
- [x] **Property Ratings and Reviews:** Recalculates `avgRating` and `totalReviews` dynamically after submissions.
- [x] **Saved Favorites (Wishlist):** Instant toggling synced across the database and local Redux store.
- [x] **Image Uploads:** Multi-file image uploads handled by Multer and Cloudinary CDN.
- [x] **Dark-Mode-First SaaS Aesthetic:** Custom CSS variables, electric violet (`#6C63FF`), teal (`#4ECDC4`), Inter, and JetBrains Mono typography.
- [x] **Production Error Handling:** Unified `ApiError` and `ApiResponse` wrappers with `express-validator` and frontend Zod schemas.

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js (v26+)
- **Framework:** Express.js (v5)
- **Database:** MongoDB Atlas or local MongoDB via Mongoose ODM
- **Authentication:** JWT with access and refresh tokens
- **Security:** `helmet`, `cors`, `express-rate-limit`, `bcryptjs`, `express-validator`, and `cookie-parser`
- **File Upload:** `multer` and `cloudinary`
- **Logger:** `morgan`

### Frontend

- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit + RTK Query
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4 + custom dark CSS variables
- **Icons:** Lucide React
- **Forms and Validation:** React Hook Form + Zod
- **Notifications:** React Hot Toast
- **Maps:** Leaflet + React Leaflet

---

## 📁 Project Structure

```text
real-estate-project/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── property.controller.js
│   │   ├── booking.controller.js
│   │   └── review.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Property.model.js
│   │   ├── Booking.model.js
│   │   ├── Review.model.js
│   │   └── SavedProperty.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── property.routes.js
│   │   ├── booking.routes.js
│   │   └── review.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── generateToken.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/store.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── property/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── properties/
│   │   │   ├── bookings/
│   │   │   └── reviews/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Local Setup Instructions

### 1. Prerequisites

- Node.js installed (v18+)
- MongoDB Atlas account or a local MongoDB instance
- Cloudinary account for image uploads

### 2. Clone and Install

```bash
git clone https://github.com/Fahad18-web/real-estate-project.git
cd real-estate-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories using the examples below.

#### Backend: `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/real_estate_marketplace?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret_key_32_chars
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret_key_32_chars
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Run the Application

**Run the backend:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Run the frontend:**

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📡 API Endpoints Documentation

### Authentication: `/api/v1/auth`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/register` | Register a new user or agent | Public |
| `POST` | `/login` | Authenticate and issue dual tokens | Public |
| `POST` | `/logout` | Invalidate the refresh-token cookie | Protected |
| `POST` | `/refresh-token` | Rotate and refresh the access token | Public (cookie) |
| `GET` | `/me` | Get the currently logged-in user's profile | Protected |

### Properties: `/api/v1/properties`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/` | List properties with filters, search, and pagination | Public |
| `GET` | `/:id` | Get a single property with agent information | Public |
| `GET` | `/agent/listings` | Get properties created by the authenticated agent | Agent / Admin |
| `POST` | `/` | Create a listing with up to six images | Agent / Admin |
| `PUT` | `/users/profile` | Update name, phone, and avatar image | Protected |
| `PUT` | `/:id` | Update a property listing | Agent (Owner) / Admin |
| `DELETE` | `/:id` | Remove a property listing | Agent (Owner) / Admin |

### Viewing Bookings: `/api/v1/bookings`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/` | Book a property viewing appointment | Protected (User) |
| `GET` | `/my-bookings` | Retrieve user appointments or agent requests | Protected |
| `GET` | `/:id` | Get booking details | Protected |
| `PUT` | `/:id/status` | Update booking status (`confirmed`, `completed`, or `cancelled`) | Agent / Admin |
| `DELETE` | `/:id` | Cancel a viewing appointment | Protected (Owner) |

### Reviews: `/api/v1/reviews`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/property/:propertyId` | Get all reviews for a property | Public |
| `POST` | `/property/:propertyId` | Submit a 1–5-star review | Protected |
| `PUT` | `/:id` | Edit your own review | Protected (Owner) |
| `DELETE` | `/:id` | Remove your own review | Protected (Owner / Admin) |

### User Profile and Saved Properties: `/api/v1/users`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/profile` | Get the current user's profile | Protected |
| `PUT` | `/profile` | Update profile details | Protected |
| `DELETE` | `/profile` | Delete the account | Protected |
| `GET` | `/saved-properties` | Get the user's saved wishlist | Protected |
| `POST` | `/saved-properties/:propertyId` | Add a property to saved favorites | Protected |
| `DELETE` | `/saved-properties/:propertyId` | Remove a property from saved favorites | Protected |

---

## 🚢 Deployment Guide

### Deploy the Backend to Render

1. Create a **New Web Service** on Render.
2. Link this repository and set the Root Directory to `backend`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Add the environment variables from `backend/.env`.

### Deploy the Frontend to Vercel

1. Import this repository into Vercel and set the Root Directory to `frontend`.
2. Select **Vite** as the Framework Preset.
3. Set the Build Command to `npm run build`.
4. Set the Output Directory to `dist`.
5. Set `VITE_API_BASE_URL` to the live Render backend URL, such as `https://your-api.onrender.com/api/v1`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
