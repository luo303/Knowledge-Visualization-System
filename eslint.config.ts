import { globalIgnores } from 'eslint/config'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
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
      '@typescript-eslint/no-explicit-any': 'off',
      // 强制使用 === 而非 ==（避免类型隐式转换）
      eqeqeq: [2, 'always']
    }
  }
)
