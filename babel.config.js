module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 'transform-remove-console',
    // 实现路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}
