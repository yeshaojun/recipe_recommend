"""食材路由"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ingredient_service import ingredient_service
from app.db.database import get_db

router = APIRouter(prefix="/ingredients", tags=["食材"])


@router.post("", response_model=dict, status_code=201)
async def add_ingredient(ingredient_data: dict, db: AsyncSession = Depends(get_db)):
    """添加食材"""
    ingredient = await ingredient_service.add_ingredient(ingredient_data, db)
    return ingredient.model_dump()


@router.get("", response_model=list[dict])
async def get_all_ingredients(db: AsyncSession = Depends(get_db)):
    """获取所有食材"""
    ingredients = await ingredient_service.get_all_ingredients(db)
    return [ing.model_dump() for ing in ingredients]


@router.get("/{ingredient_id}", response_model=dict)
async def get_ingredient_by_id(ingredient_id: str, db: AsyncSession = Depends(get_db)):
    """获取单个食材详情"""
    ingredient = await ingredient_service.get_ingredient_by_id(ingredient_id, db)
    if not ingredient:
        raise HTTPException(status_code=404, detail="食材不存在")
    return ingredient.model_dump()


@router.delete("/{ingredient_id}", status_code=204)
async def delete_ingredient(ingredient_id: str, db: AsyncSession = Depends(get_db)):
    """删除食材"""
    deleted = await ingredient_service.delete_ingredient(ingredient_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="食材不存在")
    return None


@router.put("/{ingredient_id}", response_model=dict)
async def update_ingredient(
    ingredient_id: str, updates: dict, db: AsyncSession = Depends(get_db)
):
    """更新食材"""
    ingredient = await ingredient_service.update_ingredient(ingredient_id, updates, db)
    if not ingredient:
        raise HTTPException(status_code=404, detail="食材不存在")
    return ingredient.model_dump()


@router.get("/search/{keyword}", response_model=list[dict])
async def search_ingredients(keyword: str, db: AsyncSession = Depends(get_db)):
    """搜索食材"""
    ingredients = await ingredient_service.search_ingredients(keyword, db)
    return [ing.model_dump() for ing in ingredients]


@router.get("/categories/list", response_model=list[str])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """获取所有食材分类"""
    return await ingredient_service.get_categories(db)
