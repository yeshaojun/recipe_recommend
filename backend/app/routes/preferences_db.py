"""用户偏好路由"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.preference_service import preference_service
from app.db.database import get_db

router = APIRouter(prefix="/preferences", tags=["用户偏好"])


@router.post("", response_model=dict, status_code=201)
async def save_preference(preference: dict, db: AsyncSession = Depends(get_db)):
    """保存用户偏好"""
    from app.models import UserPreference

    pref = UserPreference(**preference)
    saved_pref = await preference_service.save_preference(pref, db)
    return saved_pref.model_dump()


@router.get("", response_model=dict)
async def get_preference(db: AsyncSession = Depends(get_db)):
    """获取用户偏好"""
    preference = await preference_service.get_preference(db)
    if not preference:
        raise HTTPException(status_code=404, detail="用户偏好不存在")
    return preference.model_dump()


@router.put("", response_model=dict)
async def update_preference(updates: dict, db: AsyncSession = Depends(get_db)):
    """更新用户偏好"""
    preference = await preference_service.update_preference(updates, db)
    if not preference:
        raise HTTPException(status_code=404, detail="用户偏好不存在")
    return preference.model_dump()


@router.delete("", status_code=204)
async def delete_preference(db: AsyncSession = Depends(get_db)):
    """删除用户偏好"""
    deleted = await preference_service.delete_preference(db)
    if not deleted:
        raise HTTPException(status_code=404, detail="用户偏好不存在")
    return None
