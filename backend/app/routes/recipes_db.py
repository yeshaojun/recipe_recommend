"""菜谱路由"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    RecipeGenerationRequest,
    RecipeGenerationResponse,
    RecommendationRequest,
    ChatRequest,
    ChatResponse,
)
from app.services.recipe_service import recipe_service
from app.services.llm_service import llm_service
from app.db.database import get_db

router = APIRouter(prefix="/recipes", tags=["菜谱"])


@router.get("", response_model=list[dict])
async def get_all_recipes(db: AsyncSession = Depends(get_db)):
    """获取所有菜谱"""
    recipes = await recipe_service.get_all_recipes(db)
    return [r.model_dump() for r in recipes]


@router.get("/{recipe_id}", response_model=dict)
async def get_recipe_by_id(recipe_id: str, db: AsyncSession = Depends(get_db)):
    """获取单个菜谱详情"""
    recipe = await recipe_service.get_recipe_by_id(recipe_id, db)
    if not recipe:
        raise HTTPException(status_code=404, detail="菜谱不存在")
    return recipe.model_dump()


class RecommendationRequestWrapper(BaseModel):
    """推荐请求包装器"""

    ingredient_ids: list[str] | None = None
    cuisine: str | None = None
    difficulty: str | None = None
    max_cook_time: int | None = None
    preferences: dict | None = None


@router.post("/recommendations")
async def get_recommendations(
    request: RecommendationRequestWrapper, db: AsyncSession = Depends(get_db)
):
    """获取菜谱推荐"""
    from app.models import CuisineType, Difficulty, UserPreference

    # 转换请求
    req = RecommendationRequest(
        ingredient_ids=request.ingredient_ids,
        cuisine=CuisineType(request.cuisine) if request.cuisine else None,
        difficulty=Difficulty(request.difficulty) if request.difficulty else None,
        max_cook_time=request.max_cook_time,
        preferences=UserPreference(**request.preferences)
        if request.preferences
        else None,
    )
    result = await recipe_service.get_recommendations(req, db)
    return {
        "recommendations": [r.model_dump() for r in result.recommendations],
        "total": result.total,
        "criteria": result.criteria,
    }


@router.post("/generate", response_model=RecipeGenerationResponse)
async def generate_recipe(request: RecipeGenerationRequest):
    """使用 AI 生成菜谱"""
    try:
        from app.models import Difficulty, Recipe, RecipeIngredient
        from datetime import datetime
        import uuid

        preference_dict = (
            request.preferences.model_dump() if request.preferences else None
        )
        recipe_data = await llm_service.generate_recipe(
            ingredients=request.ingredients,
            cuisine=request.cuisine,
            preferences=preference_dict,
        )

        if not recipe_data:
            return RecipeGenerationResponse(
                success=False, error="生成菜谱失败，请稍后重试"
            )

        recipe = Recipe(
            id=str(uuid.uuid4()),
            title=recipe_data.get("title", "自定义菜谱"),
            description=recipe_data.get("description", ""),
            image="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800",
            prep_time=recipe_data.get("prep_time", 15),
            cook_time=recipe_data.get("cook_time", 20),
            servings=recipe_data.get("servings", 2),
            difficulty=Difficulty(recipe_data.get("difficulty", "medium")),
            ingredients=[
                RecipeIngredient(**ing) for ing in recipe_data.get("ingredients", [])
            ],
            steps=recipe_data.get("steps", []),
            tags=recipe_data.get("tags", ["AI生成"]),
            calories=recipe_data.get("calories"),
            protein=recipe_data.get("protein"),
        )

        return RecipeGenerationResponse(success=True, recipe=recipe)
    except Exception as e:
        return RecipeGenerationResponse(success=False, error=f"生成菜谱失败: {str(e)}")


class ChatRequestWrapper(BaseModel):
    """聊天请求包装器"""

    message: str
    history: list[dict] | None = None


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequestWrapper):
    """与 AI 烹饪助手聊天"""
    try:
        response = await llm_service.chat(request.message, request.history)
        return ChatResponse(response=response)
    except Exception as e:
        return ChatResponse(response=f"聊天失败: {str(e)}")
