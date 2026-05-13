# Create models same as in supabase
from pydantic import BaseModel
from typing import Literal

class AmortEntry(BaseModel):
    amortID: int | None = None
    user_id: str | None = None
    creditID: int | None = None
    businessID: int | None = None
    created_at: str | None = None
    title: str | None = None
    tenorMonth: int | None = None
    totalInstallment: float | None = None
    principalAmount: float | None = None
    
class BusinessProfile(BaseModel):
    businessID: int | None = None
    user_id: str | None = None
    created_at: str | None = None
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
    umkmUnlockLevel: str | None = None
    businessContactNumber: str | None = None
    businessEmail: str | None = None

class Credit(BaseModel):
    creditID: int
    creditType: str | None = None
    interestRatePerYear: float | None = None
    minBusinessAge: int | None = None
    minLimit: float | None = None
    maxLimit: float | None = None
    minTenorMonth: int | None = None
    maxTenorMonth: int | None = None
    needsCollateral: bool | None = None

class Document(BaseModel):
    documentID: int 
    user_id: str 
    documentName: str | None = None
    isChecked: bool
    documentInstruction: str | None = None
    
class BusinessProposal(BaseModel):
    proposalID: int 
    user_id: str 
    businessID: int 
    status: str | None = None
    dateGenerated: str | None = None

class Profiles(BaseModel):
    profile_id: int 
    user_id: str 
    created_at: str 
    name: str 
    avatarURL: str | None = None
    simpleBio: str | None = None

class Assets (BaseModel):
    assetsID: int
    businessID: int 
    assetsName: str | None = None
    assetsType: Literal["Usaha", "Pribadi"]

class QuizProgress(BaseModel):
    quizID: int
    businessID: int
    lastModified: str | None = None
