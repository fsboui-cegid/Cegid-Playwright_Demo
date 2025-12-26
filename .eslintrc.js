module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-undef': 0,
    'no-unused-vars': 1,
    'no-control-regex': 2
  },
  plugins: ['prettier']
};
