import { Component, useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { navigateBack } from '@tarojs/taro'
import { cuisinePreferencesInit, dietPreferencesInit, allergyPreferencesInit } from '../../data/dishes'
import { Preference } from '../../types'
import './index.scss'

const Icons = { user: '👤', thumb: '👍', flame: '🔥', star: '⭐', clock: '⏱️', edit: '✏️', save: '💾', arrowLeft: '←' }

export default function PreferencePage() {
  const [cuisines, setCuisines] = useState(cuisinePreferencesInit)
  const [diets, setDiets] = useState(dietPreferencesInit)
  const [allergies, setAllergies] = useState(allergyPreferencesInit)
  const [isEditing, setIsEditing] = useState(false)
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

  const toggle = (type: 'cuisine' | 'diet' | 'allergy', id: number) => {
    if (!isEditing) return
    const setFn = type === 'cuisine' ? setCuisines : type === 'diet' ? setDiets : setAllergies
    const items = type === 'cuisine' ? cuisines : type === 'diet' ? diets : allergies
    setFn(items.map(item => item.id === id ? { ...item, selected: !item.selected } : item))
  }

  const getCount = (items: Preference[]) => items.filter(i => i.selected).length

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
        <View className="header-center"><View className="logo-icon">{Icons.user}</View><Text className="header-title">用户偏好</Text></View>
        <View className="header-right" onClick={() => setIsEditing(!isEditing)}><Text className="edit-icon">{isEditing ? Icons.save : Icons.edit}</Text></View>
      </View>
      <ScrollView 
        scrollY 
        className="content"
        style={{
          paddingTop: `${navBarInfo.statusBarHeight + navBarInfo.navContentHeight + 12}px`
        }}
      >
        <View className="section">
          <View className="section-header"><View className="section-title"><Text>{Icons.thumb}</Text><Text>口味偏好</Text></View><Text className="count">已选{getCount(cuisines)}种</Text></View>
          <View className="pref-grid">
            {cuisines.map(item => (
              <View key={item.id} className={`pref-item ${item.selected ? 'active' : ''} ${!isEditing ? 'readonly' : ''}`} onClick={() => toggle('cuisine', item.id)}>
                <Text className="pref-icon">{item.icon}</Text><Text className="pref-name">{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="section">
          <View className="section-header"><View className="section-title"><Text>{Icons.flame}</Text><Text>饮食目标</Text></View><Text className="count">已选{getCount(diets)}种</Text></View>
          <View className="pref-grid">
            {diets.map(item => (
              <View key={item.id} className={`pref-item ${item.selected ? 'active' : ''} ${!isEditing ? 'readonly' : ''}`} onClick={() => toggle('diet', item.id)}>
                <Text className="pref-icon">{item.icon}</Text><Text className="pref-name">{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="section">
          <View className="section-header"><View className="section-title"><Text>{Icons.star}</Text><Text>过敏原</Text></View><Text className="count">已选{getCount(allergies)}种</Text></View>
          <View className="pref-grid">
            {allergies.map(item => (
              <View key={item.id} className={`pref-item danger ${item.selected ? 'active' : ''} ${!isEditing ? 'readonly' : ''}`} onClick={() => toggle('allergy', item.id)}>
                <Text className="pref-icon">{item.icon}</Text><Text className="pref-name">{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
