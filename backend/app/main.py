import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_VERSION, API_DESCRIPTION
from app.database import engine, Base, SessionLocal
from app.models import User
from app.auth_utils import hash_password
from app.routers import tickets, triage, analytics, knowledge, auth, users

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

def init_admin_user():
    """Garantiza la existencia del usuario administrador inicial admin@xion.com"""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@xion.com").first()
        if not admin:
            admin = User(
                email="admin@xion.com",
                full_name="Administrador Principal",
                role="admin",
                hashed_password=hash_password("Heartless2003"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("[AUTH] Usuario administrador principal (admin@xion.com) inicializado exitosamente.")
    except Exception as e:
        print(f"[AUTH Warning] No se pudo inicializar admin@xion.com: {e}")
        db.rollback()
    finally:
        db.close()

# Inicializar admin inicial
init_admin_user()

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS abierta para producción (Vercel, Railway, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de seguridad: Validación de DEMO_ACCESS_KEY
@app.middleware("http")
async def demo_security_middleware(request: Request, call_next):
    # Preflight de CORS siempre permitido
    if request.method == "OPTIONS":
        return await call_next(request)

    path = request.url.path

    # Rutas públicas exentas de validación de DEMO_ACCESS_KEY
    public_paths = (
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/health",
        "/health",
    )
    if path in public_paths:
        return await call_next(request)

    # Si DEMO_ACCESS_KEY está configurada en el entorno, validar autorización
    demo_access_key = os.getenv("DEMO_ACCESS_KEY")
    if demo_access_key:
        header_key = request.headers.get("x-demo-key") or request.headers.get("X-Demo-Key")
        auth_header = request.headers.get("authorization") or request.headers.get("Authorization")
        bearer_key = None
        if auth_header and auth_header.startswith("Bearer "):
            bearer_key = auth_header[7:].strip()

        # Permitir si X-Demo-Key coincide, o si Authorization coincide con la clave demo
        is_demo_valid = (header_key == demo_access_key) or (not header_key and bearer_key == demo_access_key)
        if not is_demo_valid:
            return JSONResponse(
                status_code=401,
                content={
                    "detail": "Acceso no autorizado. Se requiere una DEMO_ACCESS_KEY válida para interactuar con la plataforma."
                },
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                }
            )

    return await call_next(request)

# Middleware de compatibilidad para enrutar peticiones sin prefijo /api hacia /api
@app.middleware("http")
async def api_alias_middleware(request: Request, call_next):
    path = request.scope.get("path", "")
    prefixes = ("/tickets", "/triage", "/analytics", "/knowledge", "/health", "/auth", "/users")
    if any(path == p or path.startswith(p + "/") for p in prefixes):
        request.scope["path"] = f"/api{path}"
    response = await call_next(request)
    return response

# Inclusión de Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tickets.router)
app.include_router(triage.router)
app.include_router(analytics.router)
app.include_router(knowledge.router)

@app.get("/", tags=["Root"], include_in_schema=False)
def root():
    return {
        "service": "ticket-triage-ai",
        "status": "online",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health", tags=["Health"])
@app.get("/health", tags=["Health"], include_in_schema=False)
def health_check():
    return {
        "status": "healthy",
        "service": "ticket-triage-ai",
        "version": API_VERSION,
        "engine": "Autonomous Multi-Agent Triage Pipeline",
        "database": "Operational"
    }
