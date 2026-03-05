import { useState, useRef, useEffect } from 'react'
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { navigateTo } from '@tarojs/taro'
import { recommendDishes, dishRecipes } from '../../data/dishes'
import { Dish, DishRecipe } from '../../types'
import './index.scss'

const Icons = {
  chef: '👨‍🍳',
  sparkles: '✨',
  heart: '❤️',
  heartOutline: '🤍',
  plus: '➕',
  trash: '🗑️',
  mic: '🎤',
  image: '🖼️',
  pencil: '✏️',
  menu: '☰',
  arrowLeft: '←',
  arrowRight: '→',
  clock: '⏱️',
  fire: '🔥',
  left: '◀',
  right: '▶',
  star: '⭐',
  leaf: '🥬',
  book: '📖',
  user: '👤',
  chat: '💬',
  settings: '⚙️',
  edit: '✏️',
  save: '💾',
  check: '✅',
  add: '➕',
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([])
  const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [flyingDish, setFlyingDish] = useState<{ dish: Dish; x: number; y: number; targetX: number; targetY: number } | null>(null)
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

  const menuSectionRef = useRef<any>(null)

  const handleAddDish = (dish: Dish, e: any) => {
    if (selectedDishes.find(d => d.id === dish.id)) {
      Taro.showToast({
        title: '已在菜单中',
        icon: 'none'
      })
      return
    }

    const { x: clientX, y: clientY } = e.detail

    Taro.createSelectorQuery()
      .select('.today-menu-section')
      .boundingClientRect()
      .exec((menuRes) => {
        const menuRect = menuRes[0]
        if (!menuRect) return

        const startX = clientX - 40 // Center the 80rpx image
        const startY = clientY - 40

        const targetX = menuRect.left - startX
        const targetY = menuRect.top - startY

        setFlyingDish({
          dish,
          x: startX,
          y: startY,
          targetX,
          targetY,
        })

        setTimeout(() => {
          setSelectedDishes(prev => [...prev, dish])
          setFlyingDish(null)
          Taro.showToast({
            title: '添加成功',
            icon: 'success'
          })
        }, 600)
      })
  }

  const handleRemoveDish = (dishId: number) => {
    setSelectedDishes(selectedDishes.filter(d => d.id !== dishId))
  }

  const toggleFavorite = (dish: Dish) => {
    const isFav = favoriteDishes.find(d => d.id === dish.id)
    if (isFav) {
      setFavoriteDishes(favoriteDishes.filter(d => d.id !== dish.id))
      Taro.showToast({
        title: '已取消收藏',
        icon: 'none'
      })
    } else {
      setFavoriteDishes([...favoriteDishes, dish])
      Taro.showToast({
        title: '已收藏',
        icon: 'success'
      })
    }
  }

  const isFavorite = (dishId: number) => favoriteDishes.some(d => d.id === dishId)

  const startCooking = () => {
    const cookingData = selectedDishes.map(d => {
      const recipe = dishRecipes.find(r => r.id === d.id)
      return recipe || { ...d, steps: [] }
    }).filter(d => d.steps && d.steps.length > 0) as DishRecipe[]

    if (cookingData.length > 0) {
      Taro.setStorageSync('cookingDishes', JSON.stringify(cookingData))
      navigateTo({ url: '/pages/cooking/index' })
    }
  }

  const handleMenuClick = (page: string) => {
    setShowSidebar(false)
    if (page === 'home') return
    if (page === 'chat') {
      navigateTo({ url: '/pages/chat/index' })
    } else if (page === 'favorite') {
      navigateTo({ url: '/pages/favorite/index' })
    } else if (page === 'ingredient') {
      navigateTo({ url: '/pages/ingredient/index' })
    } else if (page === 'library') {
      navigateTo({ url: '/pages/library/index' })
    } else if (page === 'preference') {
      navigateTo({ url: '/pages/preference/index' })
    }
  }

  const goToChat = () => navigateTo({ url: '/pages/chat/index' })
  const goToFavorite = () => navigateTo({ url: '/pages/favorite/index' })
  const goToIngredient = () => navigateTo({ url: '/pages/ingredient/index' })
  const goToLibrary = () => navigateTo({ url: '/pages/library/index' })
  const goToPreference = () => navigateTo({ url: '/pages/preference/index' })

  return (
    <View className="page-container">
      {showSidebar && (
        <View className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
          <View className="sidebar" onClick={e => e.stopPropagation()}>
            <View className="sidebar-header">
              <Text className="sidebar-title">今日吃啥</Text>
              <Text className="sidebar-close" onClick={() => setShowSidebar(false)}>✕</Text>
            </View>
            <View className="sidebar-menu">
              <View className="sidebar-item active" onClick={() => handleMenuClick('home')}>
                <Text>{Icons.chef}</Text>
                <Text>今日推荐</Text>
              </View>
              <View className="sidebar-item" onClick={() => handleMenuClick('chat')}>
                <Text>{Icons.chat}</Text>
                <Text>AI对话</Text>
              </View>
              <View className="sidebar-item" onClick={() => handleMenuClick('favorite')}>
                <Text>{Icons.heart}</Text>
                <Text>我的收藏</Text>
              </View>
              <View className="sidebar-item" onClick={() => handleMenuClick('ingredient')}>
                <Text>{Icons.leaf}</Text>
                <Text>食材识别</Text>
              </View>
            
              <View className="sidebar-item" onClick={() => handleMenuClick('library')}>
                <Text>{Icons.book}</Text>
                <Text>食材库</Text>
              </View>
              <View className="sidebar-item" onClick={() => handleMenuClick('preference')}>
                <Text>{Icons.user}</Text>
                <Text>用户偏好</Text>
              </View>
            </View>
            <View className="sidebar-footer">
              <Text className="slogan">今天吃什么？问问AI管家</Text>
            </View>
          </View>
        </View>
      )}

      <View 
        className="header"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight}px`,
          height: `${navBarInfo.navContentHeight}px`
        }}
      >
        <View className="header-left" onClick={() => setShowSidebar(true)}>
          <Text className="menu-icon">{Icons.menu}</Text>
        </View>
        <View className="header-center">
          <View className="logo-icon">{Icons.chef}</View>
          <Text className="header-title">今日吃啥</Text>
        </View>
        <View className="header-right" />
      </View>

      <ScrollView 
        scrollY 
        className="main-content"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px`
        }}
      >
        <View className="section today-menu-section" ref={menuSectionRef}>
          <View className="section-header">
            <View className="section-title-wrap">
              <Text className="section-icon">{Icons.sparkles}</Text>
              <Text className="section-title">今日菜单</Text>
            </View>
            {selectedDishes.length > 0 && (
              <View className="cook-btn" onClick={startCooking}>
                <Text>{Icons.chef}</Text>
                <Text>开始烹饪</Text>
              </View>
            )}
          </View>
          {selectedDishes.length > 0 ? (
            <ScrollView scrollX className="dish-list">
              {selectedDishes.map(dish => (
                <View key={dish.id} className="dish-card-small">
                  <Image className="dish-img" src={dish.image} mode="aspectFill" />
                  <View className="dish-info">
                    <Text className="dish-name">{dish.name}</Text>
                    <Text className="dish-meta">{dish.calories}千卡 · {dish.time}</Text>
                  </View>
                  <View className="dish-remove" onClick={() => handleRemoveDish(dish.id)}>
                    <Text>{Icons.trash}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="empty-dishes">
              <Text className="empty-icon">{Icons.chef}</Text>
              <Text className="empty-text">还没有选择菜谱</Text>
            </View>
          )}
        </View>

        <View className="section">
          <View className="section-header">
            <View className="section-title-wrap">
              <Text className="section-icon">{Icons.heart}</Text>
              <Text className="section-title">为你推荐</Text>
            </View>
          </View>

          <Swiper
            className="carousel-swiper"
            circular
            previousMargin="80rpx"
            nextMargin="80rpx"
            current={currentIndex}
            onChange={(e) => setCurrentIndex(e.detail.current)}
          >
            {recommendDishes.map((dish, idx) => (
              <SwiperItem key={dish.id} className="carousel-item">
                <View className="dish-card">
                  <Image className="dish-card-img" src={dish.image} mode="aspectFill" />
                  <View 
                    className="dish-card-actions"
                    style={{
                      opacity: currentIndex === idx ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  >
                    <View 
                      className="action-icon add" 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentIndex === idx) handleAddDish(dish, e)
                      }}
                      style={{ pointerEvents: currentIndex === idx ? 'auto' : 'none' }}
                    >
                      <Text>{Icons.plus}</Text>
                    </View>
                    <View 
                      className={`action-icon ${isFavorite(dish.id) ? 'active' : ''}`} 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentIndex === idx) toggleFavorite(dish)
                      }}
                      style={{ pointerEvents: currentIndex === idx ? 'auto' : 'none' }}
                    >
                      <Text>{isFavorite(dish.id) ? Icons.heart : Icons.heartOutline}</Text>
                    </View>
                  </View>
                  <View className="dish-card-footer">
                    <Text className="dish-name">{dish.name}</Text>
                    <View className="dish-meta">
                      <Text>{Icons.fire} {dish.calories} 千卡</Text>
                      <Text>{Icons.clock} {dish.time}</Text>
                    </View>
                  </View>
                </View>
              </SwiperItem>
            ))}
          </Swiper>

          <View className="carousel-dots">
            {recommendDishes.map((_, idx) => (
              <View key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
            ))}
          </View>

          <View className="tags">
            <Text className="tag active">🍳 早餐</Text>
            <Text className="tag">🥗 午餐</Text>
            <Text className="tag">🍲 晚餐</Text>
            <Text className="tag">💪 减脂</Text>
            <Text className="tag">⚡ 快手菜</Text>
          </View>
        </View>
      </ScrollView>

      <View className="footer">
        <View className="input-bar">
          <View className="input-btn" onClick={goToIngredient}>
            <View className="input-icon">
              <Text>{Icons.image}</Text>
            </View>
            <Text className="input-label">图片</Text>
          </View>
          <View className="input-btn record">
            <View className="input-icon main">
              <Text>{Icons.mic}</Text>
            </View>
            <Text className="input-label active">录音</Text>
          </View>
          <View className="input-btn" onClick={goToChat}>
            <View className="input-icon">
              <Text>{Icons.pencil}</Text>
            </View>
            <Text className="input-label">文字</Text>
          </View>
        </View>
      </View>

      {flyingDish && (
        <View
          className="flying-dish"
          style={{
            left: `${flyingDish.x}px`,
            top: `${flyingDish.y}px`,
            '--target-x': `${flyingDish.targetX}px`,
            '--target-y': `${flyingDish.targetY}px`,
            animation: 'flyToMenu 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          } as any}
        >
          <Image
            src={flyingDish.dish.image}
            style={{
              width: '80rpx',
              height: '80rpx',
              borderRadius: '16rpx',
              boxShadow: '0 4rpx 16rpx rgba(0, 0, 0, 0.2)',
            }}
            mode="aspectFill"
          />
        </View>
      )}
    </View>
  )
}

declare global {
  interface TaroStatic {
    setStorageSync(key: string, value: string): void
    getStorageSync(key: string): string
  }
}
