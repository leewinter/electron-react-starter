module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier',
  ],
  rules: {
    semi: 'error',
    'linebreak-style': 'off',
    'react/prop-types': 'disabled',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
    ],
  },
};
