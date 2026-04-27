from fastapi import HTTPException, Header
from dotenv import load_dotenv
import jwt
import httpx
import os

# Loading env vars
load_dotenv()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT")
SUPABASE_URL = os.getenv("SUPABASE_URL")

def get_jwks():
    response = httpx.get(f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json")
    return response.json()
    
def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        jwks = get_jwks()
        
        # Get the public key matching the kid in the token header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        public_key = None
        for key in jwks["keys"]:
            if key["kid"] == kid:
                from jwt.algorithms import ECAlgorithm
                public_key = ECAlgorithm.from_jwk(key)
                break
        
        if public_key is None:
            raise HTTPException(status_code=401, detail="Public key not found")

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["ES256"],
            options={"verify_aud": False}
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
        return user_id

    except jwt.PyJWTError as e:
        print("JWTError:", str(e))
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        print("Other error:", str(e))
        raise HTTPException(status_code=401, detail=str(e))