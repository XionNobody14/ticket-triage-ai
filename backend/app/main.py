from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_VERSION, API_DESCRIPTION
from app.database import engine, Base
from app.routers import tickets, triage, analytics, knowledge

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

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

# Middleware de compatibilidad para enrutar peticiones sin prefijo /api hacia /api
@app.middleware("http")
async def api_alias_middleware(request: Request, call_next):
    path = request.scope.get("path", "")
    prefixes = ("/tickets", "/triage", "/analytics", "/knowledge", "/health")
    if any(path == p or path.startswith(p + "/") for p in prefixes):
        request.scope["path"] = f"/api{path}"
    response = await call_next(request)
    return response

# Inclusión de Routers
app.include_router(tickets.router)
app.include_router(triage.router)
app.include_router(analytics.router)
app.include_router(knowledge.router)

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
