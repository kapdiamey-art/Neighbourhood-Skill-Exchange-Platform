# 🏘️ Neighbourhood Skill Exchange & Community Help Platform

A full-stack, peer-to-peer community platform designed for neighbors to share skills, request assistance, and build community trust. Built with a modern **React + Vite** frontend, a high-performance **FastAPI** backend, and a relational **MySQL** database with **SQLAlchemy ORM**.

---

## ✨ Features

- 👤 **User Authentication & Profile**: Register with your neighborhood, profession, availability, and skills (e.g., *Python, Plumbing, Cooking, Gardening*).
- 🚨 **Community Help Requests**: Post urgent or regular help requests specifying required skills, description, and urgency levels (*High, Medium, Low*).
- 🎯 **Intelligent Skill Matching**: Automatically highlights open community requests matching your profile skills with a `🎯 Matches Your Skill!` badge.
- 🤝 **Interactive Request Lifecycle**:
  - `Open`: Broadcasted to neighbors in your area.
  - `In Progress`: When a neighbor clicks **Offer Help**, status updates in real-time in MySQL and locks for the helper.
  - `Completed`: Requester marks the task complete upon fulfillment.
- 📩 **Contact Information Exchange**: Automatically reveals helper & requester email addresses once an offer is accepted so users can coordinate directly.
- 📊 **Interactive My Requests Dashboard**: Requester dashboard to track status updates and close out completed requests.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`)
- **Styling**: Modern CSS3 Design System with Glassmorphism & Micro-animations
- **API Client**: Native `fetch` wrapper ([`src/api/api.js`](frontend/src/api/api.js))

### Backend
- **Framework**: FastAPI (Python 3.14)
- **ORM**: SQLAlchemy ORM
- **Driver**: PyMySQL (Pure Python MySQL driver)
- **Password Hashing**: `bcrypt`
- **Validation**: Pydantic v2 schemas

### Database
- **Database Engine**: MySQL Relational Database (MySQL Workbench for local dev)
- **Database Name**: `community_help`
- **Tables**: `users`, `help_requests`

---

## 📁 Project Structure

```text
community-help-platform/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── connection.py       # SQLAlchemy engine & MySQL connection
│   │   ├── models/
│   │   │   ├── user.py             # User SQLAlchemy model
│   │   │   └── request.py          # HelpRequest SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── user.py             # Pydantic input/output schemas for Users
│   │   │   └── request.py          # Pydantic schemas for Help Requests
│   │   ├── routers/
│   │   │   ├── auth.py             # Login & Registration endpoints
│   │   │   ├── users.py            # User list & detail endpoints
│   │   │   └── requests.py         # Help Request CRUD & status update endpoints
│   │   └── main.py                 # FastAPI app entry point & CORS configuration
│   ├── .env                        # Local MySQL environment variables (git-ignored)
│   ├── .env.example                # Sample environment configuration
│   └── requirements.txt            # Python backend dependencies
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js              # Centralized API service connecting to backend
    │   ├── components/
    │   │   ├── Navbar.jsx          # Header navigation with auth state
    │   │   └── UserCard.jsx        # Community member profile card
    │   ├── context/
    │   │   └── AuthContext.jsx     # User authentication state provider
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Home feed (Open requests & skilled people)
    │   │   ├── FindHelp.jsx        # Searchable requests & community search
    │   │   ├── CreateRequest.jsx   # Form to submit a new help request
    │   │   ├── MyRequests.jsx      # Requester dashboard & status completion
    │   │   ├── Login.jsx           # User login page
    │   │   ├── Register.jsx        # User signup page
    │   │   └── Profile.jsx         # User profile page
    │   ├── App.jsx                 # Main application routes wrapper
    │   └── main.jsx                # React app entry point
    └── package.json
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MySQL Server** & **MySQL Workbench** running locally on port `3306`

---

### 2. Backend Setup & Run

1. Open PowerShell and navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Configure your local `.env` file inside `backend/`:
   ```env
   MYSQL_USER=root
   MYSQL_PASSWORD=YourMySQLPassword
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=community_help
   ```

4. Start the FastAPI backend server:
   ```powershell
   python -m uvicorn app.main:app --reload
   ```
   * The backend will start at `http://localhost:8000`
   * Interactive API documentation is available at `http://localhost:8000/docs`
   * *Note: `Base.metadata.create_all()` will automatically create the `community_help` database and required tables upon startup!*

---

### 3. Frontend Setup & Run

1. Open a new PowerShell terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install Node dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   * The web application will start at `http://localhost:5173`

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/db-test` | Database connection test |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user & start session |
| `GET` | `/api/users/` | Get all registered community members |
| `GET` | `/api/users/{id}` | Get specific user profile |
| `GET` | `/api/requests/` | List all open community help requests |
| `GET` | `/api/requests/mine?user_id=X` | List requests posted by a specific user |
| `POST` | `/api/requests/` | Submit a new help request |
| `PATCH` | `/api/requests/{id}/status` | Update request status (`In Progress` / `Completed`) & set `helper_id` |

---

## 🌐 Production Deployment Guide

To deploy this project to the web:

1. **Database**: Host MySQL on a cloud provider like **[Aiven.io](https://aiven.io)** or **[Railway.app](https://railway.app)**.
2. **Backend**: Deploy `backend/` to **[Render.com](https://render.com)** as a Web Service. Set Environment Variables to match your cloud MySQL credentials.
3. **Frontend**: Deploy `frontend/` to **[Vercel.com](https://vercel.com)**. In `src/api/api.js`, update `BASE_URL` to point to your live Render backend URL (`https://your-api.onrender.com`).
