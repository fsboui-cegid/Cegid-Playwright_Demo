module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': 'error',

    // 🔥 FIX CRLF / LF (LA CLÉ DU PROBLÈME)
    'linebreak-style': 'off',

    'no-undef': 0,
    'no-unused-vars': 1,
    'no-control-regex': 2
  },
  plugins: ['prettier']
};
