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

def test_demo_access_key_protection(monkeypatch):
    # Set DEMO_ACCESS_KEY for this test
    monkeypatch.setenv("DEMO_ACCESS_KEY", "TestSecretKey123")

    # 1. Public routes should remain accessible without key
    assert client.get("/api/health").status_code == 200
    assert client.get("/docs").status_code == 200
    assert client.get("/").status_code == 200

    # 2. Protected routes should return 401 Unauthorized without key
    res_unauth = client.get("/api/tickets")
    assert res_unauth.status_code == 401

    # 3. Protected routes with wrong key should return 401
    res_wrong = client.get("/api/tickets", headers={"X-Demo-Key": "WrongKey"})
    assert res_wrong.status_code == 401

    # 4. Protected routes with valid X-Demo-Key header should succeed
    res_valid_header = client.get("/api/tickets", headers={"X-Demo-Key": "TestSecretKey123"})
    assert res_valid_header.status_code == 200

    # 5. Protected routes with valid Authorization: Bearer should succeed
    res_valid_bearer = client.get("/api/tickets", headers={"Authorization": "Bearer TestSecretKey123"})
    assert res_valid_bearer.status_code == 200

def test_enterprise_login():
    # Login con credenciales válidas del admin
    res = client.post("/api/auth/login", json={
        "email": "admin@xion.com",
        "password": "Heartless2003"
    })
    assert res.status_code == 200
    data = res.json()
    assert "token" in data
    assert data["user"]["email"] == "admin@xion.com"
    assert data["user"]["role"] == "admin"

    # Login con contraseña incorrecta
    res_invalid = client.post("/api/auth/login", json={
        "email": "admin@xion.com",
        "password": "WrongPassword123"
    })
    assert res_invalid.status_code == 401

def test_admin_user_provisioning():
    # Obtener token de admin
    login_res = client.post("/api/auth/login", json={
        "email": "admin@xion.com",
        "password": "Heartless2003"
    })
    token = login_res.json()["token"]
    admin_headers = {"Authorization": f"Bearer {token}"}

    # Crear nuevo agente
    import time
    test_email = f"soporte_{int(time.time())}@xion.com"
    create_res = client.post("/api/users", headers=admin_headers, json={
        "email": test_email,
        "password": "TemporalPass2026",
        "full_name": "Agente Operacional L1",
        "role": "agent"
    })
    assert create_res.status_code == 201
    created_user = create_res.json()
    assert created_user["email"] == test_email
    assert created_user["role"] == "agent"
    assert "hashed_password" not in created_user

    # Verificar que el agente puede iniciar sesión
    agent_login = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "TemporalPass2026"
    })
    assert agent_login.status_code == 200
    agent_token = agent_login.json()["token"]

    # El agente ordinario NO debe poder crear usuarios (403 Forbidden)
    forbidden_res = client.post("/api/users", headers={"Authorization": f"Bearer {agent_token}"}, json={
        "email": "otro@xion.com",
        "password": "123456",
        "role": "agent"
    })
    assert forbidden_res.status_code == 403

    # El admin puede listar usuarios
    list_res = client.get("/api/users", headers=admin_headers)
    assert list_res.status_code == 200
    users_list = list_res.json()
    assert len(users_list) >= 2


