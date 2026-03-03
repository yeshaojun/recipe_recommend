export interface Ingredient {
  id: string
  name: string
  category: string
  image?: string
  quantity?: number
  unit?: string
  expiryDate?: string
  addedAt: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: Array<{
    name: string
    quantity: number
    unit: string
  }>
  steps: string[]
  tags: string[]
  calories?: number
  protein?: number
  createdAt: string
}

export interface UserPreference {
  id: string
  dietaryGoals: string[]
  dietaryRestrictions: string[]
  favoriteCuisines: string[]
  dislikedIngredients: string[]
  spiceLevel: 'none' | 'mild' | 'medium' | 'spicy'
  targetCalories?: number
  targetProtein?: number
}

export interface OCRResult {
  success: boolean
  ingredients?: Ingredient[]
  error?: string
}

export interface SpeechResult {
  success: boolean
  text?: string
  error?: string
}

export interface RecommendationRequest {
  ingredients: Ingredient[]
  preferences?: UserPreference
}

export interface RecommendationResponse {
  recipes: Recipe[]
  matchRate: number
  suggestions?: string[]
}