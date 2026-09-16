from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security.auth import get_current_user
from app.models import ChatMessage, User
from app.schemas import ChatMessageOut, ChatRequest, ChatResponse, ChatSuggestionsResponse
from app.services.chatbot_service import get_chat_suggestions, handle_chat_message

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


@router.get("/history", response_model=List[ChatMessageOut])
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.patient_id == current_user.id)
        .order_by(ChatMessage.created_at.asc())
        .limit(100)
        .all()
    )


@router.post("/message", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = {"name": current_user.full_name, "role": current_user.role.value}
    db.add(ChatMessage(patient_id=current_user.id, sender="user", message=payload.message))
    reply = handle_chat_message(payload.message, context)
    db.add(ChatMessage(patient_id=current_user.id, sender="bot", message=reply))
    db.commit()
    return ChatResponse(reply=reply)


@router.get("/suggestions", response_model=ChatSuggestionsResponse)
def suggestions(current_user: User = Depends(get_current_user)):
    context = {"name": current_user.full_name, "role": current_user.role.value}
    return ChatSuggestionsResponse(suggestions=get_chat_suggestions(context))
