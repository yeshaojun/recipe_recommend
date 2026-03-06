"""Pydantic 数据模型定义"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime


# ========== 枚举类型 ==========


class Difficulty(str, Enum):
    """难度级别"""

    easy = "easy"
    medium = "medium"
    hard = "hard"


class SpiceLevel(str, Enum):
    """辣度级别"""

    none = "none"
    mild = "mild"
    medium = "medium"
    hot = "hot"


class CuisineType(str, Enum):
    """菜系类型"""

    chinese = "chinese"
    western = "western"
    japanese = "japanese"
    korean = "korean"
    thai = "thai"
    indian = "indian"
    italian = "italian"
    french = "french"
    mexican = "mexican"
    other = "other"


# ========== 基础模型 ==========


class Ingredient(BaseModel):
    """食材模型"""

    id: str
    name: str = Field(..., description="食材名称")
    category: Optional[str] = Field(None, description="食材分类")
    image: Optional[str] = Field(None, description="食材图片URL")
    expiry_date: Optional[str] = Field(None, description="过期日期 ISO 8601")
    quantity: Optional[float] = Field(None, description="数量")
    unit: Optional[str] = Field(None, description="单位")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "name": "鸡蛋",
                "category": "蛋类",
                "quantity": 6.0,
                "unit": "个",
            }
        }


class RecipeIngredient(BaseModel):
    """菜谱食材"""

    name: str = Field(..., description="食材名称")
    quantity: str = Field(..., description="数量（如：2个、200g）")
    optional: bool = Field(default=False, description="是否可选")


class Recipe(BaseModel):
    """菜谱模型"""

    id: str
    title: str = Field(..., description="菜谱标题")
    description: Optional[str] = Field(None, description="菜谱描述")
    image: Optional[str] = Field(None, description="菜谱图片URL")
    prep_time: int = Field(..., description="准备时间（分钟）")
    cook_time: int = Field(..., description="烹饪时间（分钟）")
    servings: int = Field(..., description="份数")
    difficulty: Difficulty = Field(default=Difficulty.medium, description="难度级别")
    ingredients: List[RecipeIngredient] = Field(..., description="食材列表")
    steps: List[str] = Field(..., description="制作步骤")
    tags: List[str] = Field(default_factory=list, description="标签")
    cuisine: Optional[CuisineType] = Field(None, description="菜系类型")
    calories: Optional[int] = Field(None, description="卡路里")
    protein: Optional[float] = Field(None, description="蛋白质（克）")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "title": "番茄炒蛋",
                "description": "经典家常菜",
                "prep_time": 10,
                "cook_time": 15,
                "servings": 2,
                "difficulty": "easy",
                "ingredients": [
                    {"name": "鸡蛋", "quantity": "2个", "optional": False},
                    {"name": "番茄", "quantity": "2个", "optional": False},
                ],
                "steps": ["打蛋", "切番茄", "炒蛋", "炒番茄", "混合"],
                "tags": ["家常菜", "快手菜"],
            }
        }


class UserPreference(BaseModel):
    """用户偏好模型"""

    id: Optional[str] = None
    cuisine_preference: List[CuisineType] = Field(
        default_factory=list, description="喜欢的菜系"
    )
    spice_preference: SpiceLevel = Field(
        default=SpiceLevel.mild, description="辣度偏好"
    )
    dietary_restrictions: List[str] = Field(
        default_factory=list, description="饮食限制（如：素食、无糖）"
    )
    disliked_ingredients: List[str] = Field(
        default_factory=list, description="不喜欢的食材"
    )
    liked_ingredients: List[str] = Field(default_factory=list, description="喜欢的食材")
    cooking_goals: List[str] = Field(
        default_factory=list, description="烹饪目标（如：减肥、增肌）"
    )
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "cuisine_preference": ["chinese", "italian"],
                "spice_preference": "mild",
                "dietary_restrictions": [],
                "disliked_ingredients": ["香菜"],
                "liked_ingredients": ["牛肉", "鸡肉"],
            }
        }


# ========== 请求/响应模型 ==========


class RecommendationRequest(BaseModel):
    """菜谱推荐请求"""

    ingredient_ids: Optional[List[str]] = Field(default=None, description="食材ID列表")
    cuisine: Optional[CuisineType] = Field(default=None, description="指定菜系")
    difficulty: Optional[Difficulty] = Field(default=None, description="指定难度")
    max_cook_time: Optional[int] = Field(None, description="最大烹饪时间（分钟）")
    preferences: Optional[UserPreference] = Field(default=None, description="用户偏好")


class RecommendationResponse(BaseModel):
    """菜谱推荐响应"""

    recommendations: List[Recipe] = Field(..., description="推荐的菜谱列表")
    total: int = Field(..., description="推荐总数")
    criteria: dict = Field(..., description="推荐条件")


class RecipePreferences(BaseModel):
    """菜谱生成偏好"""

    cuisine: Optional[CuisineType] = Field(default=None, description="菜系")
    spice_level: Optional[SpiceLevel] = Field(default=None, description="辣度")
    difficulty: Optional[Difficulty] = Field(default=None, description="难度")
    dietary_restrictions: Optional[List[str]] = Field(
        default=None, description="饮食限制"
    )


class RecipeGenerationRequest(BaseModel):
    """AI 生成菜谱请求"""

    ingredients: List[str] = Field(..., description="现有食材名称列表", min_length=1)
    cuisine: Optional[str] = Field(default=None, description="指定菜系")
    preferences: Optional[RecipePreferences] = Field(
        default=None, description="烹饪偏好"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "ingredients": ["鸡蛋", "番茄", "面条"],
                "cuisine": "中式",
                "preferences": {"spice_level": "mild", "difficulty": "easy"},
            }
        }


class RecipeGenerationResponse(BaseModel):
    """AI 生成菜谱响应"""

    success: bool = Field(..., description="是否成功")
    recipe: Optional[Recipe] = Field(None, description="生成的菜谱")
    error: Optional[str] = Field(None, description="错误信息")


class ChatMessage(BaseModel):
    """聊天消息"""

    role: str = Field(..., description="角色：user/assistant")
    content: str = Field(..., description="消息内容")


class ChatRequest(BaseModel):
    """聊天请求"""

    message: str = Field(..., description="用户消息", min_length=1)
    history: Optional[List[ChatMessage]] = Field(default=None, description="对话历史")


class ChatResponse(BaseModel):
    """聊天响应"""

    response: str = Field(..., description="AI回复内容")


class OCRResult(BaseModel):
    """OCR 识别结果"""

    text: str = Field(..., description="识别的文本")
    confidence: Optional[float] = Field(None, description="置信度")
    ingredients: Optional[List[str]] = Field(None, description="提取的食材列表")


class HealthResponse(BaseModel):
    """健康检查响应"""

    status: str = "ok"
    app: str
    version: str
    timestamp: str


class ErrorResponse(BaseModel):
    """错误响应"""

    detail: str = Field(..., description="错误详情")
