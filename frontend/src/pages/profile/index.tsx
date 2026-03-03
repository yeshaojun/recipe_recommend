import React, { useState } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import { usePreferenceStore } from '@/stores/preferenceStore'
import recipeService from '@/services/recipeService'
import type { UserPreference } from '@/types'
import './index.scss'

const ProfilePage: React.FC = () => {
  const preference = usePreferenceStore((state) => state.preference)
  const setPreference = usePreferenceStore((state) => state.setPreference)

  const [goals, setGoals] = useState(preference?.dietaryGoals?.join(', ') || '')
  const [restrictions, setRestrictions] = useState(
    preference?.dietaryRestrictions?.join(', ') || ''
  )
  const [cuisines, setCuisines] = useState(
    preference?.favoriteCuisines?.join(', ') || ''
  )
  const [disliked, setDisliked] = useState(
    preference?.dislikedIngredients?.join(', ') || ''
  )
  const [spiceLevel, setSpiceLevel] = useState<
    UserPreference['spiceLevel']
  >(preference?.spiceLevel || 'medium')
  const [targetCalories, setTargetCalories] = useState(
    preference?.targetCalories?.toString() || ''
  )
  const [targetProtein, setTargetProtein] = useState(
    preference?.targetProtein?.toString() || ''
  )

  const handleSave = async () => {
    try {
      const newPreference: UserPreference = {
        id: preference?.id || `${Date.now()}`,
        dietaryGoals: goals
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean),
        dietaryRestrictions: restrictions
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        favoriteCuisines: cuisines
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        dislikedIngredients: disliked
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        spiceLevel,
        targetCalories: targetCalories ? parseFloat(targetCalories) : undefined,
        targetProtein: targetProtein ? parseFloat(targetProtein) : undefined
      }

      await recipeService.savePreference(newPreference)
      setPreference(newPreference)
      Taro.showToast({ title: '保存成功', icon: 'success' })
    } catch (error) {
      console.error('Failed to save preference:', error)
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  const spiceOptions = [
    { value: 'none', label: '不辣' },
    { value: 'mild', label: '微辣' },
    { value: 'medium', label: '中辣' },
    { value: 'spicy', label: '特辣' }
  ]

  return (
    <View className="profile-page">
      <View className="profile-page__header">
        <Text className="profile-page__title">个人偏好</Text>
        <Text className="profile-page__subtitle">定制你的饮食目标</Text>
      </View>

      <View className="profile-page__form">
        {/* 饮食目标 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">饮食目标</Text>
          <Input
            className="profile-page__input"
            placeholder="例如：减脂、增肌、保持健康"
            value={goals}
            onInput={(e) => setGoals(e.detail.value)}
          />
          <Text className="profile-page__hint">用逗号分隔多个目标</Text>
        </View>

        {/* 饮食限制 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">饮食限制</Text>
          <Input
            className="profile-page__input"
            placeholder="例如：素食、无麸质、低糖"
            value={restrictions}
            onInput={(e) => setRestrictions(e.detail.value)}
          />
          <Text className="profile-page__hint">用逗号分隔多个限制</Text>
        </View>

        {/* 喜爱的菜系 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">喜爱的菜系</Text>
          <Input
            className="profile-page__input"
            placeholder="例如：川菜、粤菜、日式料理"
            value={cuisines}
            onInput={(e) => setCuisines(e.detail.value)}
          />
          <Text className="profile-page__hint">用逗号分隔多个菜系</Text>
        </View>

        {/* 不喜欢的食材 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">不喜欢的食材</Text>
          <Input
            className="profile-page__input"
            placeholder="例如：香菜、苦瓜、香菜"
            value={disliked}
            onInput={(e) => setDisliked(e.detail.value)}
          />
          <Text className="profile-page__hint">用逗号分隔多个食材</Text>
        </View>

        {/* 辣度偏好 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">辣度偏好</Text>
          <View className="profile-page__spice-options">
            {spiceOptions.map((option) => (
              <View
                key={option.value}
                className={`profile-page__spice-option ${
                  spiceLevel === option.value
                    ? 'profile-page__spice-option--active'
                    : ''
                }`}
                onClick={() => setSpiceLevel(option.value as any)}
              >
                <Text className="profile-page__spice-option-text">
                  {option.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 目标热量 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">目标热量</Text>
          <Input
            className="profile-page__input"
            type="digit"
            placeholder="例如：2000"
            value={targetCalories}
            onInput={(e) => setTargetCalories(e.detail.value)}
          />
          <Text className="profile-page__hint">每日目标热量</Text>
        </View>

        {/* 目标蛋白质 */}
        <View className="profile-page__section">
          <Text className="profile-page__label">目标蛋白质</Text>
          <Input
            className="profile-page__input"
            type="digit"
            placeholder="例如：100"
            value={targetProtein}
            onInput={(e) => setTargetProtein(e.detail.value)}
          />
          <Text className="profile-page__hint">每日目标蛋白质</Text>
        </View>

        <Button className="profile-page__save-btn" onClick={handleSave}>
          保存设置
        </Button>
      </View>
    </View>
  )
}

export default ProfilePage