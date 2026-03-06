# 食谱小程序 - 后端

家庭食谱规划小程序后端 API 服务（Python + FastAPI）

## 技术栈

- **框架**: FastAPI 0.104+
- **Python**: 3.10+
- **大模型集成**: LangChain + OpenAI
- **数据验证**: Pydantic
- **异步支持**: asyncio + httpx

## 功能特性

### 1. 菜谱管理
- ✅ 获取所有菜谱
- ✅ 获取单个菜谱详情
- ✅ 智能推荐（基于食材和偏好）
- ✅ **AI 生成菜谱**（使用大模型）
- ✅ **AI 烹饪助手**（聊天问答）

### 2. 食材管理
- ✅ 添加食材
- ✅ 获取所有食材
- ✅ 删除食材
- ✅ 更新食材

### 3. 用户偏好
- ✅ 保存用户偏好
- ✅ 获取用户偏好

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置大模型 API 密钥：

```env
OPENAI_API_KEY=your_openai_api_key_here
# 或使用通义千问
DASHSCOPE_API_KEY=your_dashscope_api_key_here
```

### 3. 启动开发服务器

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

或使用 Make 命令（如果有 Makefile）：

```bash
make dev
```

服务器将在 http://localhost:8000 启动

### 4. 访问 API 文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 接口
### 食材识别
- 通过图片/文字/语音，识别成食材列表
- 将食材列表添加到食材库
- 添加食材
- 获取所有食材
- 删除食材
- 更新食材

### 菜谱相关
- 获取推荐菜谱（根据食材和偏好，推荐5个菜谱）
- 语音输入生成菜谱
- 将菜谱添加到今日菜单
- 获取今日菜单（第二天自动清空）

### 菜谱收藏
- 添加菜谱收藏
- 获取所有收藏菜谱
- 删除收藏菜谱

### 食材库
- 获取所有的食材
- 添加食材（可通过图片，或者语音识别添加）
- 删除食材
- 更新食材

### 用户偏好
- `POST /api/preferences` - 保存用户偏好
- `GET /api/preferences` - 获取用户偏好

### 其他
- 用户登陆（微信小程序，使用手机号登陆）
- AI聊天接口

## 大模型集成

### OpenAI 配置

```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview
```

### 通义千问配置

```env
DASHSCOPE_API_KEY=sk-...
DASHSCOPE_MODEL=qwen-plus
```

### 使用示例

**生成菜谱**：

```bash
curl -X POST "http://localhost:8000/api/recipes/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["鸡蛋", "番茄", "面条"],
    "cuisine": "中式",
    "preferences": {
      "spice_level": "mild"
    }
  }'
```

**AI 助手聊天**：

```bash
curl -X POST "http://localhost:8000/api/recipes/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "怎么挑选新鲜的鱼？"
  }'
```

## 项目结构

```
backend/
├── app/
│   ├── main.py              # 应用入口
│   ├── config.py            # 配置管理
│   ├── models.py            # Pydantic 模型
│   ├── routes/              # API 路由
│   │   ├── recipes.py       # 菜谱路由
│   │   ├── ingredients.py   # 食材路由
│   │   └── preferences.py   # 偏好路由
│   └── services/            # 业务逻辑
│       ├── llm_service.py   # 大模型服务
│       ├── recipe_service.py # 菜谱服务
│       ├── ingredient_service.py # 食材服务
│       └── preference_service.py # 偏好服务
├── requirements.txt         # Python 依赖
├── pyproject.toml          # 项目配置
├── .env.example            # 环境变量示例
└── .gitignore
```

## 开发说明

### 当前状态

- ✅ 使用 Mock 数据存储
- ✅ 完整的 API 接口
- ✅ 大模型集成（菜谱生成、聊天助手）
- ✅ 推荐算法实现

### 生产环境建议

1. **数据库**: 添加 PostgreSQL 或 MongoDB
2. **认证**: 添加 JWT 认证
3. **缓存**: 添加 Redis 缓存
4. **图片存储**: 添加 OSS 或本地存储
5. **监控**: 添加日志和监控
6. **部署**: Docker + Nginx

### 测试

```bash
# 运行所有测试
pytest

# 运行特定测试
pytest tests/test_recipes.py

# 生成覆盖率报告
pytest --cov=app --cov-report=html
```

### 代码格式化

```bash
# 格式化代码
black app/

# 排序导入
isort app/

# 类型检查
mypy app/
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| API_HOST | API 监听地址 | 0.0.0.0 |
| API_PORT | API 端口 | 8000 |
| API_RELOAD | 开发模式热重载 | true |
| OPENAI_API_KEY | OpenAI API 密钥 | - |
| OPENAI_MODEL | OpenAI 模型 | gpt-4-turbo-preview |
| DASHSCOPE_API_KEY | 通义千问 API 密钥 | - |
| DASHSCOPE_MODEL | 通义千问模型 | qwen-plus |
| LOG_LEVEL | 日志级别 | INFO |

## 故障排除

### 大模型 API 调用失败

1. 检查 API 密钥是否正确配置
2. 检查网络连接
3. 查看 API 配额是否用完
4. 查看日志错误信息

### 端口被占用

```bash
# 查看占用端口的进程
lsof -i :8000

# 或使用其他端口
uvicorn app.main:app --port 8001
```

## License

MIT