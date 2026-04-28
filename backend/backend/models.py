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
    created_at: str
    businessName: str | None = None
    businessAge: int | None = None
    own_name: str | None = None
    own_dob: str | None = None
    businessLocation: str | None = None
    businessBankAcc: str | None = None
    businessSector: str | None = None
    businessType: str | None = None
    totalEmployees: int | None = None
    storeType: str | None = None
    monthlyAverageIncome: float | None = None
    monthlyAverageProfitLoss: float | None = None
    isOtherKredit: bool | None = None