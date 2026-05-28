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
    health_status: str | None = None
    
class BusinessProfile(BaseModel):
    businessID: int | None = None
    user_id: str | None = None
    created_at: str | None = None
    businessName: str | None = None
    businessAge: int | None = None
    ownerName: str | None = None
    ownerDob: str | None = None
    businessLocation: str | None = None
    businessBankAcc: str | None = None
    businessSector: str | None = None
    businessType: str | None = None
    totalEmployees: int | None = None
    storeType: str | None = None
    monthlyAverageIncome: float | None = None
    monthlyAverageProfitLoss: float | None = None
    # businessAssets: str | None = None
    isOtherKredit: str | None = None
    umkmUnlockLevel: str | None = None
    businessContactNumber: str | None = None
    businessEmail: str | None = None
    isProfitable: bool | None = None

class Assets(BaseModel):
    assetsID: int | None = None
    businessID: int | None = None
    assetsName: str | None = None
    assetsType: Literal["Usaha", "Pribadi"] | None = None
    assetsValue: float | None = None

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
    
class Competitors(BaseModel):
    competitorID: str | None = None
    proposalID: str | None = None
    name: str | None = None
    strength: str | None = None
    weakness: str | None = None

class Products(BaseModel):
    productID: str | None = None
    proposalID: str | None = None
    name: str | None = None
    description: str | None = None
    price: str | None = None

class BusinessProposal(BaseModel):
    proposalID: str | None = None
    user_id: str | None = None
    businessID: int | None = None
    # status: str | None = None
    # dateGenerated: str | None = None
    businessName: str | None = None
    businessDescription: str | None = None
    visi: str | None = None
    misi: str | None = None
    targetPasar: str | None = None
    psikografi: str | None = None
    trenPasar: str | None = None
    strategiPemasaran: str | None = None
    pelayananPelanggan: str | None = None
    jamOperasional: str | None = None
    jumlahStaff: int | None = None
    supplier: str | None = None
    prosesOperasional: str | None = None
    modalAwal: str | None = None
    targetPendapatan: str | None = None
    analisa: str | None = None
    kesimpulan: str | None = None

class BusinessProposalData(BusinessProposal):
    competitors: list[Competitors] | None = None
    products: list[Products] | None = None

class AIProposal(BusinessProposal):
    AIproposalID: str | None = None
    user_id: str | None = None
    businessID: int | None = None
    proposalID: str | None = None
    businessName: str | None = None
    businessDescription: str | None = None
    visi: str | None = None
    misi: str | None = None
    targetPasar: str | None = None
    psikografi: str | None = None
    trenPasar: str | None = None
    strategiPemasaran: str | None = None
    pelayananPelanggan: str | None = None
    jamOperasional: str | None = None
    jumlahStaff: int | None = None
    supplier: str | None = None
    prosesOperasional: str | None = None
    modalAwal: str | None = None
    targetPendapatan: str | None = None
    analisa: str | None = None
    kesimpulan: str | None = None

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
