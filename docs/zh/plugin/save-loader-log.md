## Loader 日志保存

将 `loader` 中的日志，输出到本地文件。

### 如何使用

1. 在 `loader` 中 使用 `recordLoaderLog` 记录日志。


```ts
const { recordLoaderLog } = require('plugin-light/lib/plugin');


function someLoader(source) {
  recordLoaderLog('replace-library.json', {
    a: 'xxx',
  });
}
```


2. 在 `vue.config.js` 中添加如下设置：


```ts
const { SaveLoaderLogPlugin } = require('plugin-light/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new SaveLoaderLogPlugin()
    ]
  }
}
```

