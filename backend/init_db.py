"""数据库初始化脚本"""

import asyncio
import sys
from sqlalchemy import text
from app.db.database import init_db, engine
from app.db.models import (
    IngredientModel,
    RecipeModel,
    RecipeIngredientModel,
    UserPreferenceModel,
)
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_database_if_not_exists():
    """如果数据库不存在则创建"""
    # 连接到 MySQL 服务器（不指定数据库）
    db_url = (
        f"mysql+aiomysql://{settings.database_user}:{settings.database_password}"
        f"@{settings.database_host}:{settings.database_port}"
    )

    from sqlalchemy.ext.asyncio import create_async_engine

    temp_engine = create_async_engine(db_url, echo=False)

    try:
        async with temp_engine.begin() as conn:
            # 检查数据库是否存在
            result = await conn.execute(
                text(
                    f"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{settings.database_name}'"
                )
            )
            db_exists = result.fetchone() is not None

            if not db_exists:
                # 创建数据库
                await conn.execute(
                    text(
                        f"CREATE DATABASE `{settings.database_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                    )
                )
                logger.info(f"数据库 {settings.database_name} 创建成功")
            else:
                logger.info(f"数据库 {settings.database_name} 已存在")

        await temp_engine.dispose()
    except Exception as e:
        logger.error(f"创建数据库失败: {e}")
        await temp_engine.dispose()
        raise


async def init_sample_data():
    """初始化示例数据"""
    async with engine.begin() as conn:
        # 清空现有数据
        await conn.execute(text("DELETE FROM recipe_ingredients"))
        await conn.execute(text("DELETE FROM user_preferences"))
        await conn.execute(text("DELETE FROM recipes"))
        await conn.execute(text("DELETE FROM ingredients"))

        # 插入示例食材
        ingredients_data = [
            ("1", "鸡蛋", "蛋类", None, None, 6.0, "个"),
            ("2", "番茄", "蔬菜", None, None, 4.0, "个"),
            ("3", "土豆", "蔬菜", None, None, 3.0, "个"),
            ("4", "牛肉", "肉类", None, None, 500.0, "g"),
            ("5", "鸡肉", "肉类", None, None, 300.0, "g"),
            ("6", "洋葱", "蔬菜", None, None, 2.0, "个"),
            ("7", "胡萝卜", "蔬菜", None, None, 2.0, "根"),
            ("8", "葱", "蔬菜", None, None, 5.0, "根"),
            ("9", "蒜", "蔬菜", None, None, 1.0, "头"),
            ("10", "姜", "蔬菜", None, None, 1.0, "块"),
            ("11", "意大利面", "主食", None, None, 500.0, "g"),
            ("12", "咖喱块", "调味品", None, None, 8.0, "块"),
        ]

        for ing in ingredients_data:
            await conn.execute(
                text(
                    "INSERT INTO ingredients (id, name, category, image, expiry_date, quantity, unit) VALUES (:id, :name, :category, :image, :expiry_date, :quantity, :unit)"
                ),
                {
                    "id": ing[0],
                    "name": ing[1],
                    "category": ing[2],
                    "image": ing[3],
                    "expiry_date": ing[4],
                    "quantity": ing[5],
                    "unit": ing[6],
                },
            )

        logger.info(f"插入 {len(ingredients_data)} 个示例食材")

        # 插入示例菜谱
        recipes_data = [
            {
                "id": "1",
                "title": "番茄炒蛋",
                "description": "经典家常菜，简单易做",
                "image": "https://images.unsplash.com/photo-1564822036722-6e911b425338?w=800",
                "prep_time": 10,
                "cook_time": 15,
                "servings": 2,
                "difficulty": "easy",
                "cuisine": "chinese",
                "tags": '["家常菜", "快手菜", "简单"]',
                "steps": '["将鸡蛋打散，加少许盐搅拌均匀", "番茄洗净切块", "热锅放油，倒入蛋液炒熟盛起", "锅中再加少许油，放入番茄块炒出汁水", "倒入炒好的鸡蛋，翻炒均匀", "根据口味加盐、糖调味", "撒上葱花即可出锅"]',
                "calories": 180,
                "protein": 12.5,
            }
        ]

        for recipe in recipes_data:
            await conn.execute(
                text("""INSERT INTO recipes (id, title, description, image, prep_time, cook_time, servings, difficulty, cuisine, tags, steps, calories, protein)
                    VALUES (:id, :title, :description, :image, :prep_time, :cook_time, :servings, :difficulty, :cuisine, :tags, :steps, :calories, :protein)"""),
                recipe,
            )

        logger.info(f"插入 {len(recipes_data)} 个示例菜谱")

        # 插入菜谱食材关联
        recipe_ingredients_data = [
            {"name": "鸡蛋", "quantity": "2个", "optional": 0, "recipe_id": "1"},
            {"name": "番茄", "quantity": "2个", "optional": 0, "recipe_id": "1"},
            {"name": "葱", "quantity": "1根", "optional": 1, "recipe_id": "1"},
            {"name": "盐", "quantity": "适量", "optional": 0, "recipe_id": "1"},
        ]

        for ing in recipe_ingredients_data:
            await conn.execute(
                text(
                    "INSERT INTO recipe_ingredients (name, quantity, optional, recipe_id) VALUES (:name, :quantity, :optional, :recipe_id)"
                ),
                ing,
            )

        logger.info(f"插入 {len(recipe_ingredients_data)} 个菜谱食材关联")


async def main():
    """主函数"""
    logger.info("=" * 60)
    logger.info("开始初始化数据库...")
    logger.info("=" * 60)

    try:
        # 1. 创建数据库（如果不存在）
        await create_database_if_not_exists()

        # 2. 创建表结构
        logger.info("\n创建数据库表...")
        await init_db()

        # 3. 初始化示例数据
        logger.info("\n初始化示例数据...")
        await init_sample_data()

        logger.info("\n" + "=" * 60)
        logger.info("数据库初始化完成！")
        logger.info("=" * 60)

    except Exception as e:
        logger.error(f"\n数据库初始化失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
