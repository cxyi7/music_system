import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import presets from './build/presets';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  // .env 类文件会在 Vite 启动一开始时被加载，而改动会在重启服务器后生效
  // 加载当前模式下的环境变量，对应关系为：
  // dev -> (.env,.env.development)
  // build -> (.env,.env.production)
  const viteEnv = loadEnv(env.mode, process.cwd());
  return {
    base: viteEnv.VITE_BASE, // 开发或生产环境服务的公共基础路径
    plugins: presets(env.mode),
    resolve: {
      // 别名设置，如果需要在编辑器能更好的识别别名，需要配置jsconfig.json文件
      alias: {
        '@': resolve(__dirname, './src'), // 把 @ 指向到 src 目录去
      },
    },
    server: {
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
      port: 3000, // 使用的端口号
      strictPort: false, // 当端口号被占用时，尝试下一个可用端口
      open: true, // 自动打开浏览器
      cors: true, // 允许跨域
      proxy: {
        // 接口代理
        [viteEnv.VITE_API_BASEURL]: {
          changeOrigin: true, // 允许跨域
          target: viteEnv.VITE_API_TARGET, // 本地 8000 前端代码的接口 代理到 8888 的服务端口
          rewrite: (path) => path.replace(viteEnv.VITE_API_BASEURL, '/'), // 配置请求时替换 VITE_API_BASEURL -> /
        },
      },
    },
    build: {
      target: 'es2022',
      outDir: `dist/${viteEnv.VITE_BASE}`, // 打包生成的文件放在该目录下
      minify: 'terser', // 文件混淆
      brotliSize: false, // 是否显示打包后文件压缩结果，由于vite不支持打包压缩，关闭此功能可以加快打包速度
      assetsDir: 'static/assets', // 指定生成静态资源的存放路径
      chunkSizeWarningLimit: 1500, // 配置打包大于2000KB会发出警告，默认为500KB
      terserOptions: {
        // 在生产环境移除console.log
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // 静态资源打包到dist下的不同目录
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
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
  };
});
