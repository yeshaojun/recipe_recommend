import { DishRecipe } from '../types'

// 模拟推荐菜品数据
export const recommendDishes = [
  { id: 1, name: '宫保鸡丁', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', calories: 320, time: '25分钟' },
  { id: 2, name: '红烧肉', image: 'https://images.unsplash.com/photo-1623689046286-d4ca3f6b2f52?w=400&h=300&fit=crop', calories: 580, time: '45分钟' },
  { id: 3, name: '清炒西兰花', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop', calories: 120, time: '10分钟' },
  { id: 4, name: '番茄炒蛋', image: 'https://images.unsplash.com/photo-1482049016ny-2-d9c8c4f0b5c?w=400&h=300&fit=crop', calories: 180, time: '15分钟' },
  { id: 5, name: '麻婆豆腐', image: 'https://images.unsplash.com/photo-1582452919408-53c12f8e0621?w=400&h=300&fit=crop', calories: 290, time: '20分钟' },
]

// 菜谱步骤数据
export const dishRecipes: DishRecipe[] = [
  {
    id: 1,
    name: '宫保鸡丁',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop',
    calories: 320,
    time: '25分钟',
    steps: [
      { id: 1, title: '准备食材', description: '鸡胸肉切丁，花生米备好，姜蒜切末，葱切段', duration: '5分钟', completed: false },
      { id: 2, title: '调制酱汁', description: '生抽1勺 + 老抽0.5勺 + 糖1勺 + 醋0.5勺 + 淀粉适量，搅拌均匀', duration: '2分钟', completed: false },
      { id: 3, title: '鸡丁滑炒', description: '锅中倒油，鸡丁下锅翻炒至变色盛出备用', duration: '3分钟', completed: false },
      { id: 4, title: '爆香炒制', description: '姜蒜末、干辣椒、花椒爆香，加入鸡丁和花生米', duration: '3分钟', completed: false },
      { id: 5, title: '收汁完成', description: '倒入酱汁，大火收汁，加入葱段翻炒均匀即可', duration: '2分钟', completed: false },
    ]
  },
  {
    id: 2,
    name: '红烧肉',
    image: 'https://images.unsplash.com/photo-1623689046286-d4ca3f6b2f52?w=400&h=300&fit=crop',
    calories: 580,
    time: '45分钟',
    steps: [
      { id: 1, title: '五花肉处理', description: '五花肉切块，焯水去腥，捞出洗净', duration: '10分钟', completed: false },
      { id: 2, title: '炒糖色', description: '锅中放少许油，加糖小火炒至焦糖色', duration: '5分钟', completed: false },
      { id: 3, title: '红烧焖煮', description: '放入五花肉翻炒上色，加生抽、老抽、料酒、开水', duration: '25分钟', completed: false },
      { id: 4, title: '收汁装盘', description: '大火收汁至浓稠，撒上葱花即可', duration: '5分钟', completed: false },
    ]
  },
  {
    id: 3,
    name: '清炒西兰花',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop',
    calories: 120,
    time: '10分钟',
    steps: [
      { id: 1, title: '准备食材', description: '西兰花切小朵洗净，胡萝卜切片，蒜切末', duration: '3分钟', completed: false },
      { id: 2, title: '焯水处理', description: '锅中烧水，加少许盐，西兰花焯水1分钟', duration: '3分钟', completed: false },
      { id: 3, title: '翻炒出锅', description: '热锅下蒜末爆香，加入西兰花翻炒，加盐调味', duration: '4分钟', completed: false },
    ]
  },
  {
    id: 4,
    name: '番茄炒蛋',
    image: 'https://images.unsplash.com/photo-1482049016ny-2-d9c8c4f0b5c?w=400&h=300&fit=crop',
    calories: 180,
    time: '15分钟',
    steps: [
      { id: 1, title: '准备食材', description: '番茄切块，鸡蛋打散加少许盐', duration: '3分钟', completed: false },
      { id: 2, title: '炒鸡蛋', description: '锅中倒油，鸡蛋下锅炒至凝固盛出', duration: '2分钟', completed: false },
      { id: 3, title: '炒番茄', description: '番茄下锅翻炒出汁，加入鸡蛋一起炒', duration: '5分钟', completed: false },
      { id: 4, title: '调味完成', description: '加盐、糖调味，翻炒均匀即可出锅', duration: '2分钟', completed: false },
    ]
  },
  {
    id: 5,
    name: '麻婆豆腐',
    image: 'https://images.unsplash.com/photo-1582452919408-53c12f8e0621?w=400&h=300&fit=crop',
    calories: 290,
    time: '20分钟',
    steps: [
      { id: 1, title: '准备食材', description: '豆腐切块焯水，肉末备好，葱姜蒜切末', duration: '5分钟', completed: false },
      { id: 2, title: '炒肉末', description: '锅中下油，肉末炒散，加豆瓣酱炒出红油', duration: '3分钟', completed: false },
      { id: 3, title: '煮豆腐', description: '加入高汤或清水，放入豆腐块煮3-5分钟', duration: '5分钟', completed: false },
      { id: 4, title: '勾芡完成', description: '水淀粉勾芡，撒上花椒粉和葱花', duration: '3分钟', completed: false },
    ]
  },
]

// 口味偏好
export const cuisinePreferencesInit = [
  { id: 1, name: '川菜', icon: '🌶️', selected: true },
  { id: 2, name: '粤菜', icon: '🥘', selected: true },
  { id: 3, name: '湘菜', icon: '🔥', selected: false },
  { id: 4, name: '鲁菜', icon: '🥢', selected: false },
  { id: 5, name: '西餐', icon: '🍝', selected: false },
  { id: 6, name: '日料', icon: '🍣', selected: false },
]

// 饮食目标
export const dietPreferencesInit = [
  { id: 1, name: '减脂', icon: '💪', selected: true },
  { id: 2, name: '增肌', icon: '🏋️', selected: false },
  { id: 3, name: '素食', icon: '🥗', selected: false },
  { id: 4, name: '低碳水', icon: '🍚', selected: false },
  { id: 5, name: '高蛋白', icon: '🥩', selected: false },
  { id: 6, name: '无辣', icon: '🚫', selected: false },
]

// 过敏原
export const allergyPreferencesInit = [
  { id: 1, name: '海鲜', icon: '🦐', selected: false },
  { id: 2, name: '花生', icon: '🥜', selected: false },
  { id: 3, name: '牛奶', icon: '🥛', selected: false },
  { id: 4, name: '鸡蛋', icon: '🥚', selected: false },
  { id: 5, name: '豆制品', icon: '🫘', selected: false },
  { id: 6, name: '麸质', icon: '🌾', selected: false },
]
