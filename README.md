[![npm version](https://badge.fury.io/js/webassembly-totp.svg)](https://badge.fury.io/js/webassembly-totp)

# TOTP

TOTP算法WebAssembly版本，比JavaScript版本有着更快的运行速度

* 目前只提供了Node.js 入口，后续会提供浏览器用入口，也可以自行引入，wams文件支持Node.js和浏览器加载

## 安装

```bash
$ npm install webassembly-totp --save
```

## 用法

```javascript
import totp from 'webassembly-totp';

// 设置密钥
const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';

// 获取6位动态密码
console.log(totp.totp(testKey));
// 返回 6位数字符串 如123456

// 效验动态密码
console.log(totp.totpVerify('123456', testKey));
// 返回结果 大于等于0 是时间偏移量，说明效验成功，等于-1是不匹配，说明效验失败。

```
更多示例请参考测试用例 wasm.test.ts

## 测试

```bash
# jest 测试
$ npm run test
```
