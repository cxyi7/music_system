module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
        'last 10 versions', // 所有主流浏览器最近10版本用
      ],
      grid: true,
    },
    'postcss-pxtorem': {
      rootValue: 100, // 换算的基数
      exclude: /^((?!.{5,}home).)*$/, // 排除包含home以外的文件
      minPixelValue: 2, // 1.01px以下的不转换
      selectorBlackList: ['.px'], // 过滤掉.px-开头的class，不进行rem转换
    },
  },
};
