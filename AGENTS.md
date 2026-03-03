# 食谱小程序 - AGENTS.md

## 项目概述

**项目类型**: 跨平台微信小程序 (全新项目)
**主要目标**: 家庭食谱规划应用
**平台**: 微信小程序 (主平台) + 未来跨平台支持 (支付宝、抖音、H5、App)

## 核心功能

1. **食材库**
   - 图片识别 (OCR/拍照)
   - 文字输入
   - 语音输入 (语音转文字)

2. **菜谱推荐**
   - 基于现有食材智能推荐
   - 卡片式 UI 展示
   - 个性化建议

3. **用户偏好**
   - 饮食目标追踪
   - 偏好学习
   - 推荐调整

## 设计规范

### 视觉风格
- **风格定位**: 温馨、实用、略带趣味
- **主色调**: 暖橙色 `#FF6B35` + 米白色 `#FFF8F0`
- **字体**: 思源黑体 (现代简洁风格)
- **Slogan**: "今天吃什么？问问AI管家"
- **素材路径**: `/img/` (logo 等图片已存放)

### 配色方案
```scss
// 主色系
$primary: #FF6B35;      // 暖橙色 - 主要按钮、高亮
$secondary: #FFF8F0;    // 米白色 - 背景色
$text-primary: #2D2D2D; // 深灰 - 主要文字
$text-secondary: #888;  // 浅灰 - 次要文字
$border: #E8E8E8;       // 边框色
$success: #52C41A;      // 成功状态
$error: #FF4D4F;        // 错误状态
$warning: #FAAD14;      // 警告状态
```

## 技术栈 (推荐)

### 框架
**Taro 3.x** (基于 React)
- 主平台: 微信小程序
- 未来平台: 支付宝、抖音、H5、React Native
- 强大的生态系统，良好的 TypeScript 支持
- 跨平台 API 抽象

### 核心依赖
- `@tarojs/taro` - 核心框架
- `@tarojs/components` - UI 组件
- `@tarojs/react` - React 集成
- `taro-ui` - 组件库 (可选)
- `@tarojs/plugin-platform-weapp` - 微信平台插件
- `dayjs` - 日期时间工具
- `mobx` 或 `zustand` - 状态管理
- `@tarojs/taro-rn` - React Native 桥接 (未来)

### AI/ML 服务
- 微信 OCR API - 图片识别
- 微信语音识别 API - 语音输入
- 自定义 LLM 后端 - 菜谱生成/推荐

## 构建命令

```bash
# 安装依赖
npm install

# 开发环境 - 微信小程序
npm run dev:weapp
# 自动在微信开发者工具打开

# 开发环境 - H5
npm run dev:h5

# 生产构建
npm run build:weapp

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 代码规范

### 导入顺序
```typescript
// 外部依赖优先
import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

// 内部导入
import { RecipeCard } from '@/components'
import { useIngredientStore } from '@/stores'
import { formatDate } from '@/utils/date'
```

### 组件结构
```typescript
// 使用 Taro 的 React 函数组件 + Hooks
import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

const RecipeCard = ({ recipe }) => {
  const [liked, setLiked] = useState(false)

  useLoad(() => {
    console.log('RecipeCard loaded')
  })

  return (
    <View className="recipe-card">
      <Image src={recipe.image} className="recipe-image" />
      <Text className="recipe-title">{recipe.title}</Text>
    </View>
  )
}

export default RecipeCard
```

### 状态管理
- **Zustand** - 简单全局状态 (用户偏好)
- **MobX** - 复杂状态 (食材库、菜谱数据)
- 组件内状态 - hooks (useState, useReducer)

### 命名规范
- **组件**: PascalCase (`RecipeCard`, `IngredientList`)
- **Hooks**: camelCase + `use` 前缀 (`useIngredients`, `useRecipes`)
- **工具函数**: camelCase (`formatDate`, `parseRecipe`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_INGREDIENTS`)
- **文件**: kebab-case 或 PascalCase (根据类型)

### 文件结构
```
src/
├── pages/              # Taro 页面
│   ├── home/
│   ├── recipes/
│   └── profile/
├── components/         # 可复用组件
│   ├── RecipeCard/
│   └── IngredientInput/
├── stores/             # 状态管理
│   ├── ingredientStore.ts
│   └── preferenceStore.ts
├── utils/              # 工具函数
│   ├── date.ts
│   └── ocr.ts
├── services/           # API 调用
│   └── recipeService.ts
├── types/              # TypeScript 定义
│   └── index.ts
├── styles/             # 全局样式
│   └── variables.scss
└── app.tsx             # 应用入口
```

### 错误处理
```typescript
// 必须处理异步错误
const fetchRecipes = async () => {
  try {
    const recipes = await recipeService.getRecipes()
    setRecipes(recipes)
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    Taro.showToast({
      title: '加载失败',
      icon: 'error'
    })
  }
}
```

### TypeScript 规范
- **禁止** `any` 类型 - 使用明确的接口或 `unknown`
- **禁止** `@ts-ignore` - 正确修复类型问题
- 为所有 API 响应定义接口
- 对象形状用 `interface`，联合类型用 `type`

## 测试

```bash
# 运行所有测试
npm test

# 运行单个测试文件
npm test -- IngredientInput.test.tsx

# 运行匹配模式的测试
npm test -- --grep "OCR"
```

## 平台注意事项

### 微信小程序
- 使用 `Taro.*` API 调用平台能力
- 图片必须是 HTTPS 或相对路径
- localStorage 限制 10MB
- 网络请求需要在配置中添加域名白名单

### 未来平台
- 组件语法保持一致
- 平台特定 API 通过 `process.env.TARO_ENV` 调用
- 条件导入: `if (process.env.TARO_ENV === 'weapp')`

## 开发流程

1. 创建功能分支
2. 按照代码规范实现功能
3. 在微信开发者工具中测试
4. 代码检查: `npm run lint`
5. 类型检查: `npm run type-check`
6. 创建 Pull Request

## 重要说明

- **跨平台优先**: 尽可能避免使用微信特定 API
- **类型安全**: 所有代码必须有类型定义
- **性能优化**: 小程序内存有限，优化图片和数据加载
- **可访问性**: 使用语义化的 Taro 组件
- **设计系统**: 严格遵循暖橙色主题色和米白色背景