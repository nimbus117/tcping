// delete as appropriate
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'warn',
  },
};
