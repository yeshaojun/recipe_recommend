from fastapi import APIRouter, HTTPException
from app.models import UserPreference
from app.services.preference_service import preference_service

router = APIRouter(prefix="/preferences", tags=["用户偏好"])


@router.post("", response_model=UserPreference, status_code=201)
async def save_preference(preference: UserPreference):
    """保存用户偏好"""
    return preference_service.save_preference(preference)


@router.get("", response_model=UserPreference)
async def get_preference():
    """获取用户偏好"""
    preference = preference_service.get_preference()
    if not preference:
        raise HTTPException(status_code=404, detail="用户偏好不存在")
    return preference