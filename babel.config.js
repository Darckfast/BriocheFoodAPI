module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver', {
        alias: {
          '@controllers': './src/controllers',
          '@services': './src/services',
          '@models': './src/models',
          '@repository': './src/repositories',
          '@erro': './src/erros',
          '@beans': './src/beans',
          '@utils': './src/utils'
        }
      }],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
