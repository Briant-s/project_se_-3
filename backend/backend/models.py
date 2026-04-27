# Create models same as in supabase
from pydantic import BaseModel

class AmortEntry(BaseModel):
    amort_id: int | None = None
    user_id: str | None = None
    created_at: str | None = None
    title: str
    tenor_month: int
    total_installment: float
    
    
class BusinessProfile(BaseModel):
    businessID: int 