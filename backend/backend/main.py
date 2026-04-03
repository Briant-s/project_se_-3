import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client

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


# testing
results = (supabase.table('amort').select('*').execute())
print(results)


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}
