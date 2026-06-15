# PlacementPrep Tracker 🚀

A comprehensive 60-day Data Structures & Algorithms (DSA) and Interview Preparation Tracker to help you stay consistent and ace your placements!

![PlacementPrep Tracker](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-green)
![Database](https://img.shields.io/badge/Database-MongoDB-darkgreen)

## 🌟 Features
- **Daily Tasks & Roadmap**: Keep track of your daily DSA topics, coding questions, and core subjects.
- **Progress Tracking**: Visual indicators and streaks to maintain your 60-day consistency.
- **Modern UI**: Beautiful, fully responsive interface with Dark & Light mode support.
- **Secure Authentication**: JWT-based login and registration system.

## 💻 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Python, FastAPI, Motor (Async MongoDB), Pydantic
- **Database**: MongoDB Atlas
- **Deployment Ready**: Render (Backend) and Vercel (Frontend)

## 🚀 Live Demo
Replace these links once you have your final URLs!
- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render URL]

## 🛠️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (3.10 or higher)
- A MongoDB cluster URL (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder with your credentials:
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=placementprep
SECRET_KEY=your_secure_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

Start the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`. You can view the automatic API docs at `http://localhost:8000/docs`.*

---

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the Node modules:
```bash
npm install
```

Create a `.env` file in the `frontend` folder to point to your local backend:
```env
VITE_API_URL=http://localhost:8000/api
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

## 🌍 Deployment

### Deploying the Backend on Render
1. Connect this repository to your Render account using a **Blueprint**.
2. Render will automatically read the `render.yaml` file in the root directory.
3. Supply the `MONGO_URI` and `SECRET_KEY` environment variables when prompted.
4. Copy your live backend URL.

### Deploying the Frontend on Vercel
1. Import this repository in Vercel.
2. Under "Root Directory", click Edit and select the `frontend` folder.
3. Add a new Environment Variable: `VITE_API_URL` and set it to your new Render backend URL (make sure to append `/api` at the end, e.g., `https://your-backend.onrender.com/api`).
4. Click **Deploy**.

*(Don't forget to go back to Render and set your `FRONTEND_URL` environment variable to your new Vercel link for CORS security!)*

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
