# 食谱小程序 - 前端

家庭食谱规划小程序前端应用

## 技术栈

- Taro 3.x (React)
- TypeScript
- MobX (状态管理)
- Zustand (轻量状态)
- SCSS (样式)

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境 - 微信小程序

```bash
npm run dev:weapp
```

使用微信开发者工具打开 `dist` 目录

### 开发环境 - H5

```bash
npm run dev:h5
```

浏览器访问 http://localhost:10086

### 生产构建

```bash
npm run build:weapp
```

## 项目结构

```
src/
├── pages/              # 页面
│   ├── home/           # 首页
│   ├── recipe-detail/  # 菜谱详情
│   └── profile/        # 个人偏好
├── components/         # 组件
│   ├── RecipeCard/     # 菜谱卡片
│   └── IngredientInput/# 食材输入
├── stores/             # 状态管理
│   ├── ingredientStore.ts    # MobX
│   └── preferenceStore.ts    # Zustand
├── services/           # API 服务
│   └── recipeService.ts
├── types/              # 类型定义
│   └── index.ts
├── styles/             # 全局样式
│   ├── variables.scss  # 设计变量
│   └── global.scss     # 全局样式
├── app.tsx             # 应用入口
└── app.config.ts       # 应用配置
```

## 核心功能

### 1. 食材库
- 📷 拍照识别（微信 OCR）
- 🎤 语音输入（微信语音识别）
- ✍️ 文字输入

### 2. 菜谱推荐
- 基于现有食材智能推荐
- 卡片式 UI 展示
- 个性化建议

### 3. 用户偏好
- 饮食目标设置
- 饮食限制配置
- 菜系偏好
- 辣度偏好

## 设计系统

### 配色方案
```scss
$primary: #FF6B35      // 暖橙色
$secondary: #FFF8F0    // 米白色
$text-primary: #2D2D2D // 深灰
$text-secondary: #888  // 浅灰
```

### 字体
- 思源黑体 / Source Han Sans CN

## API 代理配置

开发环境自动代理到后端 http://localhost:3000

## 注意事项

- 微信小程序需要配置域名白名单
- OCR 功能需要开通微信 OCR 权限
- 语音识别需要开通微信语音识别权限