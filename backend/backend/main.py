import os
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client

from models import AmortEntry, BusinessProfile

# Loading env vars
load_dotenv()

# Creating new web app instance
app = FastAPI()

# Supabase setup
url = os.getenv("VITE_SUPABASE_URL")
anon_key = os.getenv("VITE_SUPABASE_KEY")
supabase: Client = create_client(url, anon_key)

# Allows communication React <---> FastApi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read Amort List
@app.get("/amort/amort-calc")
async def get_all():
    results = (supabase.table('amort').select('*').execute())
    return results.data

# Create Amort
@app.post("/amort/amort-calc")
async def create_amort(entry: AmortEntry):
    result = supabase.table("amort").insert(entry.model_dump(exclude={"amort_id", "created_at"})).execute()
    return result.data[0]

# Update Amort
@app.put("/amort/amort-calc/{amort_id}")
async def update_amort(amort_id: int, entry: AmortEntry):
    result = supabase.table("amort").update(entry.model_dump(exclude={"amort_id", "created_at"})).eq("amort_id", amort_id).execute()
    return result.data[0]

# Delete Amort
@app.delete("/amort/amort-calc/{amort_id}")
async def delete_amort(amort_id: int):
    supabase.table("amort").delete().eq("amort_id", amort_id).execute()
    return {"message": f"Amort #{amort_id} Successfully Deleted"}


