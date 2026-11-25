# CampusRide • University Bus Tracking & Seat Reservation System

CampusRide is a full-stack web application for university shuttle tracking, live telematics, and seat reservations, built strictly from the Google Stitch UI source of truth (`CampusRide Bus Tracking UI`).

---

## 🚌 Features & 5 Stitch Screens Implemented

1. **Web Login (`/login`)**:
   - Institutional split-panel layout with real-time transit status banner and campus imagery.
   - Demo account quick-fill buttons (`STU2026001` / `STU2026002`).
   - Secure PIN / password input with visibility toggle.
   - Single Sign-On (SSO) integration options and NIST compliance indicators.

2. **Web Dashboard (`/dashboard`)**:
   - Welcome banner personalized to student with active pass status.
   - Next scheduled departure priority card (Bus #12 North Express) with route corridor milestones and live arrival countdown.
   - Live corridor transit map with standard, satellite, and transit path layer toggles.
   - Fast return trip booking module, peak morning rush matrix, and 1-tap digital NFC pass preview.

3. **Live Bus Tracking (`/tracking`)**:
   - Responsive split layout featuring an active fleet tracker sidebar and full-screen campus map canvas.
   - Simulated GPS tracking with real-time bus movement, speed fluctuation (24-32 km/h), and dynamic ETA updates.
   - Real-time seat occupancy bar and driver profile (Michael Rodriguez) with functional call and message modal interactions.
   - Interactive campus map with route overlays, landmark stops, user pickup pin (North Gate Shelter), search bar, and map zoom controls.

4. **Seat Reservation (`/reserve`)**:
   - Realistic 2x2 bus architectural floorplan with 7 rows, operator cabin, emergency exits, and priority accessible seating.
   - Interactive seat selection with real-time occupancy updates and **duplicate-seat prevention** (rejects already-booked seats with HTTP 409).
   - Checkout card displaying student transit privilege ($2.50 free discount), boarding pass summary, and instant ticket generation.

5. **My Bookings (`/bookings`)**:
   - Digital boarding pass ticket with scannable vector QR code and live departure countdown timer.
   - Itinerary timeline with intermediate waypoints and boarding gate information.
   - One-click **cancellation workflow** that instantly frees the seat in the backend in real-time.
   - Upcoming reserved rides list and historical trip log with pass slip receipts.
   - University transit rider conduct and safety policies.

---

## 🔑 Demo Login Credentials

| Role | Student ID | Password | Name | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Demo** | `STU2026001` | `student123` | Alex Chen | Active • Valid Zone 1-4 |
| **Secondary Demo** | `STU2026002` | `student123` | Marcus Vance | Active • Valid Zone 1-4 |

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (configured with exact Stitch tokens), Lucide React, Google Material Symbols, Axios, React Router v6.
- **Backend**: Node.js, Express.js, TypeScript, tsx, CORS, dotenv.
- **Port Mapping**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5000`
  - Vite API proxy: `/api` -> `http://localhost:5000`

---

## 🚀 Getting Started

### 1. Installation
Install all dependencies for root, server, and client:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd server && npm install`, `cd client && npm install`)*

### 2. Development Mode
Run both frontend and backend concurrently with a single command from the project root:
```bash
npm run dev
```

The application will be accessible at:
- **Client App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Production Build & Start
```bash
# Build both client and server
npm run build

# Start production server
npm run start
```

---

## 📡 REST API Endpoints

- `POST /api/auth/login` - Authenticate student and obtain mock token
- `GET  /api/auth/me` - Get authenticated student profile
- `GET  /api/dashboard` - Get personalized dashboard metrics, next departure, and rush hour matrix
- `GET  /api/buses` - List all buses and capacity
- `GET  /api/buses/gps/live` - Stream simulated real-time GPS coordinates and progress
- `GET  /api/buses/:id` - Get specific bus and driver details
- `GET  /api/buses/:id/seats` - Get 2x2 seat map with live occupancy
- `GET  /api/bookings` - Get user's active booking, upcoming rides, and trip history
- `POST /api/bookings` - Book a seat (with duplicate prevention)
- `DELETE /api/bookings/:id` - Cancel booking and release seat back to available pool
