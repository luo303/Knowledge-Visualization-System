import { globalIgnores } from 'eslint/config'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
// 新增：导入 globals 以获取环境全局变量定义
import globals from 'globals'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    // 新增：配置语言选项，声明全局变量
    languageOptions: {
      globals: {
        // 浏览器环境全局变量（包含 console、window 等）
        ...globals.browser
        // 若有 Node.js 环境需求，可添加：...globals.node
      }
    }
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      'no-undef': 2,
      // 强制使用 === 而非 ==（避免类型隐式转换）
      eqeqeq: [2, 'always']
    }
  }
)
