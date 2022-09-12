module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 100, // 换算的基数
      exclude: /^((?!.{5,}home).)*$/, // 排除包含home以外的文件
      minPixelValue: 2, // 1.01px以下的不转换
      selectorBlackList: ['.px'], // 过滤掉.px-开头的class，不进行rem转换
    },
  },
};
