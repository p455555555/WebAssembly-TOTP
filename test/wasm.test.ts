import totp from '../index.js';

const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';
  
test('生成uri', () => {
    const result = totp.getQRUri(testKey);
    expect(result).toBe('otpauth://totp/somelabel?secret=JRDEYRSNKUZFGR2WINKUSVKDLJFUETKFJNJEWTCJKE======');
});

test('获取TOTP code,code应该是6位数', () => {
    const result = totp.totp(testKey);
    console.log('生成6位数key>>', result);
    expect(result).toHaveLength(6); // code 应该是6位数
});

test('获取TOTP code,再进行效验应该为true', () => {
    const code = totp.totp(testKey);
    const result = totp.totpVerify(code, testKey);
    expect(result).toBe(0);
});

test('随便用一个code效验应该是不通过的', () => {
    const code = '564786';
    const result = totp.totpVerify(code, testKey);
    expect(result).toBe(-1);
});
