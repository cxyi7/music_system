import path from 'path';
import vue from '@vitejs/plugin-vue'; // vue解析
import AutoImport from 'unplugin-auto-import/vite'; // 自动引入组件
import Components from 'unplugin-vue-components/vite'; // 自动解析成组件
import { TDesignResolver } from 'unplugin-vue-components/resolvers'; // 组件resolvers
import viteCompression from 'vite-plugin-compression'; // 打包压缩
import WindiCSS from 'vite-plugin-windicss'; // 下一代工具优先的 CSS 框架
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default () => {
  return [
    vue(),
    AutoImport({
      dts: './build/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'], // 引入框架方法
      resolvers: [
        TDesignResolver({
          library: 'vue-next', // 选择指定的库
        }),
      ],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './build/.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    Components({
      dts: './build/components.d.ts', // 生成该文件的相对路径。
      extensions: ['vue'], // 组件的有效文件扩展名。
      include: [/\.vue$/], // 选择.vue文件
      // imports 指定组件所在位置，默认为 src/components; 有需要也可以加上 view 目录
      dirs: ['src/components/'], // 要搜索组件的目录的相对路径。
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
        }),
      ],
    }),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用
      // filter:()=>{}, // 过滤哪些资源不压缩 RegExp or (file: string) => boolean
      threshold: 1024 * 50, // 体积大于50KB才会被压缩，单位 b
      deleteOriginFile: false, // 压缩后是否删除源文件
      algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // 生成的压缩包后缀
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    WindiCSS(),
  ];
};
