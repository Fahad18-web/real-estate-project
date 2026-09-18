# 🏠 EstatePulse — Modern Real Estate Marketplace

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-6C63FF.svg)](https://react.dev/)
[![React](https://img.shields.io/badge/React-19.2-4ECDC4.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-RTK%20Query-764ABC.svg)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v26-339933.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![EstatePulse Hero Banner](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80)

A production-grade, SaaS-level Real Estate Marketplace web application engineered with the **MERN stack** (MongoDB, Express.js, React.js 19, Node.js), **Dual-Token JWT Authentication** (Access + Refresh Token rotation), and **Redux Toolkit + RTK Query** state management.

---

## 🌟 Key Features

- [x] **Dual-Token JWT Auth Pattern**: 15-minute access token in memory/headers + 7-day httpOnly refresh token with automatic 401 retry interceptor.
- [x] **Role-Based Access Control (RBAC)**: Distinct permissions for `user` (buyers/tenants), `agent` (certified brokers), and `admin`.
- [x] **Comprehensive Property Search & Multi-Filters**: Filter by city, sale/rent, property type (villa, apartment, house, commercial, plot), price range, bedrooms, bathrooms, and full-text keyword search with pagination.
- [x] **Interactive Maps**: React Leaflet integration pinpointing property coordinates with dark SaaS styling.
- [x] **Viewing Appointments Engine**: Buyers can schedule viewings for specific dates and time slots; agents can accept, complete, or decline.
- [x] **Property Ratings & Reviews**: Recalculates `avgRating` and `totalReviews` dynamically upon submission.
- [x] **Saved Favorites (Wishlist)**: Instant toggle synced across database and local Redux store.
- [x] **Image Uploads**: Multi-file image uploads handled via Multer and Cloudinary CDN.
- [x] **Dark-Mode First SaaS Aesthetic**: Styled with custom CSS variables, electric violet (`#6C63FF`) & teal (`#4ECDC4`), Inter & JetBrains Mono typography.
- [x] **Production Error Handling**: Unified `ApiError` and `ApiResponse` wrappers with express-validator and frontend Zod schemas.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v26+)
- **Framework:** Express.js (v5)
- **Database:** MongoDB Atlas / Local MongoDB via Mongoose ODM
- **Authentication:** JWT (Dual Token: Access + Refresh Token)
- **Security:** `helmet`, `cors`, `express-rate-limit`, `bcryptjs`, `express-validator`, `cookie-parser`
- **File Upload:** `multer` + `cloudinary`
- **Logger:** `morgan`

### Frontend
- **Framework:** React 19 + Vite
- **State Management:** Redux Toolkit + RTK Query
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4 + Custom Dark CSS Variables
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Notifications:** React Hot Toast
- **Maps:** Leaflet & React Leaflet

---

## 📁 Project Structure

```
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
- MongoDB Atlas account or local MongoDB instance running
- Cloudinary account (for image uploads)

### 2. Clone & Install
```bash
git clone https://github.com/your-username/real-estate-marketplace.git
cd real-estate-marketplace

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables Configuration

#### Backend (`backend/.env`):
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

#### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Running the Application

**Run Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Run Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📡 API Endpoints Documentation

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register new user or agent | Public |
| `POST` | `/login` | Authenticate & issue dual tokens | Public |
| `POST` | `/logout` | Invalidate refresh token cookie | Protected |
| `POST` | `/refresh-token` | Rotate & refresh access token | Public (Cookie) |
| `GET` | `/me` | Get currently logged-in user profile | Protected |

### Properties (`/api/v1/properties`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List properties (filter, search, pagination) | Public |
| `GET` | `/:id` | Get single property with agent info | Public |
| `GET` | `/agent/listings` | Get properties created by authenticated agent | Agent / Admin |
| `POST` | `/` | Create listing with up to 6 images | Agent / Admin |
| `PUT` | `/users/profile` | Update name, phone, and avatar image | Protected |
| `PUT` | `/:id` | Update property listing | Agent (Owner) / Admin |
| `DELETE` | `/:id` | Remove property listing | Agent (Owner) / Admin |

### Viewing Bookings (`/api/v1/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Book property viewing appointment | Protected (User) |
| `GET` | `/my-bookings` | Retrieve user appointments or agent requests | Protected |
| `GET` | `/:id` | Get booking details | Protected |
| `PUT` | `/:id/status` | Update booking status (`confirmed`, `completed`, `cancelled`) | Agent / Admin |
| `DELETE` | `/:id` | Cancel viewing appointment | Protected (Owner) |

### Reviews (`/api/v1/reviews`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/property/:propertyId` | Get all reviews for a property | Public |
| `POST` | `/property/:propertyId` | Submit 1-5 star review | Protected |
| `PUT` | `/:id` | Edit own review | Protected (Owner) |
| `DELETE` | `/:id` | Remove own review | Protected (Owner / Admin) |

### User Profile & Saved Properties (`/api/v1/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/profile` | Get current user profile | Protected |
| `PUT` | `/profile` | Update profile details | Protected |
| `DELETE` | `/profile` | Delete account | Protected |
| `GET` | `/saved-properties` | Get user saved wishlist | Protected |
| `POST` | `/saved-properties/:propertyId` | Add property to saved favorites | Protected |
| `DELETE` | `/saved-properties/:propertyId` | Remove property from saved favorites | Protected |

---

## 🚢 Deployment Guide

### Deploy Backend to Render
1. Create a **New Web Service** on Render.
2. Link your repository and set Root Directory to `backend`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables from your `backend/.env` file.

### Deploy Frontend to Vercel
1. Import repository to Vercel and select Root Directory as `frontend`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set `VITE_API_BASE_URL` to your live Render backend URL (e.g. `https://your-api.onrender.com/api/v1`).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
#   r e a l - e s t a t e - p r o j e c t  
 