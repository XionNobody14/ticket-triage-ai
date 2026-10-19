from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth_utils import decode_access_token

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    x_user_token: Optional[str] = Header(None, alias="X-User-Token"),
    db: Session = Depends(get_db)
) -> User:
    """Extrae y valida el token JWT del usuario desde Authorization: Bearer o X-User-Token."""
    token = None
    if credentials and credentials.credentials:
        token = credentials.credentials
    elif x_user_token:
        token = x_user_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión no iniciada. Se requiere token de autenticación.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de sesión expirado o inválido.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(User.email == payload["sub"], User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Verifica que el usuario autenticado posea rol de administrador."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requieren permisos de Administrador."
        )
    return current_user
