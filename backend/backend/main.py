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

# Get per item
@app.get("/amort/amort-calc/{amort_id}")
async def get_amort(amort_id: int, user_id: str = Depends(get_current_user)):
    try:
        result = (supabase.table('amort').select('*').eq("user_id", user_id).eq("amort_id", amort_id).execute())
        if not result.data:
            raise HTTPException(status_code=404, detail="Entry not found")
        return result.data[0]
    except Exception as e:
        print("GET error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


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


def clean_empty_strings(data: dict) -> dict:
    return {k: v for k, v in data.items() if not (isinstance(v, str) and v == "")}

# Read Business Profile
@app.get("/business-profile")
async def get_business_profile(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table("BusinessProfile").select("*").eq("user_id", user_id).execute()
        if not result.data:
            return {}
        return result.data[0]
    except Exception as e:
        print("GET business profile error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Create or update Business Profile
@app.post("/business-profile")
async def create_business_profile(entry: BusinessProfile, user_id: str = Depends(get_current_user)):
    try:
        data = clean_empty_strings(entry.model_dump(exclude_none=True))
        data["user_id"] = user_id

        existing = supabase.table("BusinessProfile").select("businessID").eq("user_id", user_id).execute()
        if existing.data:
            result = supabase.table("BusinessProfile").update(data).eq("user_id", user_id).execute()
        else:
            result = supabase.table("BusinessProfile").insert(data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save business profile")
        return result.data[0]
    except Exception as e:
        print("Business profile POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Update Business Profile
@app.put("/business-profile")
async def update_business_profile(entry: BusinessProfile, user_id: str = Depends(get_current_user)):
    try:
        data = clean_empty_strings(entry.model_dump(exclude_none=True))

        existing = supabase.table("BusinessProfile").select("businessID").eq("user_id", user_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Business profile not found")

        result = supabase.table("BusinessProfile").update(data).eq("user_id", user_id).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update business profile")
        return result.data[0]
    except Exception as e:
        print("Business profile PUT error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))