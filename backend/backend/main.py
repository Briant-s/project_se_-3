import os
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client

from models import AmortEntry, BusinessProfile, BusinessProposalData, Competitors, Products

from auth import get_current_user

from datetime import datetime, timedelta
import uuid

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
    results = (supabase.table('Amort').select('*, Credit!amort_creditID_fkey(creditType)').eq("user_id", user_id).execute())
    return results.data

# Get per item
@app.get("/amort/amort-calc/{amortID}")
async def get_amort(amortID: int, user_id: str = Depends(get_current_user)):
    try:
        result = (supabase.table('Amort').select('*').eq("user_id", user_id).eq("amortID", amortID).execute())
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
        data = entry.model_dump(exclude={"amortID", "created_at", "user_id", "businessID"})
        data["user_id"] = user_id
        
        # Fetch businessID from BusinessProfile
        business = supabase.table("BusinessProfile").select("businessID").eq("user_id", user_id).execute()
        if not business.data:
            raise HTTPException(status_code=404, detail="Business Profile not found")
        data["businessID"] = business.data[0]["businessID"]
        
        
        result = supabase.table("Amort").insert(data).execute()
        return result.data[0]
    except Exception as e:
        print("POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Update Amort
@app.put("/amort/amort-calc/{amortID}")
async def update_amort(amortID: int, entry: AmortEntry, user_id: str = Depends(get_current_user)) :
    try:
        data = entry.model_dump(exclude={"amortID", "created_at", "user_id", "businessID", "creditID"})
        result = supabase.table("Amort").update(data).eq("amortID", amortID).eq("user_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Entry not found or unauthorized")
        
        return result.data[0]
    except Exception as e:
        print("POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Delete Amort
@app.delete("/amort/amort-calc/{amortID}")
async def delete_amort(amortID: int, user_id: str = Depends(get_current_user)):
    supabase.table("Amort").delete().eq("amortID", amortID).eq("user_id", user_id).execute()
    return {"message": f"Amort #{amortID} Successfully Deleted"}


def clean_empty_strings(data: dict) -> dict:
    return {k: v for k, v in data.items() if not (isinstance(v, str) and v == "")}

def filter_nonempty_rows(rows: list[dict]) -> list[dict]:
    return [row for row in rows if row]


async def get_business_id(user_id: str) -> int | None:
    result = supabase.table("BusinessProfile").select("businessID").eq("user_id", user_id).execute()
    if result.data:
        return result.data[0].get("businessID")
    return None

async def get_proposal_or_404(proposalID: str, user_id: str):
    result = supabase.table("BusinessProposal").select("*").eq("proposalID", proposalID).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proposal not found or unauthorized")
    return result.data[0]

async def get_proposal_with_relations(proposalID: str, user_id: str):
    proposal = await get_proposal_or_404(proposalID, user_id)
    competitors = supabase.table("Competitors").select("*").eq("proposalID", proposalID).execute().data or []
    products = supabase.table("Products").select("*").eq("proposalID", proposalID).execute().data or []
    return {**proposal, "competitors": competitors, "products": products}

@app.get("/business-proposal")
async def list_business_proposals(user_id: str = Depends(get_current_user)):
    result = supabase.table("BusinessProposal").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    proposals = result.data or []
    detailed = []
    for proposal in proposals:
        proposalID = proposal.get("proposalID")
        competitors = []
        products = []
        if proposalID is not None:
            competitors = supabase.table("Competitors").select("*").eq("proposalID", proposalID).execute().data or []
            products = supabase.table("Products").select("*").eq("proposalID", proposalID).execute().data or []
        detailed.append({**proposal, "competitors": competitors, "products": products})
    return detailed

@app.get("/business-proposal/{proposalID}")
async def get_business_proposal(proposalID: str, user_id: str = Depends(get_current_user)):
    return await get_proposal_with_relations(proposalID, user_id)

@app.post("/business-proposal")
async def create_business_proposal(entry: BusinessProposalData, user_id: str = Depends(get_current_user)):
    try:
        data = clean_empty_strings(entry.model_dump(exclude={"proposalID", "user_id", "businessID", "competitors", "products"}, exclude_none=True))
        data["user_id"] = user_id
        data["businessID"] = entry.businessID or await get_business_id(user_id)
        if data["businessID"] is None:
            raise HTTPException(status_code=404, detail="Business profile not found")

        result = supabase.table("BusinessProposal").insert(data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create business proposal")

        proposal = result.data[0]
        proposalID = proposal.get("proposalID")

        if entry.competitors:
            competitor_rows = filter_nonempty_rows([
                clean_empty_strings({
                    "competitorID": str(uuid.uuid4()),
                    "proposalID": proposalID,
                    "name": comp.name,
                    "strength": comp.strength,
                    "weakness": comp.weakness,
                })
                for comp in entry.competitors
            ])
            if competitor_rows:
                supabase.table("Competitors").insert(competitor_rows).execute()

        if entry.products:
            product_rows = filter_nonempty_rows([
                clean_empty_strings({
                    "productID": str(uuid.uuid4()),
                    "proposalID": proposalID,
                    "name": prod.name,
                    "description": prod.description,
                    "price": prod.price,
                })
                for prod in entry.products
            ])
            if product_rows:
                supabase.table("Products").insert(product_rows).execute()

        return await get_proposal_with_relations(proposalID, user_id)
    except HTTPException:
        raise
    except Exception as e:
        print("Business proposal POST error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/business-proposal/{proposalID}")
async def update_business_proposal(proposalID: str, entry: BusinessProposalData, user_id: str = Depends(get_current_user)):
    try:
        await get_proposal_or_404(proposalID, user_id)
        data = clean_empty_strings(entry.model_dump(exclude={"proposalID", "user_id", "businessID", "competitors", "products"}, exclude_none=True))

        if entry.businessID:
            data["businessID"] = entry.businessID
        else:
            data["businessID"] = await get_business_id(user_id)

        supabase.table("BusinessProposal").update(data).eq("proposalID", proposalID).eq("user_id", user_id).execute()

        if entry.competitors is not None:
            existing = supabase.table("Competitors").select("competitorID").eq("proposalID", proposalID).execute().data or []
            existing_ids = {item["competitorID"] for item in existing if item.get("competitorID") is not None}
            incoming_ids = {comp.competitorID for comp in entry.competitors if comp.competitorID is not None}

            to_delete = list(existing_ids - incoming_ids)
            if to_delete:
                supabase.table("Competitors").delete().in_("competitorID", to_delete).execute()

            for comp in entry.competitors:
                competitor_data = clean_empty_strings({"proposalID": proposalID, "name": comp.name, "strength": comp.strength, "weakness": comp.weakness})
                if not competitor_data:
                    continue
                if comp.competitorID:
                    supabase.table("Competitors").update(competitor_data).eq("competitorID", comp.competitorID).eq("proposalID", proposalID).execute()
                else:
                    competitor_data["competitorID"] = str(uuid.uuid4())
                    supabase.table("Competitors").insert(competitor_data).execute()

        if entry.products is not None:
            existing = supabase.table("Products").select("productID").eq("proposalID", proposalID).execute().data or []
            existing_ids = {item["productID"] for item in existing if item.get("productID") is not None}
            incoming_ids = {prod.productID for prod in entry.products if prod.productID is not None}

            to_delete = list(existing_ids - incoming_ids)
            if to_delete:
                supabase.table("Products").delete().in_("productID", to_delete).execute()

            for prod in entry.products:
                product_data = clean_empty_strings({"proposalID": proposalID, "name": prod.name, "description": prod.description, "price": prod.price})
                if not product_data:
                    continue
                if prod.productID:
                    supabase.table("Products").update(product_data).eq("productID", prod.productID).eq("proposalID", proposalID).execute()
                else:
                    product_data["productID"] = str(uuid.uuid4())
                    supabase.table("Products").insert(product_data).execute()

        return await get_proposal_with_relations(proposalID, user_id)
    except HTTPException:
        raise
    except Exception as e:
        print("Business proposal PUT error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/business-proposal/{proposalID}")
async def delete_business_proposal(proposalID: str, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    supabase.table("Competitors").delete().eq("proposalID", proposalID).execute()
    supabase.table("Products").delete().eq("proposalID", proposalID).execute()
    supabase.table("BusinessProposal").delete().eq("proposalID", proposalID).eq("user_id", user_id).execute()
    return {"message": f"Business proposal {proposalID} deleted successfully"}

@app.get("/business-proposal/{proposalID}/competitors")
async def list_proposal_competitors(proposalID: str, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    result = supabase.table("Competitors").select("*").eq("proposalID", proposalID).execute()
    return result.data or []

@app.post("/business-proposal/{proposalID}/competitors")
async def create_proposal_competitor(proposalID: int, entry: Competitors, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    data = clean_empty_strings({
        "competitorID": str(uuid.uuid4()),
        "proposalID": proposalID,
        "name": entry.name,
        "strength": entry.strength,
        "weakness": entry.weakness,
    })
    result = supabase.table("Competitors").insert(data).execute()
    return result.data[0]

@app.put("/business-proposal/{proposalID}/competitors/{competitorID}")
async def update_proposal_competitor(proposalID: int, competitorID: str, entry: Competitors, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    data = clean_empty_strings({"name": entry.name, "strength": entry.strength, "weakness": entry.weakness})
    result = supabase.table("Competitors").update(data).eq("competitorID", competitorID).eq("proposalID", proposalID).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return result.data[0]

@app.delete("/business-proposal/{proposalID}/competitors/{competitorID}")
async def delete_proposal_competitor(proposalID: int, competitorID: str, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    supabase.table("Competitors").delete().eq("competitorID", competitorID).eq("proposalID", proposalID).execute()
    return {"message": f"Competitor {competitorID} deleted successfully"}

@app.get("/business-proposal/{proposalID}/products")
async def list_proposal_products(proposalID: int, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    result = supabase.table("Products").select("*").eq("proposalID", proposalID).execute()
    return result.data or []

@app.post("/business-proposal/{proposalID}/products")
async def create_proposal_product(proposalID: int, entry: Products, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    data = clean_empty_strings({
        "productID": str(uuid.uuid4()),
        "proposalID": proposalID,
        "name": entry.name,
        "description": entry.description,
        "price": entry.price,
    })
    result = supabase.table("Products").insert(data).execute()
    return result.data[0]

@app.put("/business-proposal/{proposalID}/products/{productID}")
async def update_proposal_product(proposalID: int, productID: str, entry: Products, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    data = clean_empty_strings({"name": entry.name, "description": entry.description, "price": entry.price})
    result = supabase.table("Products").update(data).eq("productID", productID).eq("proposalID", proposalID).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]

@app.delete("/business-proposal/{proposalID}/products/{productID}")
async def delete_proposal_product(proposalID: int, productID: str, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    supabase.table("Products").delete().eq("productID", productID).eq("proposalID", proposalID).execute()
    return {"message": f"Product {productID} deleted successfully"}

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
        data["user_id"] = user_id

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
    
    
    
# Query Amort based On Cutoff
@app.get("/credit/eligibility-overview")
async def get_all_cutoff(
    c_days: int,
    user_id: str = Depends(get_current_user)
):
    now = datetime.now()
    cutoff = ( now - timedelta(days=c_days)).isoformat()
    
    result = (
        supabase
        .table("Amort")
        .select("*, Credit!amort_creditID_fkey(creditType)")
        .eq("user_id", user_id)
        .gte("created_at", cutoff)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data