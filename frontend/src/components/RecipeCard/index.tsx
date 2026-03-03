import React from 'react'
import { View, Text } from '@tarojs/components'
import { Image } from '@tarojs/components'
import './index.scss'

interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    description: string
    image: string
    prepTime: number
    cookTime: number
    servings: number
    difficulty: 'easy' | 'medium' | 'hard'
    tags: string[]
  }
  onClick?: () => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const getDifficultyText = (difficulty: string) => {
    const map = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    }
    return map[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const map = {
      easy: '#52C41A',
      medium: '#FAAD14',
      hard: '#FF4D4F'
    }
    return map[difficulty] || '#888'
  }

  return (
    <View className="recipe-card" onClick={onClick}>
      <Image
        src={recipe.image}
        mode="aspectFill"
        className="recipe-card__image"
      />
      <View className="recipe-card__content">
        <Text className="recipe-card__title">{recipe.title}</Text>
        <Text className="recipe-card__description" numberOfLines={2}>
          {recipe.description}
        </Text>
        <View className="recipe-card__tags">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Text key={tag} className="recipe-card__tag">
              {tag}
            </Text>
          ))}
        </View>
        <View className="recipe-card__meta">
          <View className="recipe-card__meta-item">
            <Text className="recipe-card__meta-icon">⏱</Text>
            <Text className="recipe-card__meta-text">
              {recipe.prepTime + recipe.cookTime} 分钟
            </Text>
          </View>
          <View className="recipe-card__meta-item">
            <Text className="recipe-card__meta-icon">👥</Text>
            <Text className="recipe-card__meta-text">{recipe.servings} 人份</Text>
          </View>
          <View
            className="recipe-card__meta-item"
            style={{ '--difficulty-color': getDifficultyColor(recipe.difficulty) }}
          >
            <Text className="recipe-card__meta-icon">⭐</Text>
            <Text className="recipe-card__meta-text">
              {getDifficultyText(recipe.difficulty)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RecipeCard