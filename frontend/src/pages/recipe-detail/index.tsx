import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import recipeService from '@/services/recipeService'
import type { Recipe } from '@/types'
import './index.scss'

const RecipeDetailPage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useLoad(() => {
    const router = Taro.getCurrentInstance().router
    const id = router?.params?.id

    if (id) {
      loadRecipe(id)
    }
  })

  const loadRecipe = async (id: string) => {
    try {
      const data = await recipeService.getRecipeById(id)
      setRecipe(data)
    } catch (error) {
      console.error('Failed to load recipe:', error)
      Taro.showToast({ title: '加载失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="recipe-detail">
        <Text className="recipe-detail__loading">加载中...</Text>
      </View>
    )
  }

  if (!recipe) {
    return (
      <View className="recipe-detail">
        <Text className="recipe-detail__error">菜谱不存在</Text>
      </View>
    )
  }

  return (
    <View className="recipe-detail">
      {/* 菜谱图片 */}
      <View className="recipe-detail__image-container">
        <Image
          src={recipe.image}
          mode="aspectFill"
          className="recipe-detail__image"
        />
        <View className="recipe-detail__overlay">
          <Text className="recipe-detail__title">{recipe.title}</Text>
        </View>
      </View>

      {/* 菜谱信息 */}
      <View className="recipe-detail__info">
        <View className="recipe-detail__info-item">
          <Text className="recipe-detail__info-label">准备时间</Text>
          <Text className="recipe-detail__info-value">{recipe.prepTime} 分钟</Text>
        </View>
        <View className="recipe-detail__info-item">
          <Text className="recipe-detail__info-label">烹饪时间</Text>
          <Text className="recipe-detail__info-value">{recipe.cookTime} 分钟</Text>
        </View>
        <View className="recipe-detail__info-item">
          <Text className="recipe-detail__info-label">份量</Text>
          <Text className="recipe-detail__info-value">{recipe.servings} 人份</Text>
        </View>
      </View>

      {/* 营养信息 */}
      {(recipe.calories || recipe.protein) && (
        <View className="recipe-detail__nutrition">
          <Text className="recipe-detail__section-title">营养信息</Text>
          {recipe.calories && (
            <View className="recipe-detail__nutrition-item">
              <Text className="recipe-detail__nutrition-label">热量</Text>
              <Text className="recipe-detail__nutrition-value">
                {recipe.calories} kcal
              </Text>
            </View>
          )}
          {recipe.protein && (
            <View className="recipe-detail__nutrition-item">
              <Text className="recipe-detail__nutrition-label">蛋白质</Text>
              <Text className="recipe-detail__nutrition-value">
                {recipe.protein} g
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 食材清单 */}
      <View className="recipe-detail__ingredients">
        <Text className="recipe-detail__section-title">食材清单</Text>
        {recipe.ingredients.map((ing, index) => (
          <View key={index} className="recipe-detail__ingredient-item">
            <Text className="recipe-detail__ingredient-name">{ing.name}</Text>
            <Text className="recipe-detail__ingredient-quantity">
              {ing.quantity} {ing.unit}
            </Text>
          </View>
        ))}
      </View>

      {/* 制作步骤 */}
      <View className="recipe-detail__steps">
        <Text className="recipe-detail__section-title">制作步骤</Text>
        {recipe.steps.map((step, index) => (
          <View key={index} className="recipe-detail__step">
            <View className="recipe-detail__step-number">
              <Text className="recipe-detail__step-number-text">{index + 1}</Text>
            </View>
            <Text className="recipe-detail__step-text">{step}</Text>
          </View>
        ))}
      </View>

      {/* 标签 */}
      {recipe.tags.length > 0 && (
        <View className="recipe-detail__tags">
          <Text className="recipe-detail__section-title">标签</Text>
          <View className="recipe-detail__tag-list">
            {recipe.tags.map((tag) => (
              <Text key={tag} className="recipe-detail__tag">
                {tag}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

export default RecipeDetailPage