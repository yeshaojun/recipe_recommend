import Taro from '@tarojs/taro'
import type {
  OCRResult,
  SpeechResult,
  Recipe,
  RecommendationRequest,
  RecommendationResponse,
  UserPreference
} from '@/types'

const API_BASE_URL = process.env.TARO_ENV === 'h5' ? '/api' : 'http://localhost:3000/api'

class RecipeService {
  private request = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // OCR 识别 - 微信小程序直接使用 OCR API
  async recognizeFromImage(imagePath: string): Promise<OCRResult> {
    try {
      // 微信小程序环境使用原生 OCR API
      if (process.env.TARO_ENV === 'weapp') {
        const result = await Taro.ocr.general({
          imgUrl: imagePath
        })

        if (result?.items) {
          const ingredients = result.items
            .filter((item) => item.text && !item.text.includes('成分') && !item.text.includes('营养'))
            .map((item, index) => ({
              id: `${Date.now()}-${index}`,
              name: item.text.trim(),
              category: 'uncategorized',
              addedAt: new Date().toISOString()
            }))

          return { success: true, ingredients }
        }
      }

      // H5 环境调用后端
      return await this.request<OCRResult>('/ocr', {
        method: 'POST',
        body: JSON.stringify({ image: imagePath })
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '识别失败'
      }
    }
  }

  // 语音识别 - 微信小程序使用原生语音 API
  async recognizeFromSpeech(): Promise<SpeechResult> {
    try {
      if (process.env.TARO_ENV === 'weapp') {
        const result = await Taro.getRecorderManager().stop()

        if (result.tempFilePath) {
          // 微信小程序需要调用语音识别 API
          const recognizeResult = await Taro.translateVoice({
            lfrom: 'zh_CN',
            lto: 'en',
            isFile: true,
            filePath: result.tempFilePath
          })

          return {
            success: true,
            text: recognizeResult.translateResult || ''
          }
        }
      }

      return {
        success: false,
        error: '语音识别失败'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '语音识别失败'
      }
    }
  }

  // 添加食材
  async addIngredient(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    return this.request<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredient)
    })
  }

  // 获取菜谱推荐
  async getRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    return this.request<RecommendationResponse>('/recipes/recommendations', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
  async getRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    return this.request<RecommendationResponse>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // 获取所有菜谱
  async getAllRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>('/recipes')
  }

  // 获取单个菜谱详情
  async getRecipeById(id: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`)
  }
  async getAllRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>('/recipes')
  }

  // 获取单个菜谱详情
  async getRecipeById(id: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${id}`)
  }

  // 保存用户偏好
  async savePreference(preference: UserPreference): Promise<UserPreference> {
    return this.request<UserPreference>('/preferences', {
      method: 'POST',
      body: JSON.stringify(preference)
    })
  }

  // 获取用户偏好
  async getPreference(): Promise<UserPreference> {
    return this.request<UserPreference>('/preferences')
  }

  // AI 生成菜谱
  async generateRecipe(ingredients: string[], cuisine?: string): Promise<Recipe | null> {
    try {
      const response = await this.request<{success: boolean, recipe: Recipe | null}>('/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients, cuisine })
      })
      return response.recipe
    } catch (error) {
      console.error('Failed to generate recipe:', error)
      return null
    }
  }

  // AI 聊天助手
  async chatWithAI(message: string): Promise<string> {
    try {
      const response = await this.request<{response: string}>('/recipes/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      })
      return response.response
    } catch (error) {
      console.error('Failed to chat with AI:', error)
      return '抱歉，AI 助手暂时无法响应'
    }
  }
  async savePreference(preference: UserPreference): Promise<UserPreference> {
    return this.request<UserPreference>('/preferences', {
      method: 'POST',
      body: JSON.stringify(preference)
    })
  }

  // 获取用户偏好
  async getPreference(): Promise<UserPreference> {
    return this.request<UserPreference>('/preferences')
  }
}

export default new RecipeService()