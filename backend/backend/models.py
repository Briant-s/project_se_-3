# Create models same as in supabase
from pydantic import BaseModel
from typing import Literal

class AmortEntry(BaseModel):
    amortID: int 
    user_id: str 
    creditID: int 
    businessID: int 
    created_at: str 
    title: str
    tenorMonth: int
    totalInstallment: float
    principalAmount: float 
    
class BusinessProfile(BaseModel):
    businessID: int 
    user_id: str 
    created_at: str 
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
    minBusinessAge: int | None = None
    maxLimit: float | None = None
    interestRate: float | None = None
    bankURL: str | None = None

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
