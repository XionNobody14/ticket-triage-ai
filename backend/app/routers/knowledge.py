from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import KnowledgeArticle
from app.schemas import KnowledgeArticleResponse

router = APIRouter(prefix="/api/knowledge", tags=["Base de Conocimiento"])

@router.get("", response_model=List[KnowledgeArticleResponse])
def get_knowledge_articles(
    category: Optional[str] = Query(None, description="Filtrar por categoría"),
    search: Optional[str] = Query(None, description="Búsqueda por texto en título, tags o solución"),
    db: Session = Depends(get_db)
):
    query = db.query(KnowledgeArticle)
    if category and category != "Todas":
        query = query.filter(KnowledgeArticle.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            KnowledgeArticle.title.ilike(search_filter) |
            KnowledgeArticle.tags.ilike(search_filter) |
            KnowledgeArticle.problem_pattern.ilike(search_filter)
        )
    return query.all()

@router.get("/{article_id}", response_model=KnowledgeArticleResponse)
def get_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Artículo {article_id} no encontrado")
    return article
