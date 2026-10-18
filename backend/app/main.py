from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_VERSION, API_DESCRIPTION, CORS_ORIGINS
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

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de Routers
app.include_router(tickets.router)
app.include_router(triage.router)
app.include_router(analytics.router)
app.include_router(knowledge.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "ticket-triage-ai",
        "version": API_VERSION,
        "engine": "Autonomous Multi-Agent Triage Pipeline",
        "database": "SQLite (tickets.db)"
    }
