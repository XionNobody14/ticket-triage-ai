from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    urgency = Column(String(50), nullable=False, index=True)  # "Baja", "Media", "Alta", "Crítica"
    status = Column(String(50), nullable=False, default="Abierto", index=True)  # "Abierto", "En Proceso", "Resuelto"
    suggested_solution = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.85)
    matched_kb_id = Column(String(50), nullable=True)
    user_email = Column(String(150), nullable=True)
    assigned_team = Column(String(100), nullable=True)
    sla_hours = Column(Integer, default=24)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    audit_logs = relationship("AuditLog", back_populates="ticket", cascade="all, delete-orphan", order_by="AuditLog.timestamp.desc()")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "urgency": self.urgency,
            "status": self.status,
            "suggested_solution": self.suggested_solution,
            "confidence_score": round(self.confidence_score, 2) if self.confidence_score else 0.85,
            "matched_kb_id": self.matched_kb_id,
            "user_email": self.user_email,
            "assigned_team": self.assigned_team,
            "sla_hours": self.sla_hours,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "audit_logs": [log.to_dict() for log in self.audit_logs] if self.audit_logs else []
        }

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=utc_now)
    author = Column(String(100), nullable=False)  # "AI Triage Engine", "Analista L2", etc.
    action = Column(String(100), nullable=False)  # "Clasificación", "Resolución", "Comentario"
    details = Column(Text, nullable=False)

    ticket = relationship("Ticket", back_populates="audit_logs")

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_id": self.ticket_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "author": self.author,
            "action": self.action,
            "details": self.details
        }

class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id = Column(String(50), primary_key=True)  # e.g., "KB-SAP-001"
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    tags = Column(String(255), nullable=False)  # Comma-separated tags
    problem_pattern = Column(Text, nullable=False)
    solution_steps = Column(Text, nullable=False)
    severity_hint = Column(String(50), default="Media")
    escalation_team = Column(String(100), default="Soporte Nivel 1")
    created_at = Column(DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "tags": [t.strip() for t in self.tags.split(",") if t.strip()],
            "problem_pattern": self.problem_pattern,
            "solution_steps": self.solution_steps,
            "severity_hint": self.severity_hint,
            "escalation_team": self.escalation_team,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="agent")  # "admin" | "agent"
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

