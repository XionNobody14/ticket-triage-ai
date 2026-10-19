from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

# Modelos de Auditoría
class AuditLogBase(BaseModel):
    author: str
    action: str
    details: str

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: int
    ticket_id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

# Modelos de Ticket
class TicketBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    category: str = Field(default="Soporte General")
    urgency: str = Field(default="Media")  # "Baja", "Media", "Alta", "Crítica"
    status: str = Field(default="Abierto")  # "Abierto", "En Proceso", "Resuelto"
    user_email: Optional[str] = None
    assigned_team: Optional[str] = None
    sla_hours: Optional[int] = 24

class TicketCreate(TicketBase):
    suggested_solution: Optional[str] = None
    confidence_score: Optional[float] = 0.85
    matched_kb_id: Optional[str] = None

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    urgency: Optional[str] = None
    status: Optional[str] = None
    suggested_solution: Optional[str] = None
    assigned_team: Optional[str] = None
    comment: Optional[str] = None  # Agrega entrada a audit_logs

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    urgency: str
    status: str
    suggested_solution: Optional[str] = None
    confidence_score: Optional[float] = None
    matched_kb_id: Optional[str] = None
    user_email: Optional[str] = None
    assigned_team: Optional[str] = None
    sla_hours: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    audit_logs: List[AuditLogResponse] = []
    model_config = ConfigDict(from_attributes=True)

# Schemas de Triaje Agéntico
class TriageRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    user_email: Optional[str] = "usuario.corporativo@empresa.com"
    dry_run: bool = False  # Si es True, solo analiza sin guardar en BD

class MatchedKBInfo(BaseModel):
    id: str
    title: str
    category: str
    similarity: float

class TriageAnalysis(BaseModel):
    category: str
    urgency: str
    confidence_score: float
    sla_hours: int
    recommended_team: str
    reasoning: str
    suggested_solution: str
    matched_kb: Optional[MatchedKBInfo] = None

class TriageResponse(BaseModel):
    analysis: TriageAnalysis
    ticket: Optional[TicketResponse] = None

# Schemas de Base de Conocimiento
class KnowledgeArticleBase(BaseModel):
    id: str
    title: str
    category: str
    tags: str
    problem_pattern: str
    solution_steps: str
    severity_hint: str = "Media"
    escalation_team: str = "Soporte Nivel 1"

class KnowledgeArticleResponse(KnowledgeArticleBase):
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Analytics Response
class CategoryMetric(BaseModel):
    category: str
    count: int
    resolved_count: int

class UrgencyMetric(BaseModel):
    urgency: str
    count: int

class StatusMetric(BaseModel):
    status: str
    count: int

class AnalyticsResponse(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    critical_tickets: int
    avg_confidence_score: float
    automated_triage_rate: float
    estimated_hours_saved: float
    categories: List[CategoryMetric]
    urgencies: List[UrgencyMetric]
    statuses: List[StatusMetric]

# Modelos de Autenticación Empresarial y Usuarios
class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)

class UserBase(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    full_name: Optional[str] = None
    role: str = Field(default="agent")  # "admin" | "agent"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

