import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import IngredientInput from '@/components/IngredientInput'
import RecipeCard from '@/components/RecipeCard'
import ingredientStore from '@/stores/ingredientStore'
import recipeService from '@/services/recipeService'
import { usePreferenceStore } from '@/stores/preferenceStore'
import type { Recipe } from '@/types'
import './index.scss'

const HomePage: React.FC = () => {
  const [ingredients, setIngredients] = React.useState(ingredientStore.ingredients)
  const [recommendations, setRecommendations] = React.useState<Recipe[]>([])
  const [loading, setLoading] = React.useState(false)
  const preference = usePreferenceStore((state) => state.preference)

  useLoad(() => {
    console.log('HomePage loaded')
  })

  useEffect(() => {
    const loadRecommendations = async () => {
      if (ingredients.length === 0) return

      setLoading(true)
      try {
        const result = await recipeService.getRecommendations({
          ingredients,
          preferences: preference || undefined
        })
        setRecommendations(result.recipes)
      } catch (error) {
        console.error('Failed to load recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [ingredients, preference])

  const handleAddIngredient = (name: string, quantity?: number, unit?: string) => {
    const ingredient = {
      id: `${Date.now()}`,
      name,
      category: 'uncategorized',
      quantity,
      unit,
      addedAt: new Date().toISOString()
    }

    ingredientStore.addIngredient(ingredient)
    setIngredients([...ingredientStore.ingredients])
  }

  const handleRecipeClick = (recipe: Recipe) => {
    console.log('Recipe clicked:', recipe.id)
    // 跳转到菜谱详情页
    Taro.navigateTo({
      url: `/pages/recipe-detail/index?id=${recipe.id}`
    })
  }

  return (
    <View className="home-page">
      {/* 顶部标语 */}
      <View className="home-page__header">
        <Text className="home-page__slogan">今天吃什么？</Text>
        <Text className="home-page__sub-slogan">问问AI管家</Text>
      </View>

      {/* 食材输入 */}
      <IngredientInput onAdd={handleAddIngredient} />

      {/* 当前食材 */}
      {ingredients.length > 0 && (
        <View className="home-page__ingredients">
          <View className="home-page__section-header">
            <Text className="home-page__section-title">
              当前食材 ({ingredients.length})
            </Text>
          </View>
          <View className="home-page__ingredient-list">
            {ingredients.map((ing) => (
              <View key={ing.id} className="home-page__ingredient-item">
                <Text className="home-page__ingredient-name">{ing.name}</Text>
                {ing.quantity && (
                  <Text className="home-page__ingredient-quantity">
                    {ing.quantity} {ing.unit || ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 推荐菜谱 */}
      {recommendations.length > 0 && (
        <View className="home-page__recommendations">
          <View className="home-page__section-header">
            <Text className="home-page__section-title">为你推荐</Text>
          </View>
          <View className="home-page__recipe-list">
            {recommendations.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </View>
        </View>
      )}

      {loading && (
        <View className="home-page__loading">
          <Text>加载推荐中...</Text>
        </View>
      )}

      {ingredients.length === 0 && (
        <View className="home-page__empty">
          <Text className="home-page__empty-text">
            添加食材，开始智能推荐 🍳
          </Text>
        </View>
      )}
    </View>
  )
}

export default HomePage