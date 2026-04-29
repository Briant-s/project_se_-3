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
    businessID: int | None = None
    created_at: str | None = None
    user_id: str | None = None
    businessName: str | None = None
    businessAge: str | None = None
    ownerName: str | None = None
    ownerDob: str | None = None
    businessLocation: str | None = None
    businessBankAcc: str | None = None
    businessSector: str | None = None
    businessType: str | None = None
    totalEmployees: int | None = None
    storeType: str | None = None
    monthlyAverageIncome: str | None = None
    monthlyAverageProfitLoss: str | None = None
    businessAssets: str | None = None
    isOtherKredit: str | None = None