export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/library/index',
    'pages/preference/index',
    'pages/favorite/index',
    'pages/chat/index',
    'pages/cooking/index',
    'pages/ingredient/index'
  ],
  window: {
    navigationBarTitleText: '今日吃啥',
    navigationStyle: 'custom',
    backgroundColor: '#FFF8F0',
    backgroundColorTop: '#FFF8F0',
    backgroundColorBottom: '#FFF8F0',
    enablePullDownRefresh: false
  }
})