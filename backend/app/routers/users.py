from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.auth_utils import hash_password
from app.dependencies import require_admin

router = APIRouter(prefix="/api/users", tags=["Gestión de Usuarios"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Crea un nuevo usuario corporativo (Acceso exclusivo para administradores)."""
    email_clean = user_data.email.strip().lower()

    # Validar rol permitido
    if user_data.role not in ["admin", "agent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rol inválido. Los roles permitidos son 'admin' y 'agent'."
        )

    # Validar que el email no esté duplicado
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un usuario registrado con el correo {email_clean}."
        )

    new_user = User(
        email=email_clean,
        full_name=user_data.full_name.strip() if user_data.full_name else None,
        role=user_data.role,
        hashed_password=hash_password(user_data.password),
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("", response_model=List[UserResponse])
def list_users(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lista todos los usuarios corporativos registrados (Exclusivo Administrador)."""
    return db.query(User).order_by(User.id.asc()).all()
