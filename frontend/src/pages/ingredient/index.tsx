import { Component, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { navigateBack } from '@tarojs/taro'
import { Ingredient } from '../../types'
import './index.scss'

const Icons = {
  leaf: '🥬',
  sparkles: '✨',
  plus: '➕',
  trash: '🗑️',
  arrowLeft: '←',
  mic: '🎤',
  image: '🖼️',
}

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '鸡胸肉', quantity: '200', unit: 'g', category: '肉类' },
    { id: 2, name: '西兰花', quantity: '150', unit: 'g', category: '蔬菜' },
    { id: 3, name: '大蒜', quantity: '3', unit: '瓣', category: '配料' },
  ])
  const [navBarInfo, setNavBarInfo] = useState({
    statusBarHeight: 20,
    navContentHeight: 44,
  })

  useEffect(() => {
    const sysInfo = Taro.getSystemInfoSync()
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
    const statusBarHeight = sysInfo.statusBarHeight || 20
    const margin = menuButtonInfo.top - statusBarHeight
    const navContentHeight = menuButtonInfo.height + (margin * 2)
    setNavBarInfo({
      statusBarHeight,
      navContentHeight: navContentHeight > 0 ? navContentHeight : 44
    })
  }, [])

  const handleDelete = (id: number) => {
    setIngredients(ingredients.filter(item => item.id !== id))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '肉类': '#FEE2E2', '蔬菜': '#DCFCE7', '水果': '#F3E8FF',
      '配料': '#FEF3C7', '调料': '#FFEDD5', '其他': '#F3F4F6',
    }
    return colors[category] || colors['其他']
  }

  return (
    <View className="page-container">
      <View 
        className="header"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight}px`,
          height: `${navBarInfo.navContentHeight}px`
        }}
      >
        <View className="header-left" onClick={() => navigateBack()}>
          <Text className="back-icon">{Icons.arrowLeft}</Text>
        </View>
        <View className="header-center">
          <View className="logo-icon">{Icons.leaf}</View>
          <Text className="header-title">食材识别</Text>
        </View>
        <View className="header-right" />
      </View>

      <ScrollView 
        scrollY 
        className="content"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px`
        }}
      >
        <View className="section">
          <View className="section-title">
            <Text>{Icons.sparkles}</Text>
            <Text>选择识别方式</Text>
          </View>
          <View className="recognize-btns">
            <View className="recognize-btn">
              <View className="btn-icon">{Icons.image}</View>
              <Text className="btn-text">上传图片</Text>
              <Text className="btn-hint">拍照或选择相册</Text>
            </View>
            <View className="recognize-btn">
              <View className="btn-icon gray">{Icons.mic}</View>
              <Text className="btn-text">语音识别</Text>
              <Text className="btn-hint">说出你有什么食材</Text>
            </View>
          </View>
        </View>

        <View className="section">
          <View className="section-header">
            <View className="section-title">
              <Text>{Icons.leaf}</Text>
              <Text>已识别食材</Text>
              <Text className="count">（{ingredients.length}种）</Text>
            </View>
            <View className="add-btn">
              <Text>{Icons.plus}</Text>
              <Text>手动添加</Text>
            </View>
          </View>
          <View className="ingredient-list">
            {ingredients.map(item => (
              <View key={item.id} className="ingredient-item">
                <View className="ingredient-icon" style={{ background: getCategoryColor(item.category) }}>
                  <Text>{Icons.leaf}</Text>
                </View>
                <View className="ingredient-info">
                  <Text className="ingredient-name">{item.name}</Text>
                  <Text className="ingredient-meta">{item.quantity}{item.unit} · {item.category}</Text>
                </View>
                <View className="ingredient-delete" onClick={() => handleDelete(item.id)}>
                  <Text>{Icons.trash}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
