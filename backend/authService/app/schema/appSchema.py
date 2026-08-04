from pydantic import BaseModel , EmailStr , Field

class AddEmployeeSchema(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=20)

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=20)

class EmailVerifySchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    password: str