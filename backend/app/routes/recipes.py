from fastapi import APIRouter
from app.models import Recipe
from app.services.recipe_service import recipe_service
from app.services.llm_service import llm_service
from app.models import RecipeGenerationRequest, RecipeGenerationResponse, RecommendationRequest

router = APIRouter(prefix="/recipes", tags=["菜谱"])


@router.get("", response_model=list[Recipe])
async def get_all_recipes():
    """获取所有菜谱"""
    return recipe_service.get_all_recipes()


@router.get("/{recipe_id}", response_model=Recipe)
async def get_recipe_by_id(recipe_id: str):
    """获取单个菜谱详情"""
    recipe = recipe_service.get_recipe_by_id(recipe_id)
    if not recipe:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="菜谱不存在")
    return recipe


@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """获取菜谱推荐"""
    return recipe_service.get_recommendations(request)


@router.post("/generate", response_model=RecipeGenerationResponse)
async def generate_recipe(request: RecipeGenerationRequest):
    """使用 AI 生成菜谱"""
    try:
        preference_dict = request.preferences.model_dump() if request.preferences else None
        recipe_data = await llm_service.generate_recipe(
            ingredients=request.ingredients,
            cuisine=request.cuisine,
            preferences=preference_dict
        )

        if not recipe_data:
            return RecipeGenerationResponse(
                success=False,
                error="生成菜谱失败，请稍后重试"
            )

        from app.models import Difficulty, Recipe, RecipeIngredient
        from datetime import datetime
        import uuid

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
            protein=recipe_data.get("protein")
        )

        return RecipeGenerationResponse(
            success=True,
            recipe=recipe
        )
    except Exception as e:
        return RecipeGenerationResponse(
            success=False,
            error=f"生成菜谱失败: {str(e)}"
        )


@router.post("/chat")
async def chat_with_ai(message: str):
    """与 AI 烹饪助手聊天"""
    try:
        response = await llm_service.chat(message)
        return {"response": response}
    except Exception as e:
        return {"error": f"聊天失败: {str(e)}"}