export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/recipe-detail/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B35',
    navigationBarTitleText: '今天吃什么',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F0'
  },
  tabBar: {
    color: '#888',
    selectedColor: '#FF6B35',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: '/img/tab-home.png',
        selectedIconPath: '/img/tab-home-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '偏好',
        iconPath: '/img/tab-profile.png',
        selectedIconPath: '/img/tab-profile-active.png'
      }
    ]
  }
})