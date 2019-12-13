import wasm from './index.js';

const testKey = wasm.__retain(wasm.__allocString('LFLFMU2SGVCUIUCZKBMEKRKLIQ'));
  
test('获取TOTP code,code应该是6位数', () => {
    const result = wasm.__getString(wasm.TOTP.totp(testKey));
    console.log('生成6位数key>>', result);
    expect(result).toHaveLength(6); // code 应该是6位数
});

test('获取TOTP code,再进行效验应该为true', () => {
    const code = wasm.__getString(wasm.TOTP.totp(testKey));
    const arg = wasm.__retain(wasm.__allocString(code));
    const result = wasm.TOTP.totpVerify(arg, testKey);
    expect(result).toBe(0);
    wasm.__release(arg);
});

test('随便用一个code效验应该是不通过的', () => {
    const code = wasm.__retain(wasm.__allocString('564786'));
    const result = wasm.TOTP.totpVerify(code, testKey);
    expect(result).toBe(-1);
    wasm.__release(code);
});

afterAll(() => {
    wasm.__release(testKey);
});
