# 食谱小程序

一个跨平台的微信小程序，帮助家庭进行智能食谱规划。

## 项目结构

```
recipe_app/
├── frontend/           # 前端 Taro 项目
├── backend/            # 后端 Python + FastAPI 项目
├── img/                # 图片素材
└── AGENTS.md           # 项目规范文档
```

## 功能特性

### 核心功能

1. **食材库**
   - 图片识别 (OCR/拍照)
   - 文字输入
   - 语音输入 (语音转文字)

2. **菜谱推荐**
   - 基于现有食材智能推荐
   - 卡片式 UI 展示
   - 个性化建议
   - **AI 生成菜谱**（使用大模型）
   - **AI 烹饪助手**（智能问答）

3. **用户偏好**
   - 饮食目标追踪
   - 偏好学习
   - 推荐调整

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev:weapp
```

### 后端

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 文件，配置 OPENAI_API_KEY 或 DASHSCOPE_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

访问 API 文档：http://localhost:8000/docs

## 技术栈

### 前端
- Taro 3.x (React)
- TypeScript
- MobX + Zustand
- SCSS

### 后端
- Python 3.10+
- FastAPI
- Pydantic
- LangChain + OpenAI/通义千问

## 大模型集成

支持以下大模型：

1. **OpenAI GPT-4 Turbo**
   - 需要配置 `OPENAI_API_KEY`

2. **阿里云通义千问**
   - 需要配置 `DASHSCOPE_API_KEY`

### AI 功能

- **菜谱生成**: 根据食材自动生成详细菜谱
- **烹饪助手**: 智能问答，解答烹饪相关问题

## 设计规范

- **主色调**: 暖橙色 `#FF6B35` + 米白色 `#FFF8F0`
- **字体**: 思源黑体
- **风格**: 温馨、实用、略带趣味

## 开发指南

详细开发规范请参考 [AGENTS.md](./AGENTS.md)

## 注意事项

- 微信小程序需要配置域名白名单
- OCR 和语音识别功能需要开通相应权限
- 大模型功能需要配置 API 密钥
- 后端当前使用 Mock 数据，可扩展为真实数据库

## License

MIT