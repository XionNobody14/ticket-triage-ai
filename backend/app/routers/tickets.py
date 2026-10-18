from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.database import get_db
from app.models import Ticket, AuditLog
from app.schemas import TicketResponse, TicketCreate, TicketUpdate

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

@router.get("", response_model=List[TicketResponse])
def get_tickets(
    urgency: Optional[str] = Query(None, description="Filtrar por urgencia (Baja, Media, Alta, Crítica)"),
    status: Optional[str] = Query(None, description="Filtrar por estado (Abierto, En Proceso, Resuelto)"),
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Búsqueda por texto en título, descripción o usuario"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    if urgency and urgency != "Todas":
        query = query.filter(Ticket.urgency == urgency)
    if status and status != "Todos":
        query = query.filter(Ticket.status == status)
    if category and category != "Todas":
        query = query.filter(Ticket.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.title.ilike(search_filter),
                Ticket.description.ilike(search_filter),
                Ticket.user_email.ilike(search_filter)
            )
        )

    # Ordenar por criticidad y luego por id descendente
    tickets = query.order_by(desc(Ticket.id)).offset(offset).limit(limit).all()
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket #{ticket_id} no encontrado")
    return ticket

@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db)):
    ticket = Ticket(
        title=ticket_in.title,
        description=ticket_in.description,
        category=ticket_in.category,
        urgency=ticket_in.urgency,
        status=ticket_in.status,
        suggested_solution=ticket_in.suggested_solution,
        confidence_score=ticket_in.confidence_score,
        matched_kb_id=ticket_in.matched_kb_id,
        user_email=ticket_in.user_email,
        assigned_team=ticket_in.assigned_team,
        sla_hours=ticket_in.sla_hours
    )
    db.add(ticket)
    db.flush()

    # Log inicial de auditoría
    audit = AuditLog(
        ticket_id=ticket.id,
        author="Sistema de Soporte",
        action="Creación de Ticket",
        details=f"Ticket creado con estado '{ticket.status}' y urgencia '{ticket.urgency}'."
    )
    db.add(audit)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket #{ticket_id} no encontrado")

    changes = []

    if ticket_update.status is not None and ticket_update.status != ticket.status:
        old_status = ticket.status
        ticket.status = ticket_update.status
        changes.append(f"Estado actualizado de '{old_status}' a '{ticket.status}'")

    if ticket_update.urgency is not None and ticket_update.urgency != ticket.urgency:
        old_urgency = ticket.urgency
        ticket.urgency = ticket_update.urgency
        changes.append(f"Urgencia cambiada de '{old_urgency}' a '{ticket.urgency}'")

    if ticket_update.category is not None and ticket_update.category != ticket.category:
        ticket.category = ticket_update.category
        changes.append(f"Categoría reasignada a '{ticket.category}'")

    if ticket_update.suggested_solution is not None:
        ticket.suggested_solution = ticket_update.suggested_solution
        changes.append("Solución propuesta modificada por el analista")

    if ticket_update.assigned_team is not None and ticket_update.assigned_team != ticket.assigned_team:
        ticket.assigned_team = ticket_update.assigned_team
        changes.append(f"Equipo reasignado a '{ticket.assigned_team}'")

    if ticket_update.comment:
        changes.append(f"Comentario: {ticket_update.comment}")

    if changes:
        audit = AuditLog(
            ticket_id=ticket.id,
            author="Analista de Soporte",
            action="Actualización de Ticket",
            details=" | ".join(changes)
        )
        db.add(audit)

    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket #{ticket_id} no encontrado")
    db.delete(ticket)
    db.commit()
    return None
