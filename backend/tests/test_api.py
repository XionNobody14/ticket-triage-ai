import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ticket-triage-ai"

def test_get_tickets():
    response = client.get("/api/tickets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 10
    first = data[0]
    assert "title" in first
    assert "urgency" in first
    assert "status" in first
    assert "audit_logs" in first

def test_filter_tickets_by_urgency():
    response = client.get("/api/tickets?urgency=Crítica")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    for ticket in data:
        assert ticket["urgency"] == "Crítica"

def test_get_ticket_detail():
    response = client.get("/api/tickets/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert "audit_logs" in data
    assert len(data["audit_logs"]) > 0

def test_patch_ticket():
    patch_payload = {
        "status": "En Proceso",
        "comment": "Revisando trazas RFC con el equipo de infraestructura"
    }
    response = client.patch("/api/tickets/1", json=patch_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "En Proceso"

def test_triage_dry_run():
    triage_payload = {
        "title": "Fallo crítico en SAP Ariba al aprobar pedido de compra",
        "description": "Error HTTP 502 Bad Gateway continuo al aprobar PO en SAP Ariba. Los pedidos están bloqueados en Cloud Connector.",
        "dry_run": True
    }
    response = client.post("/api/triage", json=triage_payload)
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    analysis = data["analysis"]
    assert analysis["category"] == "ERP & Finanzas"
    assert analysis["urgency"] == "Crítica"
    assert analysis["matched_kb"]["id"] == "KB-SAP-001"
    assert data["ticket"] is None

def test_triage_persist_ticket():
    triage_payload = {
        "title": "Error 1045 Access Denied en base de datos MySQL Clúster Producción",
        "description": "El microservicio de facturación no puede autenticar contra la base de datos MySQL debido a un error 1045 Access Denied for user 'billing_svc'. Todos los pagos están fallando.",
        "user_email": "devops@empresa.com",
        "dry_run": False
    }
    response = client.post("/api/triage", json=triage_payload)
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert data["ticket"] is not None
    ticket = data["ticket"]
    assert ticket["category"] == "Bases de Datos & SQL"
    assert ticket["urgency"] == "Crítica"
    assert ticket["matched_kb_id"] == "KB-SQL-003"
    assert len(ticket["audit_logs"]) > 0

def test_get_analytics():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_tickets"] >= 10
    assert "open_tickets" in data
    assert "resolved_tickets" in data
    assert "categories" in data
    assert len(data["categories"]) > 0

def test_get_knowledge():
    response = client.get("/api/knowledge")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 8
    first = data[0]
    assert "id" in first
    assert "title" in first
    assert "solution_steps" in first
