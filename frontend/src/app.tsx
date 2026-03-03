import React from 'react'
import { View } from '@tarojs/components'
import './app.scss'

function App({ children }) {
  return (
    <View className="app-container">
      {children}
    </View>
  )
}

export default App