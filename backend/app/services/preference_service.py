"""用户偏好服务 - 用户偏好 CRUD 操作（数据库版本）"""

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import UserPreference
from app.db.models import UserPreferenceModel
import logging

logger = logging.getLogger(__name__)


class PreferenceService:
    """用户偏好服务类（数据库版本）"""

    async def get_preference(self, db: AsyncSession) -> Optional[UserPreference]:
        """
        获取用户偏好

        Args:
            db: 数据库会话

        Returns:
            用户偏好，不存在则返回 None
        """
        # 默认用户ID为 user_001
        result = await db.execute(
            select(UserPreferenceModel).where(UserPreferenceModel.id == "user_001")
        )
        preference = result.scalar_one_or_none()
        return UserPreference(**preference.to_dict()) if preference else None

    async def save_preference(
        self, preference: UserPreference, db: AsyncSession
    ) -> UserPreference:
        """
        保存用户偏好

        Args:
            preference: 用户偏好数据
            db: 数据库会话

        Returns:
            保存后的用户偏好
        """
        # 默认用户ID为 user_001
        user_id = preference.id if preference.id else "user_001"

        # 检查是否已存在
        result = await db.execute(
            select(UserPreferenceModel).where(UserPreferenceModel.id == user_id)
        )
        existing_pref = result.scalar_one_or_none()

        if existing_pref:
            # 更新现有记录
            existing_pref.cuisine_preference = preference.cuisine_preference
            existing_pref.spice_preference = (
                preference.spice_preference.value
                if hasattr(preference.spice_preference, "value")
                else preference.spice_preference
            )
            existing_pref.dietary_restrictions = preference.dietary_restrictions
            existing_pref.disliked_ingredients = preference.disliked_ingredients
            existing_pref.liked_ingredients = preference.liked_ingredients
            existing_pref.cooking_goals = preference.cooking_goals

            await db.flush()
            await db.refresh(existing_pref)

            logger.info(f"更新用户偏好: {existing_pref.cuisine_preference}")
            return UserPreference(**existing_pref.to_dict())
        else:
            # 创建新记录
            new_pref = UserPreferenceModel(
                id=user_id,
                cuisine_preference=[
                    pref.value if hasattr(pref, "value") else pref
                    for pref in preference.cuisine_preference
                ],
                spice_preference=preference.spice_preference.value
                if hasattr(preference.spice_preference, "value")
                else preference.spice_preference,
                dietary_restrictions=preference.dietary_restrictions,
                disliked_ingredients=preference.disliked_ingredients,
                liked_ingredients=preference.liked_ingredients,
                cooking_goals=preference.cooking_goals,
            )

            db.add(new_pref)
            await db.flush()
            await db.refresh(new_pref)

            logger.info(f"保存用户偏好: {new_pref.cuisine_preference}")
            return UserPreference(**new_pref.to_dict())

    async def update_preference(
        self, updates: dict, db: AsyncSession
    ) -> Optional[UserPreference]:
        """
        更新用户偏好（部分更新）

        Args:
            updates: 更新数据
            db: 数据库会话

        Returns:
            更新后的用户偏好，不存在则返回 None
        """
        result = await db.execute(
            select(UserPreferenceModel).where(UserPreferenceModel.id == "user_001")
        )
        preference = result.scalar_one_or_none()

        if not preference:
            return None

        # 更新字段
        for key, value in updates.items():
            if hasattr(preference, key) and key != "id":
                setattr(preference, key, value)

        await db.flush()
        await db.refresh(preference)

        logger.info(f"更新用户偏好")
        return UserPreference(**preference.to_dict())

    async def delete_preference(self, db: AsyncSession) -> bool:
        """
        删除用户偏好

        Args:
            db: 数据库会话

        Returns:
            是否删除成功
        """
        result = await db.execute(
            select(UserPreferenceModel).where(UserPreferenceModel.id == "user_001")
        )
        preference = result.scalar_one_or_none()

        if not preference:
            return False

        await db.delete(preference)
        await db.flush()

        logger.info(f"删除用户偏好")
        return True

    async def has_preference(self, db: AsyncSession) -> bool:
        """
        检查是否有用户偏好

        Args:
            db: 数据库会话

        Returns:
            是否存在用户偏好
        """
        result = await db.execute(
            select(UserPreferenceModel).where(UserPreferenceModel.id == "user_001")
        )
        return result.scalar_one_or_none() is not None


# 创建全局服务实例
preference_service = PreferenceService()
