import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { navigateBack } from '@tarojs/taro'
import { dishRecipes } from '../../data/dishes'
import { DishRecipe, CookingStep } from '../../types'
import './index.scss'

const Icons = { chef: '👨‍🍳', clock: '⏱️', arrowLeft: '←', check: '✅', chevronDown: '▼', fire: '🔥', trophy: '🏆' }

export default function Cooking() {
  const [cookingDishes, setCookingDishes] = useState<DishRecipe[]>([])
  const [currentDish, setCurrentDish] = useState<DishRecipe | null>(null)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [navBarInfo, setNavBarInfo] = useState({
    statusBarHeight: 20,
    navContentHeight: 44,
  })

  useEffect(() => {
    const sysInfo = Taro.getSystemInfoSync()
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
    const statusBarHeight = sysInfo.statusBarHeight || 20
    
    // Calculate navigation bar content height (the part below status bar)
    // Formula: (capsule top - status bar height) * 2 + capsule height
    const margin = menuButtonInfo.top - statusBarHeight
    const navContentHeight = menuButtonInfo.height + (margin * 2)
    
    setNavBarInfo({
      statusBarHeight,
      navContentHeight: navContentHeight > 0 ? navContentHeight : 44
    })

    const data = Taro.getStorageSync('cookingDishes')
    if (data) {
      const dishes = JSON.parse(data) as DishRecipe[]
      setCookingDishes(dishes)
      if (dishes.length > 0) setCurrentDish(dishes[0])
    }
  }, [])

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const toggleComplete = (stepId: number) => {
    if (!currentDish) return
    const updated = {
      ...currentDish,
      steps: currentDish.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
    }
    setCurrentDish(updated)
    setIsComplete(updated.steps.every(s => s.completed))
  }

  const switchDish = (dish: DishRecipe) => {
    setCurrentDish(dish)
    setExpandedStep(null)
    setIsComplete(dish.steps.every(s => s.completed))
  }

  const finish = () => {
    Taro.removeStorageSync('cookingDishes')
    navigateBack()
  }

  const completedCount = currentDish?.steps.filter(s => s.completed).length || 0
  const totalSteps = currentDish?.steps.length || 0

  return (
    <View className="page-container">
      <View 
        className="header"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight}px`,
          height: `${navBarInfo.navContentHeight}px`
        }}
      >
        <View className="header-left" onClick={() => navigateBack()}><Text className="back-icon">{Icons.arrowLeft}</Text></View>
        <View className="header-center"><View className="logo-icon">{Icons.chef}</View><Text className="header-title">开始烹饪</Text></View>
        <View className="header-right"><View className="timer"><Text>{Icons.clock}</Text><Text>0'0</Text></View></View>
      </View>
      <ScrollView 
        scrollY 
        className="content"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px` // +12px for extra spacing
        }}
      >
        <View className="dish-tabs">
          <Text className="tabs-label">今日菜单</Text>
          <ScrollView scrollX className="tabs-scroll">
            {cookingDishes.map(dish => (
              <View key={dish.id} className={`tab-item ${currentDish?.id === dish.id ? 'active' : ''}`} onClick={() => switchDish(dish)}>
                <Image className="tab-img" src={dish.image} mode="aspectFill" />
                <View className="tab-info"><Text className="tab-name">{dish.name}</Text><Text className="tab-status">
                  {dish.steps.every(s => s.completed) ? '✅ 已完成' : dish.steps.some(s => s.completed) ? '🔄 进行中' : '⏳ 未开始'}
                </Text></View>
              </View>
            ))}
          </ScrollView>
        </View>

        {currentDish && (
          <View>
            <View className="section">
              <View className="dish-header">
                <Text className="dish-title">{isComplete ? '🎉' : '🍳'} {currentDish.name}</Text>
                <Text className="dish-progress">{completedCount}/{totalSteps} 步骤</Text>
              </View>
              <View className="progress-bar"><View className="progress-fill" style={{ width: `${(completedCount / totalSteps) * 100}%` }} /></View>
            </View>

            <View className="steps">
              {currentDish.steps.map((step, idx) => (
                <View key={step.id} className={`step-item ${step.completed ? 'completed' : ''}`}>
                  <View className="step-header" onClick={() => toggleStep(step.id)}>
                    <View className={`step-num ${step.completed ? 'done' : ''}`}>{step.completed ? '✓' : idx + 1}</View>
                    <View className="step-info"><Text className={`step-title ${step.completed ? 'done' : ''}`}>{step.title}</Text><Text className="step-time">{Icons.clock} {step.duration}</Text></View>
                    <Text className={`step-chevron ${expandedStep === step.id ? 'up' : ''}`}>{Icons.chevronDown}</Text>
                  </View>
                  {expandedStep === step.id && (
                    <View className="step-detail">
                      <Text className="step-desc">{step.description}</Text>
                      <View className={`step-btn ${step.completed ? 'undo' : 'done'}`} onClick={() => toggleComplete(step.id)}>
                        <Text>{step.completed ? '↩️' : '✅'}</Text>
                        <Text>{step.completed ? '取消完成' : '完成此步骤'}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {isComplete && (
          <View className="complete-card">
            <Text className="complete-icon">{Icons.trophy}</Text>
            <Text className="complete-title">太棒了！</Text>
            <Text className="complete-text">{currentDish?.name} 已完成！</Text>
            <View className="complete-btn" onClick={finish}><Text>结束烹饪 👨‍🍳</Text></View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}