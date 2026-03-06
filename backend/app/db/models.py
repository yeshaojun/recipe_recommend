"""数据库 ORM 模型定义"""

from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import json


class IngredientModel(Base):
    """食材表"""

    __tablename__ = "ingredients"

    id = Column(String(50), primary_key=True, index=True, comment="食材ID")
    name = Column(String(100), nullable=False, index=True, comment="食材名称")
    category = Column(String(50), nullable=True, comment="食材分类")
    image = Column(String(500), nullable=True, comment="食材图片URL")
    expiry_date = Column(DateTime, nullable=True, comment="过期日期")
    quantity = Column(Float, nullable=True, comment="数量")
    unit = Column(String(20), nullable=True, comment="单位")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间"
    )

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "image": self.image,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "quantity": self.quantity,
            "unit": self.unit,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class RecipeModel(Base):
    """菜谱表"""

    __tablename__ = "recipes"

    id = Column(String(50), primary_key=True, index=True, comment="菜谱ID")
    title = Column(String(200), nullable=False, index=True, comment="菜谱标题")
    description = Column(Text, nullable=True, comment="菜谱描述")
    image = Column(String(500), nullable=True, comment="菜谱图片URL")
    prep_time = Column(Integer, nullable=False, comment="准备时间（分钟）")
    cook_time = Column(Integer, nullable=False, comment="烹饪时间（分钟）")
    servings = Column(Integer, nullable=False, comment="份数")
    difficulty = Column(String(20), nullable=False, comment="难度：easy/medium/hard")
    cuisine = Column(String(30), nullable=True, comment="菜系类型")
    tags = Column(JSON, nullable=True, comment="标签列表（JSON）")
    steps = Column(JSON, nullable=False, comment="制作步骤（JSON）")
    calories = Column(Integer, nullable=True, comment="卡路里")
    protein = Column(Float, nullable=True, comment="蛋白质（克）")
    created_at = Column(DateTime, server_default=func.now(), comment="创建时间")
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间"
    )

    # 关系：菜谱 -> 食材
    ingredients = relationship(
        "RecipeIngredientModel",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "image": self.image,
            "prep_time": self.prep_time,
            "cook_time": self.cook_time,
            "servings": self.servings,
            "difficulty": self.difficulty,
            "cuisine": self.cuisine,
            "tags": self.tags if self.tags else [],
            "steps": self.steps if self.steps else [],
            "calories": self.calories,
            "protein": self.protein,
            "ingredients": [ing.to_dict() for ing in self.ingredients],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class RecipeIngredientModel(Base):
    """菜谱食材关联表"""

    __tablename__ = "recipe_ingredients"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="自增ID")
    recipe_id = Column(
        String(50),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="菜谱ID",
    )
    name = Column(String(100), nullable=False, comment="食材名称")
    quantity = Column(String(50), nullable=False, comment="数量")
    optional = Column(
        Integer, nullable=False, default=0, comment="是否可选：0-否，1-是"
    )

    # 关系：食材 -> 菜谱
    recipe = relationship("RecipeModel", back_populates="ingredients")

    def to_dict(self):
        """转换为字典"""
        return {
            "name": self.name,
            "quantity": self.quantity,
            "optional": bool(self.optional),
        }


class UserPreferenceModel(Base):
    """用户偏好表"""

    __tablename__ = "user_preferences"

    id = Column(
        String(50), primary_key=True, index=True, comment="用户ID（默认user_001）"
    )
    cuisine_preference = Column(JSON, nullable=True, comment="喜欢的菜系（JSON）")
    spice_preference = Column(
        String(20), nullable=False, default="mild", comment="辣度偏好"
    )
    dietary_restrictions = Column(JSON, nullable=True, comment="饮食限制（JSON）")
    disliked_ingredients = Column(JSON, nullable=True, comment="不喜欢的食材（JSON）")
    liked_ingredients = Column(JSON, nullable=True, comment="喜欢的食材（JSON）")
    cooking_goals = Column(JSON, nullable=True, comment="烹饪目标（JSON）")
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), comment="更新时间"
    )

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "cuisine_preference": self.cuisine_preference
            if self.cuisine_preference
            else [],
            "spice_preference": self.spice_preference,
            "dietary_restrictions": self.dietary_restrictions
            if self.dietary_restrictions
            else [],
            "disliked_ingredients": self.disliked_ingredients
            if self.disliked_ingredients
            else [],
            "liked_ingredients": self.liked_ingredients
            if self.liked_ingredients
            else [],
            "cooking_goals": self.cooking_goals if self.cooking_goals else [],
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
