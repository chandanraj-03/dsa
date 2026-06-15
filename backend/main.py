from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, get_database
from routers import auth, tasks, progress, revisions, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown lifecycle events."""
    # Startup
    await connect_to_mongo()
    
    # Create database indexes for performance
    db = get_database()
    if db is not None:
        await db.progress.create_index([("user_id", 1), ("task_id", 1)], unique=True)
        await db.progress.create_index([("user_id", 1), ("completed", 1)])
        await db.tasks.create_index([("day", 1)])
        await db.users.create_index([("email", 1)], unique=True)
        print("Database indexes created")
    
    yield
    
    # Shutdown
    await close_mongo_connection()


app = FastAPI(title="PlacementPrep Tracker API", lifespan=lifespan)

import os

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(revisions.router, prefix="/api/revisions", tags=["revisions"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to PlacementPrep Tracker API"}
