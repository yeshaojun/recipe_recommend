import React, { useState } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface IngredientInputProps {
  onAdd: (name: string, quantity?: number, unit?: string) => void
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')

  const handleImageInput = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      if (res.tempFilePaths && res.tempFilePaths[0]) {
        Taro.showLoading({ title: '识别中...' })

        // OCR 识别
        const ocrResult = await Taro.ocr.general({
          imgUrl: res.tempFilePaths[0]
        })

        Taro.hideLoading()

        if (ocrResult?.items && ocrResult.items.length > 0) {
          const ingredients = ocrResult.items
            .filter(
              (item) =>
                item.text &&
                !item.text.includes('成分') &&
                !item.text.includes('营养') &&
                item.text.length < 20
            )
            .map((item) => item.text.trim())

          if (ingredients.length > 0) {
            Taro.showActionSheet({
              itemList: ingredients,
              success: (res) => {
                setName(ingredients[res.tapIndex])
              }
            })
          } else {
            Taro.showToast({ title: '未识别到食材', icon: 'none' })
          }
        } else {
          Taro.showToast({ title: '识别失败', icon: 'error' })
        }
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '识别失败', icon: 'error' })
      console.error('OCR error:', error)
    }
  }

  const handleVoiceInput = async () => {
    try {
      const recorderManager = Taro.getRecorderManager()

      recorderManager.start({
        duration: 10000,
        format: 'mp3'
      })

      Taro.showModal({
        title: '录音中',
        content: '请说出食材名称',
        showCancel: true,
        cancelText: '结束',
        success: async (res) => {
          if (res.confirm) {
            recorderManager.stop()
          }
        }
      })

      recorderManager.onStop(async (res) => {
        try {
          Taro.showLoading({ title: '识别中...' })

          const recognizeResult = await Taro.translateVoice({
            lfrom: 'zh_CN',
            lto: 'zh_CN',
            isFile: true,
            filePath: res.tempFilePath
          })

          Taro.hideLoading()

          if (recognizeResult?.translateResult) {
            setName(recognizeResult.translateResult)
          } else {
            Taro.showToast({ title: '识别失败', icon: 'error' })
          }
        } catch (error) {
          Taro.hideLoading()
          Taro.showToast({ title: '识别失败', icon: 'error' })
        }
      })
    } catch (error) {
      Taro.showToast({ title: '语音识别失败', icon: 'error' })
      console.error('Voice error:', error)
    }
  }

  const handleAdd = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入食材名称', icon: 'none' })
      return
    }

    const qty = quantity ? parseFloat(quantity) : undefined
    onAdd(name.trim(), qty, unit || undefined)

    setName('')
    setQuantity('')
    setUnit('')
  }

  return (
    <View className="ingredient-input">
      <View className="ingredient-input__title">
        <Text className="ingredient-input__title-text">添加食材</Text>
      </View>

      <View className="ingredient-input__methods">
        <Button
          className="ingredient-input__method-btn"
          onClick={handleImageInput}
        >
          📷 拍照识别
        </Button>
        <Button
          className="ingredient-input__method-btn"
          onClick={handleVoiceInput}
        >
          🎤 语音输入
        </Button>
      </View>

      <View className="ingredient-input__form">
        <Input
          className="ingredient-input__input"
          placeholder="食材名称"
          value={name}
          onInput={(e) => setName(e.detail.value)}
        />
        <View className="ingredient-input__row">
          <Input
            className="ingredient-input__input ingredient-input__input--small"
            type="digit"
            placeholder="数量"
            value={quantity}
            onInput={(e) => setQuantity(e.detail.value)}
          />
          <Input
            className="ingredient-input__input ingredient-input__input--small"
            placeholder="单位"
            value={unit}
            onInput={(e) => setUnit(e.detail.value)}
          />
        </View>
        <Button className="ingredient-input__add-btn" onClick={handleAdd}>
          添加
        </Button>
      </View>
    </View>
  )
}

export default IngredientInput