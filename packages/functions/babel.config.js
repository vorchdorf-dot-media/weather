const node = process.env.AWS_LAMBDA_JS_RUNTIME
  ? process.env.AWS_LAMBDA_JS_RUNTIME.replace(/^nodejs/, '').replace(/\.x/, '')
  : '12';

module.exports = {
  extends: '../../.babelrc',
  presets: [
    [
      'module:@babel/preset-env',
      {
        targets: {
          node,
        },
      },
    ],
  ],
};
