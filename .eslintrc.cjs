module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended', 'plugin:jest/recommended'],
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/semi': ['error', 'always'],
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'vars-on-top': 'off',
    'no-var': 'off',
    'import/no-mutable-exports': 'off',
  },
};
