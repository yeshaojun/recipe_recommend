# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 集成后端数据库架构
  - 新增 SQLAlchemy 数据库配置和模型定义
  - 重构所有数据模型为 Pydantic + SQLAlchemy 混合模式
  - 实现 CRUD 服务层
- 数据库初始化脚本
- 项目配置文件
- 重构前端架构，新增菜谱管理与AI功能
- 重构前端架构，新增菜谱管理与AI功能
- 新增6个页面：菜谱库、偏好设置、收藏、AI对话、烹饪步骤、食材识别
- 首页轮播推荐、今日菜单、收藏功能
- 菜谱数据层：dishes 数据文件、类型定义
- 自定义导航栏样式
- 菜品移动动画效果
- AI 对话功能入口
- 烹饪步骤指导页面
- 食材识别功能入口
- 用户偏好设置页面

### Changed
- 升级 Taro CLI 从 3.6.0 到 3.6.39
- 移除底部导航栏，改为侧边栏菜单
- 优化首页布局和交互体验

### Removed
- 移除旧组件：IngredientInput、RecipeCard
- 移除旧页面：profile、recipe-detail
- 移除旧的服务层：recipeService
- 移除旧的状态管理：ingredientStore、preferenceStore
- 移除旧的样式文件：global.scss、variables.scss