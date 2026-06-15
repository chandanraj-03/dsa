from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    uri = settings.MONGO_URI or settings.MONGODB_URI
    client = AsyncIOMotorClient(uri)
    db = client[settings.DB_NAME]
    print(f"Connected to MongoDB at {uri}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_database():
    return db
