import vue from '@vitejs/plugin-vue'; // vue解析
import AutoImport from 'unplugin-auto-import/vite'; // 自动引入组件
import Components from 'unplugin-vue-components/vite'; // 自动解析成组件
import { TDesignResolver } from 'unplugin-vue-components/resolvers'; // 组件resolvers

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
            enabled: true, // Default `false`
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
    ]
}