"""
Motor Agéntico de Triaje, Clasificación y Generación de Soluciones
"""
import re
from typing import Dict, Any, Tuple, Optional
from app.knowledge_base import DEFAULT_KNOWLEDGE_ARTICLES

# Pesos de palabras clave por categoría
CATEGORY_RULES = {
    "ERP & Finanzas": [
        "sap", "ariba", "s/4hana", "orden de compra", "po", "rfc", "sm58", "sm59", "cloud connector",
        "factura", "facturación", "erp", "asiento contable", "ordenes de compra", "proveedor", "presupuesto"
    ],
    "Firma Digital & LegalTech": [
        "doc2sign", "docusign", "adobe sign", "firma", "firmas", "firma digital", "token", "certificado",
        "nda", "contrato", "apoderado", "rúbrica", "envelope", "firmante", "legaltech"
    ],
    "Bases de Datos & SQL": [
        "sql", "mysql", "sql server", "postgres", "postgresql", "oracle", "database", "base de datos",
        "1045", "18456", "access denied", "deadlock", "bloqueo", "query", "tabla", "pool", "conexión sql", "cluster"
    ],
    "Identidad & Accesos (IAM)": [
        "okta", "azure ad", "entra id", "active directory", "mfa", "2fa", "autenticador", "contraseña",
        "password", "sso", "login", "desbloqueo de cuenta", "scim", "token expirado", "cuenta bloqueada"
    ],
    "Infraestructura & Redes": [
        "vpn", "globalprotect", "cisco", "anyconnect", "red", "wifi", "dns", "firewall", "gateway",
        "timeout de red", "ipsec", "subred", "enrutamiento", "intranet"
    ],
    "Seguridad & Accesos": [
        "edr", "crowdstrike", "defender", "antivirus", "malware", "cuarentena", "falso positivo",
        "soc", "amenaza", "phishing", "ciso", "aislado", "vulnerabilidad"
    ],
    "Productividad & Colaboración": [
        "o365", "office", "outlook", "teams", "slack", "jira", "confluence", "correo", "buzon",
        "buzón lleno", "exchange", "workflow", "permiso de proyecto", "atlassian"
    ]
}

CRITICAL_KEYWORDS = [
    "producción parada", "cluster caído", "caído", "502", "503", "bloqueo total", "todos los usuarios",
    "pérdida económica", "urgente crítico", "deadlock en prod", "ransomware", "afecta a clientes",
    "cierre contable", "impacto masivo", "interrupción total", "servidor caído", "clúster producción",
    "cluster produccion", "producción", "produccion", "todos los pagos", "pagos están fallando",
    "pagos estan fallando", "pool exhausto"
]

HIGH_KEYWORDS = [
    "urgente", "bloqueado", "no puedo trabajar", "contrato legal", "firma nda", "sin acceso a sql",
    "access denied", "deadline hoy", "mfa bloqueado directivo", "falla en facturación", "pago pendiente"
]

LOW_KEYWORDS = [
    "consulta", "duda", "pregunta", "capacitación", "configuración menor", "buzón casi lleno",
    "cambio estético", "actualización de plantilla", "sugerencia", "cuando puedan"
]

