import { Component, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro, { navigateBack } from '@tarojs/taro'
import { Ingredient } from '../../types'
import './index.scss'

const Icons = { book: '📖', leaf: '🥬', search: '🔍', plus: '➕', edit: '✏️', trash: '🗑️', arrowLeft: '←' }

const libraryData = [
  { category: '肉类', items: ['鸡胸肉', '鸡腿肉', '猪肉', '牛肉', '羊肉', '鱼', '虾', '排骨'] },
  { category: '蔬菜', items: ['西兰花', '白菜', '萝卜', '土豆', '番茄', '黄瓜', '茄子', '青椒'] },
  { category: '水果', items: ['苹果', '香蕉', '橙子', '草莓', '葡萄', '西瓜', '芒果'] },
  { category: '主食', items: ['大米', '面粉', '面条', '馒头', '面包', '玉米'] },
  { category: '调料', items: ['盐', '酱油', '醋', '糖', '食用油', '蒜', '姜', '葱'] },
]

export default function Library() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '鸡胸肉', quantity: '200', unit: 'g', category: '肉类' },
    { id: 2, name: '西兰花', quantity: '150', unit: 'g', category: '蔬菜' },
  ])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')
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

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = { '肉类': '#FEE2E2', '蔬菜': '#DCFCE7', '水果': '#F3E8FF', '主食': '#FEF3C7', '调料': '#FFEDD5', '配料': '#FEF3C7', '其他': '#F3F4F6' }
    return colors[cat] || colors['其他']
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
        <View className="header-left" onClick={() => navigateBack()}><Text className="back-icon">{Icons.arrowLeft}</Text></View>
        <View className="header-center"><View className="logo-icon">{Icons.book}</View><Text className="header-title">食材库</Text></View>
        <View className="header-right"><View className="add-icon">{Icons.plus}</View></View>
      </View>
      <ScrollView 
        scrollY 
        className="content"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px`
        }}
      >
        <View className="tip-card">
          <View className="tip-icon">{Icons.leaf}</View>
          <View><Text className="tip-title">我的食材库</Text><Text className="tip-count">共 {ingredients.length} 种食材</Text></View>
        </View>
        <View className="search-box">
          <Text className="search-icon">{Icons.search}</Text>
          <Input className="search-input" value={search} onInput={e => setSearch(e.detail.value)} placeholder="搜索食材..." />
        </View>
        <View className="filters">
          {['全部', '肉类', '蔬菜', '水果', '主食', '调料'].map(cat => (
            <Text key={cat} className={`filter-tag ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</Text>
          ))}
        </View>
        <View className="section">
          <View className="section-title"><Text>{Icons.leaf}</Text><Text>我的食材</Text><Text className="count">（{ingredients.length}种）</Text></View>
          <View className="ingredient-list">
            {ingredients.map(item => (
              <View key={item.id} className="ingredient-item">
                <View className="ingredient-icon" style={{ background: getCategoryColor(item.category) }}><Text>{Icons.leaf}</Text></View>
                <View className="ingredient-info"><Text className="name">{item.name}</Text><Text className="meta">{item.quantity}{item.unit} · {item.category}</Text></View>
                <View className="actions"><Text className="action">{Icons.edit}</Text><Text className="action">{Icons.trash}</Text></View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
