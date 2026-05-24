import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          //scss已经废弃·@import，所以改用@use
          additionalData: '@use "@/styles/variable.scss" as *;\n'
        }
      }
    },
    compilerOptions: {
      // 禁用对 any 类型的隐式检查
      noImplicitAny: false,
      // 可选：关闭严格模式（会同时影响其他严格检查）
      strict: false
    },
    //rollup配置
    build: {
      cleanDir: true,
      outDir: 'dist',
      assetsDir: 'assets',
      chunkFileNames: '[name]-[hash:6].js',
      assetsInlineLimit: 20000, //图片转base64
      rolldownOptions: {
        output: {
          codeSplitting: {
            includeDependenciesRecursively: false,
            minSize: 100000, // 100KB 降低阈值，让更多小包合并
            groups: [
              //Vue核心生态
              {
                name: 'vue-core',
                test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
                priority: 100
              },
              // 状态管理插件
              {
                name: 'pinia-plugins',
                test: /[\\/]node_modules[\\/]pinia-plugin-persistedstate[\\/]/,
                priority: 99
              },
              // UI组件库
              {
                name: 'element-plus',
                test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                priority: 80
              },
              // Element Plus图标
              {
                name: 'element-icons',
                test: /[\\/]node_modules[\\/]@element-plus[\\/]icons-vue[\\/]/,
                priority: 79
              },
              // HTTP请求工具
              {
                name: 'http-utils',
                test: /[\\/]node_modules[\\/](axios)[\\/]/,
                priority: 70
              },
              // Markdown渲染
              {
                name: 'markdown',
                test: /[\\/]node_modules[\\/]vue3-markdown-it[\\/]/,
                priority: 60
              },
              // 思维导图核心
              {
                name: 'mind-map',
                test: /[\\/]node_modules[\\/]simple-mind-map[\\/]/,
                priority: 50
              },
              // 工具库
              {
                name: 'utils',
                test: /[\\/]node_modules[\\/]json5[\\/]/,
                priority: 40
              }
            ]
          }
        }
      }
    },
    //开发环境的代理配置
    server: {
      port: 8080 //开发环境的端口号
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',//代理的目标地址
      //     changeOrigin: true, //是否改变源地址
      //     secure: false, //是否安全
      //     rewrite: (path) => path.replace(/^\/api/, ''), //重写路径
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }//代理配置
    }
  }
})
