import os
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client

from models import AmortEntry, BusinessProfile

from auth import get_current_user

# Loading env vars
load_dotenv()

# Creating new web app instance
app = FastAPI()

# Supabase setup
url = os.getenv("SUPABASE_URL")
anon_key = os.getenv("SUPABASE_KEY")
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
async def get_all(user_id: str = Depends(get_current_user)):
    results = (supabase.table('amort').select('*').eq("user_id", user_id).execute())
    return results.data

# Create Amort
@app.post("/amort/amort-calc")
async def create_amort(entry: AmortEntry, user_id: str = Depends(get_current_user)):
    try:
        data = entry.model_dump(exclude={"amort_id", "created_at"})
        data["user_id"] = user_id
        result = supabase.table("amort").insert(data).execute()
        return result.data[0]
    except Exception as e:
        print("POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Update Amort
@app.put("/amort/amort-calc/{amort_id}")
async def update_amort(amort_id: int, entry: AmortEntry, user_id: str = Depends(get_current_user)) :
    try:
        data = entry.model_dump(exclude={"amort_id", "created_at", "user_id"})
        result = supabase.table("amort").update(data).eq("amort_id", amort_id).eq("user_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Entry not found or unauthorized")
        
        return result.data[0]
    except Exception as e:
        print("POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Delete Amort
@app.delete("/amort/amort-calc/{amort_id}")
async def delete_amort(amort_id: int, user_id: str = Depends(get_current_user)):
    supabase.table("amort").delete().eq("amort_id", amort_id).eq("user_id", user_id).execute()
    return {"message": f"Amort #{amort_id} Successfully Deleted"}


