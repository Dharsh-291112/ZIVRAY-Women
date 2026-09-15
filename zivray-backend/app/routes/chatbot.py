from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security.auth import get_current_user
from app.models import User
from app.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import handle_chat_message

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


@router.post("/message", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = {"name": current_user.full_name, "role": current_user.role.value}
    reply = handle_chat_message(payload.message, context)
    return ChatResponse(reply=reply)
