// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  pluginVue.configs['flat/base'],
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'vue/html-indent': ['error', 2],
    },
  },
)
