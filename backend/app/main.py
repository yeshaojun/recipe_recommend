from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
import logging

from app.routes import recipes_db as recipes, ingredients_db as ingredients, preferences_db as preferences

# 配置日志
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    logger.info("🚀 启动食谱小程序后端服务")
    yield
    logger.info("👋 关闭食谱小程序后端服务")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="家庭食谱规划小程序后端 API",
    lifespan=lifespan
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(recipes.router, prefix="/api")
app.include_router(ingredients.router, prefix="/api")
app.include_router(preferences.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "timestamp": "2024-01-01T00:00:00Z"
    }


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": f"欢迎使用 {settings.app_name} API",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health"
    }