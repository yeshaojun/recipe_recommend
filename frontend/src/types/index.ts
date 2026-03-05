// 菜品类型
export interface Dish {
  id: number
  name: string
  image: string
  calories: number
  time: string
}

// 食材类型
export interface Ingredient {
  id: number
  name: string
  quantity: string
  unit: string
  category: string
}

// 偏好选项
export interface Preference {
  id: number
  name: string
  icon: string
  selected: boolean
}

// 聊天消息
export interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  content: string
  recipes?: Dish[]
}

// 烹饪步骤
export interface CookingStep {
  id: number
  title: string
  description: string
  duration: string
  completed: boolean
}

// 菜谱详细
export interface DishRecipe extends Dish {
  steps: CookingStep[]
}
