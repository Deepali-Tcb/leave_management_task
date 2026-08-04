from app.schema.appSchema import AddEmployeeSchema , LoginSchema , ResetPasswordSchema , EmailVerifySchema
from app.utils.util import create_access_token , create_refresh_token , verify_token
from app.models.passwordResetModel import PasswordResetToken
from fastapi import APIRouter ,Header , status , Response , Depends , HTTPException
from pwdlib import PasswordHash
from app.config.db import get_db
from sqlalchemy.orm import Session
from app.models.userModel import User
import secrets
import hashlib
from datetime import datetime, timedelta, timezone

appRouter = APIRouter()

passwordHash = PasswordHash.recommended()

@appRouter.get("/health")
async def health_check():
    return {"status": "healthy"}    

@appRouter.post("/createuser")
async def create_user(data: AddEmployeeSchema, db: Session = Depends(get_db)):
    # check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()

    # if user already exists, raise an exception
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )   

    # create new user
    new_user = User(
        name=data.name,
        email=data.email,
        password_hash=passwordHash.hash(data.password),
        role="EMPLOYEE",
        status="ACTIVE"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)    

    return {
        "success": True,
        "message": "Employee added successfully",
        "user": {    
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "status": new_user.status
        }
    }

@appRouter.post("/login")
def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    verify_password = passwordHash.verify(data.password , user.password_hash)

    # # Verify password
    if not verify_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create tokens
    access_token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "user_id": user.id
    })

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }
    
@appRouter.post("/deleteuser")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Delete user
    db.delete(user)
    db.commit()

    return {
        "success": True,
        "message": "User deleted successfully"
    }

@appRouter.get("/profile")
async def profile( x_user_id: int = Header(...), db:Session = Depends(get_db)):
    print(profile)
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )   

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    }

@appRouter.get("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {
        "success": True,
        "message": "Logout successful"
    }

@appRouter.post("/email-verify")
async def email_verify(
    data: EmailVerifySchema,
    db: Session = Depends(get_db)
):
    # Check user
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Delete previous unused tokens
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at == None
    ).delete()

    # Generate random token
    raw_token = secrets.token_urlsafe(32)

    # Hash token
    token_hash = hashlib.sha256(
        raw_token.encode()
    ).hexdigest()

    # Expiry
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    # Save token
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )

    db.add(reset_token)
    db.commit()

    return {
        "success": True,
        "message": "Email verified successfully",
        "verified_token": raw_token
    }

@appRouter.post("/reset-password")
async def reset_password(
    data: ResetPasswordSchema,
    db: Session = Depends(get_db)
):

    # Hash incoming token
    token_hash = hashlib.sha256(
        data.token.encode()
    ).hexdigest()

    # Find token
    reset_token = db.query(
        PasswordResetToken
    ).filter(
        PasswordResetToken.token_hash == token_hash
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )

    # Already used
    if reset_token.used_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token already used"
        )

    # Expired
    if reset_token.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token expired"
        )

    # Get user
    user = db.query(User).filter(
        User.id == reset_token.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update password
    user.password_hash = passwordHash.hash(
        data.password
    )

    # Mark token used
    reset_token.used_at = datetime.now(
        timezone.utc
    )

    db.commit()

    return {
        "success": True,
        "message": "Password reset successfully"
    }