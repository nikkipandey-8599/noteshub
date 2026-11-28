import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
export default [{ignores:['dist/**','node_modules/**','playwright-report/**','test-results/**']},{...js.configs.recommended,files:['src/**/*.{js,jsx}'],languageOptions:{ecmaVersion:'latest',sourceType:'module',globals:globals.browser,parserOptions:{ecmaFeatures:{jsx:true}}},plugins:{react},settings:{react:{version:'detect'}},rules:{...js.configs.recommended.rules,'react/jsx-uses-vars':'error','react/jsx-uses-react':'error','no-unused-vars':'warn','no-empty':'warn'}}];
