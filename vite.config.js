import { defineConfig } from 'vite'
import { resolve } from 'path';
import presets from './build/presets';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: presets(),
  resolve: {
    // 别名设置，如果需要在编辑器能更好的识别别名，需要配置jsconfig.json文件
    alias: {
      '@': resolve(__dirname, './src'), // 把 @ 指向到 src 目录去
    },
  },
  css: {
    preprocessorOptions: {
      // 自动全局引入less变量文件
      less: {
        javascriptEnabled: true, // 防止用户输入可执行代码
        modifyVars: {
          hack: `true;@import (reference) '${resolve('src/assets/less/var.less')}';`,
        },
      },
    },
  },
})
