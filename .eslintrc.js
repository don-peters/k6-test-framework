module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // K6 specific rules
    'no-console': 'off', // Allow console.log in k6 tests
    '@typescript-eslint/no-explicit-any': 'off', // k6 APIs often use any
    
    // General rules
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'no-unused-vars': 'warn',
    'no-undef': 'error',
  },
  globals: {
    // K6 globals
    '__ENV': 'readonly',
    '__VU': 'readonly',
    '__ITER': 'readonly',
    'open': 'readonly',
  },
};
