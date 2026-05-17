import os
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from supabase import create_client, Client

from models import AmortEntry, BusinessProfile, BusinessProposalData, Competitors, Products, AIProposal

from auth import get_current_user

from datetime import datetime, timedelta
import json
import requests
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
    allow_origins=["*"],
    allow_credentials=False,
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

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"


def build_gemini_prompt(proposal: dict, competitors: list[dict], products: list[dict]) -> str:
# def build_gemini_prompt(proposal: dict) -> str:
    return (
        "You are a professional business consultant. Improve and enhance the following business proposal text fields "
        "to be more professional, detailed, and compelling. Return a valid JSON object with these fields: "
        "businessName (keep unchanged), businessDescription (improved version), visi (improved vision statement), "
        "misi (improved mission statement), targetPasar (detailed target market analysis), psikografi (improved psychographic analysis), "
        "trenPasar (market trends analysis), strategiPemasaran (comprehensive marketing strategy), pelayananPelanggan (customer service strategy), "
        "prosesOperasional (detailed operational process), analisa (financial analysis and insights), kesimpulan (professional conclusion), "
        "competitors (array with name, strength, weakness), menuProduk (array with name, description, price). "
        "For text fields, enhance them to be professional, detailed, and business-ready. "
        "If original data is missing or empty for a field, use your knowledge to create a reasonable professional text based on the context. "
        "Maintain Indonesian language if the original data is in Indonesian. "
        "Do not include any additional keys or fields. "
        "\n\nRaw business proposal data:\n"
        f"{json.dumps({**proposal, "competitors": competitors, "products": products}, ensure_ascii=False, indent=2)}"
    )


def parse_ai_json(output: str) -> dict:
    if not output:
        raise ValueError("Empty AI response")
    start = output.find("{")
    if start == -1:
        raise ValueError("AI response did not contain JSON")
    payload = output[start:]
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        # Try to extract JSON object by balancing braces
        depth = 0
        end_index = None
        for i, char in enumerate(payload):
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    end_index = i + 1
                    break
        if end_index is None:
            raise
        return json.loads(payload[:end_index])


def generate_ai_proposal_data(proposal: dict, competitors: list[dict], products: list[dict]) -> dict:
# def generate_ai_proposal_data(proposal: dict) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is required to generate AI business proposals. Please set it in .env file")

    prompt = build_gemini_prompt(proposal, competitors, products)
    # prompt = build_gemini_prompt(proposal)
    
    try:
        response = requests.post(
            f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}",
            json={
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }]
            },
            timeout=30,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            error_detail = response.text
            print(f"Gemini API Error {response.status_code}: {error_detail}")
            raise RuntimeError(f"Gemini generation failed: {response.status_code} {error_detail}")

        body = response.json()
        candidates = body.get("candidates") or []
        if not candidates:
            raise RuntimeError("Gemini returned no candidates")
        
        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        if not parts:
            raise RuntimeError("Gemini response has no parts")
        
        output = parts[0].get("text", "")
        if not output:
            raise RuntimeError("Gemini response text is empty")
        
        ai_data = parse_ai_json(output)
        return ai_data
    except requests.exceptions.Timeout:
        raise RuntimeError("Gemini API request timed out. Please try again later")
    except requests.exceptions.ConnectionError:
        raise RuntimeError("Failed to connect to Gemini API. Check your internet connection")
    except Exception as e:
        print(f"Gemini processing error: {str(e)}")
        raise RuntimeError(f"Failed to process AI proposal: {str(e)}")


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

async def get_ai_proposal_or_none(proposalID: str, user_id: str):
    result = supabase.table("AIProposal").select("*").eq("proposalID", proposalID).eq("user_id", user_id).execute()
    if not result.data:
        return None
    return result.data[0]

@app.get("/ai-business-proposal/{proposalID}")
async def get_ai_business_proposal(proposalID: str, user_id: str = Depends(get_current_user)):
    await get_proposal_or_404(proposalID, user_id)
    ai_proposal = await get_ai_proposal_or_none(proposalID, user_id)
    if ai_proposal:
        competitors = supabase.table("Competitors").select("*").eq("proposalID", proposalID).execute().data or []
        products = supabase.table("Products").select("*").eq("proposalID", proposalID).execute().data or []
        return {**ai_proposal, "competitors": competitors, "products": products}

    business_proposal = await get_proposal_with_relations(proposalID, user_id)
    # print(business_proposal)
    ai_content = generate_ai_proposal_data(
        proposal=business_proposal,
        competitors=business_proposal.get("competitors", []),
        products=business_proposal.get("products", []),
    )

    

    ai_row = {
        "AIProposalID": str(uuid.uuid4()),
        "proposalID": proposalID,
        "user_id": user_id,
        "businessID": business_proposal.get("businessID"),
        "businessName": business_proposal.get("businessName"),
        "businessDescription": ai_content.get("businessDescription", business_proposal.get("businessDescription")),
        "visi": ai_content.get("visi", business_proposal.get("visi")),
        "misi": ai_content.get("misi", business_proposal.get("misi")),
        "targetPasar": ai_content.get("targetPasar", business_proposal.get("targetPasar")),
        "psikografi": ai_content.get("psikografi", business_proposal.get("psikografi")),
        "trenPasar": ai_content.get("trenPasar", business_proposal.get("trenPasar")),
        "strategiPemasaran": ai_content.get("strategiPemasaran", business_proposal.get("strategiPemasaran")),
        "pelayananPelanggan": ai_content.get("pelayananPelanggan", business_proposal.get("pelayananPelanggan")),
        "jamOperasional": business_proposal.get("jamOperasional"),
        "jumlahStaff": business_proposal.get("jumlahStaff"),
        "supplier": business_proposal.get("supplier"),
        "prosesOperasional": ai_content.get("prosesOperasional", business_proposal.get("prosesOperasional")),
        "modalAwal": business_proposal.get("modalAwal"),
        "targetPendapatan": business_proposal.get("targetPendapatan"),
        "analisa": ai_content.get("analisa", business_proposal.get("analisa")),
        "kesimpulan": ai_content.get("kesimpulan", business_proposal.get("kesimpulan")),
        # "competitors": ai_content.get("competitors", business_proposal.get("competitors", [])),
        # "products": ai_content.get("menuProduk", business_proposal.get("products", [])),
    }
    ai_row = clean_empty_strings(ai_row)
    result = supabase.table("AIProposal").insert(ai_row).execute()
    competitors = supabase.table("Competitors").select("*").eq("proposalID", proposalID).execute().data or []
    products = supabase.table("Products").select("*").eq("proposalID", proposalID).execute().data or []
    return {**ai_row, "competitors": competitors, "products": products}
    
    # if not result.data:
    #     raise HTTPException(status_code=500, detail="Failed to save AI business proposal")
    # return result.data[0]

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