import { Component, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Input, Button } from '@tarojs/components'
import Taro, { navigateBack } from '@tarojs/taro'
import { recommendDishes } from '../../data/dishes'
import { Dish, ChatMessage } from '../../types'
import './index.scss'

const Icons = {
  chef: '👨‍🍳',
  sparkles: '✨',
  heart: '❤️',
  plus: '➕',
  arrowLeft: '←',
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'ai', content: '你好！我是今日吃啥AI管家 👨‍🍳\n有什么我可以帮你的吗？比如：\n• 今天吃什么好？\n• 推荐一些减脂菜\n• 帮我搭配今天的菜单' }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
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

  const handleSend = () => {
    if (!input.trim() || isThinking) return

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    }
    setMessages([...messages, userMsg])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: getAIResponse(input.trim()),
        recipes: getAIRecommendedDishes(input.trim())
      }
      setMessages(prev => [...prev, aiMsg])
      setIsThinking(false)
    }, 1500)
  }

  const getAIResponse = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes('减脂') || lower.includes('减肥')) {
      return '为你推荐几道低脂健康的菜品，热量适中，营养均衡，非常适合减脂期食用！💪'
    } else if (lower.includes('快') || lower.includes('简单')) {
      return '推荐几道简单快手的家常菜，节省时间又美味！⚡'
    } else if (lower.includes('早餐')) {
      return '早餐是一天中最重要的一餐！为你推荐几道营养丰富的早餐选择 🍳'
    } else if (lower.includes('晚餐')) {
      return '晚餐适合选择一些清淡易消化的菜品，为你推荐几道不错的选择 🍲'
    } else if (lower.includes('肉') || lower.includes('荤')) {
      return '为你推荐几道肉食菜品，蛋白质含量丰富，口味鲜美！🥩'
    } else if (lower.includes('素') || lower.includes('蔬菜')) {
      return '为你推荐几道清淡健康的素菜，营养丰富，美味可口！🥗'
    }
    return '根据你的需求，为你推荐以下几道菜品，希望能帮到你！😋'
  }

  const getAIRecommendedDishes = (text: string): Dish[] => {
    const lower = text.toLowerCase()
    if (lower.includes('减脂') || lower.includes('减肥')) {
      return [recommendDishes[2], recommendDishes[3]]
    } else if (lower.includes('快') || lower.includes('简单')) {
      return [recommendDishes[3], recommendDishes[4]]
    }
    return recommendDishes.slice(0, 3)
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
          <View className="logo-icon">{Icons.chef}</View>
          <Text className="header-title">AI对话</Text>
        </View>
        <View className="header-right" />
      </View>

      <ScrollView 
        scrollY 
        className="messages"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px`
        }}
      >
        {messages.map(msg => (
          <View key={msg.id} className={`message ${msg.role}`}>
            {msg.role === 'ai' && (
              <View className="message-header">
                <View className="avatar ai">{Icons.chef}</View>
                <Text className="sender-name">AI管家</Text>
              </View>
            )}
            <View className={`message-bubble ${msg.role}`}>
              <Text className="message-text">{msg.content}</Text>
            </View>
            {msg.recipes && msg.recipes.length > 0 && (
              <View className="recommend-section">
                <Text className="recommend-label">为你推荐：</Text>
                {msg.recipes.map(dish => (
                  <View key={dish.id} className="recipe-card">
                    <Image className="recipe-img" src={dish.image} mode="aspectFill" />
                    <View className="recipe-info">
                      <Text className="recipe-name">{dish.name}</Text>
                      <Text className="recipe-meta">{dish.calories}千卡 · {dish.time}</Text>
                    </View>
                    <View className="recipe-actions">
                      <View className="action-btn favorite">
                        <Text>{Icons.heart}</Text>
                      </View>
                      <View className="action-btn add">
                        <Text>{Icons.plus}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        {isThinking && (
          <View className="message ai">
            <View className="message-header">
              <View className="avatar ai">{Icons.chef}</View>
            </View>
            <View className="message-bubble ai thinking">
              <View className="dots">
                <Text>.</Text><Text>.</Text><Text>.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="footer">
        <View className="input-bar">
          <Input
            className="input"
            value={input}
            onInput={e => setInput(e.detail.value)}
            onConfirm={handleSend}
            placeholder="Ask me anything..."
          />
          <View className={`send-btn ${input.trim() ? 'active' : ''}`} onClick={handleSend}>
            <Text>{Icons.sparkles}</Text>
          </View>
        </View>
        <Text className="slogan">✨ 今天吃什么？问问AI管家</Text>
      </View>
    </View>
  )
}
