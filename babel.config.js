module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@': './src',
        '@raiz': './',
        '@assets': './src/assets',
        '@stores': './src/stores',
      },
    }],
  ],
}
