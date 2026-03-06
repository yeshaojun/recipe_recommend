"""数据库连接管理模块"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# 创建异步引擎
DATABASE_URL = (
    f"mysql+aiomysql://{settings.database_user}:{settings.database_password}"
    f"@{settings.database_host}:{settings.database_port}/{settings.database_name}"
    f"?charset=utf8mb4"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.database_echo,
    poolclass=NullPool,  # 开发环境使用 NullPool，生产环境可改为 QueuePool
    pool_pre_ping=True,  # 连接前检查
)

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 提交后不过期，方便后续访问
    autocommit=False,
    autoflush=False,
)

# 创建基类
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    获取数据库会话

    用法：
    ```python
    @app.get("/items")
    async def get_items(db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(Item))
        items = result.scalars().all()
        return items
    ```
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


async def init_db():
    """
    初始化数据库 - 创建所有表

    用法：
    ```python
    from app.db.database import init_db

    await init_db()
    ```
    """
    try:
        async with engine.begin() as conn:
            # 导入所有模型以确保它们被注册
            from app.db.models import (
                IngredientModel,
                RecipeModel,
                RecipeIngredientModel,
                UserPreferenceModel,
            )

            # 创建所有表
            await conn.run_sync(Base.metadata.create_all)
            logger.info("数据库表创建成功")
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
        raise


async def close_db():
    """
    关闭数据库连接

    用法：
    ```python
    from app.db.database import close_db

    await close_db()
    ```
    """
    await engine.dispose()
    logger.info("数据库连接已关闭")
