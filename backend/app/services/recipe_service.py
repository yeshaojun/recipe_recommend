"""菜谱服务 - 菜谱管理和推荐逻辑（数据库版本）"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.models import (
    Recipe,
    RecommendationRequest,
    RecommendationResponse,
    Difficulty,
    CuisineType,
    RecipeIngredient,
)
from app.db.models import RecipeModel, RecipeIngredientModel
import logging

logger = logging.getLogger(__name__)


class RecipeService:
    """菜谱服务类（数据库版本）"""

    async def get_all_recipes(self, db: AsyncSession) -> List[Recipe]:
        """获取所有菜谱"""
        result = await db.execute(select(RecipeModel))
        recipes = result.scalars().all()
        return [Recipe(**recipe.to_dict()) for recipe in recipes]

    async def get_recipe_by_id(
        self, recipe_id: str, db: AsyncSession
    ) -> Optional[Recipe]:
        """根据 ID 获取菜谱"""
        result = await db.execute(
            select(RecipeModel).where(RecipeModel.id == recipe_id)
        )
        recipe = result.scalar_one_or_none()
        return Recipe(**recipe.to_dict()) if recipe else None

    async def add_recipe(self, recipe_data: dict, db: AsyncSession) -> Recipe:
        """
        添加菜谱

        Args:
            recipe_data: 菜谱数据
            db: 数据库会话

        Returns:
            新创建的菜谱
        """
        import uuid

        # 创建菜谱模型
        recipe = RecipeModel(
            id=str(uuid.uuid4()),
            title=recipe_data.get("title"),
            description=recipe_data.get("description"),
            image=recipe_data.get("image"),
            prep_time=recipe_data.get("prep_time", 0),
            cook_time=recipe_data.get("cook_time", 0),
            servings=recipe_data.get("servings", 1),
            difficulty=recipe_data.get("difficulty", "medium"),
            cuisine=recipe_data.get("cuisine"),
            tags=recipe_data.get("tags", []),
            steps=recipe_data.get("steps", []),
            calories=recipe_data.get("calories"),
            protein=recipe_data.get("protein"),
        )

        db.add(recipe)
        await db.flush()
        await db.refresh(recipe)

        # 添加食材
        ingredients_data = recipe_data.get("ingredients", [])
        for ing_data in ingredients_data:
            ingredient = RecipeIngredientModel(
                recipe_id=recipe.id,
                name=ing_data.get("name"),
                quantity=ing_data.get("quantity"),
                optional=1 if ing_data.get("optional", False) else 0,
            )
            db.add(ingredient)

        await db.flush()
        await db.refresh(recipe)

        logger.info(f"添加菜谱: {recipe.title} (ID: {recipe.id})")
        return Recipe(**recipe.to_dict())

    async def update_recipe(
        self, recipe_id: str, updates: dict, db: AsyncSession
    ) -> Optional[Recipe]:
        """
        更新菜谱

        Args:
            recipe_id: 菜谱 ID
            updates: 更新数据
            db: 数据库会话

        Returns:
            更新后的菜谱
        """
        result = await db.execute(
            select(RecipeModel).where(RecipeModel.id == recipe_id)
        )
        recipe = result.scalar_one_or_none()

        if not recipe:
            return None

        # 更新字段
        for key, value in updates.items():
            if hasattr(recipe, key) and key not in ["id", "created_at", "ingredients"]:
                if key in ["tags", "steps"]:
                    setattr(recipe, key, value)
                else:
                    setattr(recipe, key, value)

        # 如果更新食材
        if "ingredients" in updates:
            # 删除原有食材
            await db.execute(
                select(RecipeIngredientModel).where(
                    RecipeIngredientModel.recipe_id == recipe_id
                )
            )
            # 添加新食材
            for ing_data in updates["ingredients"]:
                ingredient = RecipeIngredientModel(
                    recipe_id=recipe.id,
                    name=ing_data.get("name"),
                    quantity=ing_data.get("quantity"),
                    optional=1 if ing_data.get("optional", False) else 0,
                )
                db.add(ingredient)

        await db.flush()
        await db.refresh(recipe)

        logger.info(f"更新菜谱: {recipe.title} (ID: {recipe_id})")
        return Recipe(**recipe.to_dict())

    async def delete_recipe(self, recipe_id: str, db: AsyncSession) -> bool:
        """
        删除菜谱

        Args:
            recipe_id: 菜谱 ID
            db: 数据库会话

        Returns:
            是否删除成功
        """
        result = await db.execute(
            select(RecipeModel).where(RecipeModel.id == recipe_id)
        )
        recipe = result.scalar_one_or_none()

        if not recipe:
            return False

        recipe_name = recipe.title
        await db.delete(recipe)
        await db.flush()

        logger.info(f"删除菜谱: {recipe_name} (ID: {recipe_id})")
        return True

    async def get_recommendations(
        self, request: RecommendationRequest, db: AsyncSession
    ) -> RecommendationResponse:
        """
        根据条件推荐菜谱

        Args:
            request: 推荐请求参数
            db: 数据库会话

        Returns:
            推荐响应
        """
        # 构建查询条件
        conditions = []

        if request.cuisine:
            conditions.append(RecipeModel.cuisine == request.cuisine.value)

        if request.difficulty:
            conditions.append(RecipeModel.difficulty == request.difficulty.value)

        if request.max_cook_time:
            conditions.append(RecipeModel.cook_time <= request.max_cook_time)

        # 执行查询
        result = await db.execute(
            select(RecipeModel).where(and_(*conditions))
            if conditions
            else select(RecipeModel)
        )
        recipes = result.scalars().all()

        # 根据用户偏好过滤
        if request.preferences:
            prefs = request.preferences

            # 过滤不喜欢食材
            if prefs.disliked_ingredients:
                for disliked in prefs.disliked_ingredients:
                    recipes = [
                        r
                        for r in recipes
                        if not any(disliked in ing.name for ing in r.ingredients)
                    ]

            # 匹配喜欢的食材
            if prefs.liked_ingredients:
                recipes = sorted(
                    recipes,
                    key=lambda r: sum(
                        1
                        for ing in r.ingredients
                        if any(liked in ing.name for liked in prefs.liked_ingredients)
                    ),
                    reverse=True,
                )

        # 如果指定了食材ID，优先推荐包含这些食材的菜谱
        if request.ingredient_ids:
            # 这里简化处理，实际需要根据ID查找食材名称
            # 然后匹配菜谱中的食材
            recipes = recipes[:10]

        # 转换为 Recipe 对象
        recipe_objs = [Recipe(**recipe.to_dict()) for recipe in recipes]

        # 限制返回数量
        recommendations = recipe_objs[:8]

        # 构建响应
        criteria = {}
        if request.cuisine:
            criteria["cuisine"] = request.cuisine.value
        if request.difficulty:
            criteria["difficulty"] = request.difficulty.value
        if request.max_cook_time:
            criteria["max_cook_time"] = request.max_cook_time

        return RecommendationResponse(
            recommendations=recommendations,
            total=len(recommendations),
            criteria=criteria,
        )

    async def search_recipes(
        self,
        keyword: Optional[str] = None,
        tags: Optional[List[str]] = None,
        db: AsyncSession = None,
    ) -> List[Recipe]:
        """
        搜索菜谱

        Args:
            keyword: 关键词
            tags: 标签列表
            db: 数据库会话

        Returns:
            匹配的菜谱列表
        """
        conditions = []

        if keyword:
            conditions.append(
                or_(
                    RecipeModel.title.ilike(f"%{keyword}%"),
                    RecipeModel.description.ilike(f"%{keyword}%"),
                )
            )

        if tags:
            conditions.append(or_(RecipeModel.tags.contains(tag) for tag in tags))

        result = await db.execute(
            select(RecipeModel).where(and_(*conditions))
            if conditions
            else select(RecipeModel)
        )
        recipes = result.scalars().all()
        return [Recipe(**recipe.to_dict()) for recipe in recipes]


# 创建全局服务实例
recipe_service = RecipeService()
