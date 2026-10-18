from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket, AuditLog
from app.schemas import TriageRequest, TriageResponse, TriageAnalysis, MatchedKBInfo
from app.triage_engine import triage_engine

router = APIRouter(prefix="/api/triage", tags=["Triaje Agéntico"])

@router.post("", response_model=TriageResponse, status_code=status.HTTP_200_OK)
def run_triage(request: TriageRequest, db: Session = Depends(get_db)):
    """
    Pipeline agéntico autónomo:
    1. Analiza el título y la descripción con NLP heurístico y reglas de dominio.
    2. Clasifica automáticamente la categoría de la incidencia.
    3. Evalúa la urgencia y severidad operativa.
    4. Cruza el problema con la Base de Conocimiento corporativa.
    5. Redacta un borrador estructurado de resolución paso a paso.
    6. Opcionalmente persiste el ticket en la BD con su log de auditoría.
    """
    analysis_raw = triage_engine.analyze(request.title, request.description)

    matched_kb = None
    if analysis_raw["matched_kb"]:
        matched_kb = MatchedKBInfo(
            id=analysis_raw["matched_kb"]["id"],
            title=analysis_raw["matched_kb"]["title"],
            category=analysis_raw["matched_kb"]["category"],
            similarity=analysis_raw["matched_kb"]["similarity"]
        )

    analysis = TriageAnalysis(
        category=analysis_raw["category"],
        urgency=analysis_raw["urgency"],
        confidence_score=analysis_raw["confidence_score"],
        sla_hours=analysis_raw["sla_hours"],
        recommended_team=analysis_raw["recommended_team"],
        reasoning=analysis_raw["reasoning"],
        suggested_solution=analysis_raw["suggested_solution"],
        matched_kb=matched_kb
    )

    ticket_created = None
    if not request.dry_run:
        new_ticket = Ticket(
            title=request.title,
            description=request.description,
            category=analysis.category,
            urgency=analysis.urgency,
            status="Abierto",
            suggested_solution=analysis.suggested_solution,
            confidence_score=analysis.confidence_score,
            matched_kb_id=matched_kb.id if matched_kb else None,
            user_email=request.user_email,
            assigned_team=analysis.recommended_team,
            sla_hours=analysis.sla_hours
        )
        db.add(new_ticket)
        db.flush()

        audit = AuditLog(
            ticket_id=new_ticket.id,
            author="AI Triage Engine",
            action="Clasificación Agéntica",
            details=(
                f"Triaje completado. Categoría: {analysis.category} | "
                f"Urgencia: {analysis.urgency} | Confianza: {int(analysis.confidence_score * 100)}% | "
                f"SOP Asociado: {matched_kb.id if matched_kb else 'Ninguno'} | "
                f"Equipo sugerido: {analysis.recommended_team}"
            )
        )
        db.add(audit)
        db.commit()
        db.refresh(new_ticket)
        ticket_created = new_ticket

    return TriageResponse(
        analysis=analysis,
        ticket=ticket_created
    )
