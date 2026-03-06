"""食材服务 - 食材 CRUD 操作（数据库版本）"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.models import Ingredient
from app.db.models import IngredientModel
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class IngredientService:
    """食材服务类（数据库版本）"""

    async def get_all_ingredients(self, db: AsyncSession) -> List[Ingredient]:
        """获取所有食材"""
        result = await db.execute(select(IngredientModel))
        ingredients = result.scalars().all()
        return [Ingredient(**ing.to_dict()) for ing in ingredients]

    async def get_ingredient_by_id(
        self, ingredient_id: str, db: AsyncSession
    ) -> Optional[Ingredient]:
        """根据 ID 获取食材"""
        result = await db.execute(
            select(IngredientModel).where(IngredientModel.id == ingredient_id)
        )
        ingredient = result.scalar_one_or_none()
        return Ingredient(**ingredient.to_dict()) if ingredient else None

    async def add_ingredient(
        self, ingredient_data: dict, db: AsyncSession
    ) -> Ingredient:
        """
        添加食材

        Args:
            ingredient_data: 食材数据字典
            db: 数据库会话

        Returns:
            新创建的食材
        """
        import uuid

        # 创建食材模型
        ingredient = IngredientModel(
            id=str(uuid.uuid4()),
            name=ingredient_data.get("name", "未命名食材"),
            category=ingredient_data.get("category"),
            image=ingredient_data.get("image"),
            expiry_date=datetime.fromisoformat(ingredient_data["expiry_date"])
            if ingredient_data.get("expiry_date")
            else None,
            quantity=ingredient_data.get("quantity"),
            unit=ingredient_data.get("unit"),
        )

        db.add(ingredient)
        await db.flush()
        await db.refresh(ingredient)

        logger.info(f"添加食材: {ingredient.name} (ID: {ingredient.id})")
        return Ingredient(**ingredient.to_dict())

    async def update_ingredient(
        self, ingredient_id: str, updates: dict, db: AsyncSession
    ) -> Optional[Ingredient]:
        """
        更新食材

        Args:
            ingredient_id: 食材 ID
            updates: 更新数据
            db: 数据库会话

        Returns:
            更新后的食材，不存在则返回 None
        """
        result = await db.execute(
            select(IngredientModel).where(IngredientModel.id == ingredient_id)
        )
        ingredient = result.scalar_one_or_none()

        if not ingredient:
            return None

        # 更新字段
        for key, value in updates.items():
            if hasattr(ingredient, key) and key != "id" and key != "created_at":
                if key == "expiry_date" and value:
                    setattr(ingredient, key, datetime.fromisoformat(value))
                else:
                    setattr(ingredient, key, value)

        await db.flush()
        await db.refresh(ingredient)

        logger.info(f"更新食材: {ingredient.name} (ID: {ingredient_id})")
        return Ingredient(**ingredient.to_dict())

    async def delete_ingredient(self, ingredient_id: str, db: AsyncSession) -> bool:
        """
        删除食材

        Args:
            ingredient_id: 食材 ID
            db: 数据库会话

        Returns:
            是否删除成功
        """
        result = await db.execute(
            select(IngredientModel).where(IngredientModel.id == ingredient_id)
        )
        ingredient = result.scalar_one_or_none()

        if not ingredient:
            return False

        ingredient_name = ingredient.name
        await db.delete(ingredient)
        await db.flush()

        logger.info(f"删除食材: {ingredient_name} (ID: {ingredient_id})")
        return True

    async def search_ingredients(
        self, keyword: str, db: AsyncSession
    ) -> List[Ingredient]:
        """
        搜索食材

        Args:
            keyword: 搜索关键词
            db: 数据库会话

        Returns:
            匹配的食材列表
        """
        result = await db.execute(
            select(IngredientModel).where(
                or_(
                    IngredientModel.name.ilike(f"%{keyword}%"),
                    IngredientModel.category.ilike(f"%{keyword}%"),
                )
            )
        )
        ingredients = result.scalars().all()
        return [Ingredient(**ing.to_dict()) for ing in ingredients]

    async def get_ingredients_by_category(
        self, category: str, db: AsyncSession
    ) -> List[Ingredient]:
        """
        按分类获取食材

        Args:
            category: 食材分类
            db: 数据库会话

        Returns:
            该分类下的食材列表
        """
        result = await db.execute(
            select(IngredientModel).where(IngredientModel.category == category)
        )
        ingredients = result.scalars().all()
        return [Ingredient(**ing.to_dict()) for ing in ingredients]

    async def get_categories(self, db: AsyncSession) -> List[str]:
        """获取所有食材分类"""
        result = await db.execute(
            select(IngredientModel.category)
            .distinct()
            .where(IngredientModel.category.isnot(None))
        )
        categories = result.scalars().all()
        return sorted([cat for cat in categories if cat])

    async def get_expiring_soon(
        self, db: AsyncSession, days: int = 3
    ) -> List[Ingredient]:
        """
        获取即将过期的食材

        Args:
            db: 数据库会话
            days: 天数阈值

        Returns:
            即将过期的食材列表
        """
        from datetime import timedelta

        threshold_date = datetime.now() + timedelta(days=days)

        result = await db.execute(
            select(IngredientModel).where(
                and_(
                    IngredientModel.expiry_date.isnot(None),
                    IngredientModel.expiry_date <= threshold_date,
                )
            )
        )
        ingredients = result.scalars().all()
        return [Ingredient(**ing.to_dict()) for ing in ingredients]


# 创建全局服务实例
ingredient_service = IngredientService()
