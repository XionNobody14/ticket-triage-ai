from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse, UserResponse
from app.auth_utils import verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Autenticación Empresarial"])

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Valida credenciales corporativas y genera un token JWT para el usuario."""
    user = db.query(User).filter(User.email == request.email.strip().lower()).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas. Verifica tu correo y contraseña."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tu cuenta de usuario ha sido desactivada. Contacta al administrador."
        )

    token = create_access_token({
        "sub": user.email,
        "role": user.role,
        "full_name": user.full_name or ""
    })

    return {
        "token": token,
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Obtiene el perfil del usuario autenticado actual."""
    return current_user