class TriageEngine:
    """Motor autónomo de triaje que clasifica incidencias y genera propuestas de solución."""

    def __init__(self, knowledge_articles=None):
        self.articles = knowledge_articles or DEFAULT_KNOWLEDGE_ARTICLES

    def _clean_tokens(self, text: str) -> set:
        """Limpia y tokeniza el texto para análisis de coincidencias."""
        text = text.lower()
        words = re.findall(r'[a-záéíóúüñ0-9_/-]{3,}', text)
        return set(words)

    def classify_category(self, text: str) -> Tuple[str, float]:
        """Determina la categoría con mayor densidad semántica."""
        lower_text = text.lower()
        scores = {}

        for category, keywords in CATEGORY_RULES.items():
            match_count = 0
            for kw in keywords:
                if kw in lower_text:
                    match_count += (2 if " " in kw else 1)
            scores[category] = match_count

        best_category = max(scores, key=scores.get)
        max_score = scores[best_category]

        if max_score == 0:
            return "Productividad & Colaboración", 0.65

        # Normalizar confianza de categoría
        confidence = min(0.96, 0.75 + (max_score * 0.05))
        return best_category, confidence

    def determine_urgency(self, text: str) -> Tuple[str, int]:
        """Calcula nivel de urgencia y SLA en horas."""
        lower_text = text.lower()

        for kw in CRITICAL_KEYWORDS:
            if kw in lower_text:
                return "Crítica", 2

        for kw in HIGH_KEYWORDS:
            if kw in lower_text:
                return "Alta", 6

        for kw in LOW_KEYWORDS:
            if kw in lower_text:
                return "Baja", 48

        return "Media", 12

    def match_knowledge_base(self, text: str, category: str) -> Tuple[Optional[Dict[str, Any]], float]:
        """Busca el artículo de soporte con mayor similitud léxica y semántica."""
        text_tokens = self._clean_tokens(text)
        best_match = None
        best_score = 0.0

        for article in self.articles:
            article_text = f"{article['title']} {article['tags']} {article['problem_pattern']}"
            article_tokens = self._clean_tokens(article_text)

            intersection = text_tokens.intersection(article_tokens)
            if not intersection:
                continue

            # Jaccard / Overlap modificado con bonus si coincide la categoría
            overlap = len(intersection) / max(1, len(text_tokens.union(article_tokens)))
            score = overlap * 1.5

            if article.get("category") == category:
                score += 0.35

            # Bonificación por tags coincidentes
            for tag in article.get("tags", "").split(","):
                if tag.strip() and tag.strip().lower() in text.lower():
                    score += 0.15

            if score > best_score:
                best_score = score
                best_match = article

        # Normalizar similitud entre 0.0 y 0.99
        normalized_sim = min(0.98, max(0.50, round(best_score, 2))) if best_match else 0.50
        return best_match, normalized_sim

    def generate_solution_draft(self, title: str, description: str, category: str, urgency: str, matched_kb: Optional[Dict[str, Any]]) -> str:
        """Redacta una propuesta de resolución técnica estructurada y profesional."""
        kb_title = matched_kb["title"] if matched_kb else "Procedimiento Estándar de Soporte L2"
        kb_id = matched_kb["id"] if matched_kb else "SOP-GEN-001"
        kb_steps = matched_kb["solution_steps"] if matched_kb else (
            "1. Validar el alcance del incidente con el usuario solicitante.\n"
            "2. Recopilar capturas de pantalla y registros de eventos locales.\n"
            "3. Verificar estado de servicios dependientes en la matriz de infraestructura.\n"
            "4. Aplicar corrección estándar y documentar en la bitácora del ticket."
        )

        return (
            f"### 📋 Análisis y Diagnóstico Agéntico de Soporte\n\n"
            f"**Incidencia Detectada:** {title}\n"
            f"**Severidad Operativa Evaluada:** {urgency}\n"
            f"**Clasificación de Dominio:** {category}\n"
            f"**Procedimiento Base Asociado:** [{kb_id}] {kb_title}\n\n"
            f"#### 🔍 Diagnóstico Técnico Preliminar:\n"
            f"A partir del análisis de la telemetría textual reportada, se identificó un comportamiento consistente con:\n"
            f"- Bloqueo funcional o pérdida de sincronización en el entorno corporativo.\n"
            f"- Restricción transaccional que impide la continuidad operativa del usuario.\n\n"
            f"#### 🛠️ Plan de Resolución Paso a Paso Recomendado:\n"
            f"{kb_steps}\n\n"
            f"#### 🔒 Verificación y Validación de Cierre:\n"
            f"- Solicitar confirmación activa al usuario ({description[:60]}...).\n"
            f"- Comprobar que no persistan registros de alerta en la consola de administración.\n"
            f"- Registrar tiempo de mitigación y asociar al reporte mensual de SLA."
        )

    def analyze(self, title: str, description: str) -> Dict[str, Any]:
        """Ejecuta el pipeline completo de triaje agéntico."""
        full_text = f"{title} {description}"

        category, cat_conf = self.classify_category(full_text)
        urgency, sla_hours = self.determine_urgency(full_text)
        matched_kb, similarity = self.match_knowledge_base(full_text, category)

        # Determinar equipo recomendado
        recommended_team = matched_kb.get("escalation_team") if matched_kb else "Mesa de Ayuda General"

        # Confianza consolidada
        confidence = round(min(0.98, max(0.82, (cat_conf * 0.6) + (similarity * 0.4))), 2)

        # Generar propuesta de solución
        suggested_solution = self.generate_solution_draft(title, description, category, urgency, matched_kb)

        reasoning = (
            f"Clasificado en '{category}' con urgencia '{urgency}' (SLA estimado: {sla_hours}h) "
            f"debido a patrones léxicos y criticidad identificada. "
            f"Asociado al procedimiento estándar '{matched_kb['id'] if matched_kb else 'GENERIC'}' "
            f"con índice de correspondencia del {int(similarity * 100)}%."
        )

        matched_kb_info = None
        if matched_kb:
            matched_kb_info = {
                "id": matched_kb["id"],
                "title": matched_kb["title"],
                "category": matched_kb["category"],
                "similarity": similarity
            }

        return {
            "category": category,
            "urgency": urgency,
            "confidence_score": confidence,
            "sla_hours": sla_hours,
            "recommended_team": recommended_team,
            "reasoning": reasoning,
            "suggested_solution": suggested_solution,
            "matched_kb": matched_kb_info
        }

# Instancia singleton del motor
triage_engine = TriageEngine()
