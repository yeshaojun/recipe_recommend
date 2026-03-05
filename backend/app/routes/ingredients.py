from fastapi import APIRouter, HTTPException
from app.models import Ingredient
from app.services.ingredient_service import ingredient_service

router = APIRouter(prefix="/ingredients", tags=["食材"])


@router.post("", response_model=Ingredient, status_code=201)
async def add_ingredient(ingredient_data: dict):
    """添加食材"""
    return ingredient_service.add_ingredient(ingredient_data)


@router.get("", response_model=list[Ingredient])
async def get_all_ingredients():
    """获取所有食材"""
    return ingredient_service.get_all_ingredients()


@router.delete("/{ingredient_id}", status_code=204)
async def delete_ingredient(ingredient_id: str):
    """删除食材"""
    deleted = ingredient_service.delete_ingredient(ingredient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="食材不存在")
    return None


@router.put("/{ingredient_id}", response_model=Ingredient)
async def update_ingredient(ingredient_id: str, updates: dict):
    """更新食材"""
    ingredient = ingredient_service.update_ingredient(ingredient_id, updates)
    if not ingredient:
        raise HTTPException(status_code=404, detail="食材不存在")
    return ingredient