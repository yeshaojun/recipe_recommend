import { Component, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { navigateBack } from '@tarojs/taro'
import { recommendDishes } from '../../data/dishes'
import { Dish } from '../../types'
import './index.scss'

const Icons = {
  heart: '❤️',
  plus: '➕',
  trash: '🗑️',
  arrowLeft: '←',
}

export default function Favorite() {
  const [favorites, setFavorites] = useState<Dish[]>([recommendDishes[0], recommendDishes[1]])
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([])
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

  const handleAddToMenu = (dish: Dish) => {
    if (!selectedDishes.find(d => d.id === dish.id)) {
      setSelectedDishes([...selectedDishes, dish])
    }
  }

  const handleRemove = (dishId: number) => {
    setFavorites(favorites.filter(d => d.id !== dishId))
  }

  const goBack = () => navigateBack()

  return (
    <View className="page-container">
      <View 
        className="header"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight}px`,
          height: `${navBarInfo.navContentHeight}px`
        }}
      >
        <View className="header-left" onClick={goBack}>
          <Text className="back-icon">{Icons.arrowLeft}</Text>
        </View>
        <View className="header-center">
          <View className="logo-icon">{Icons.heart}</View>
          <Text className="header-title">我的收藏</Text>
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
        {favorites.length > 0 ? (
          <View className="favorites-list">
            {favorites.map(dish => (
              <View key={dish.id} className="favorite-card">
                <Image className="card-img" src={dish.image} mode="aspectFill" />
                <View className="card-body">
                  <Text className="card-title">{dish.name}</Text>
                  <Text className="card-meta">{Icons.fire} {dish.calories} 千卡 · {Icons.clock} {dish.time}</Text>
                  <View className="card-actions">
                    <View className="action-btn add" onClick={() => handleAddToMenu(dish)}>
                      <Text>加入菜单</Text>
                    </View>
                    <View className="action-btn delete" onClick={() => handleRemove(dish.id)}>
                      <Text>{Icons.trash}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="empty">
            <Text className="empty-icon">{Icons.heart}</Text>
            <Text className="empty-text">还没有收藏</Text>
            <Text className="empty-hint">点击卡片上的小心心收藏菜品</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
