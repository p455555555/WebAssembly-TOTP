import wasm from './index.js';
import { createHmac, createHash } from 'crypto';

const util = wasm.Util;
const cryptoLib = wasm.Cypto;

const testKey = 'LFLFMU2SGVCUIUCZKBMEKRKLIQ';
const allocKey = wasm.__retain(wasm.__allocString(testKey));
const testString = 'HDFGHDFGHFGHdfghkjkjdghldfgkhl;dfgkhljkfdgh+_(&*%^$&$%^&#$%66';
const allocString = wasm.__retain(wasm.__allocString('HDFGHDFGHFGHdfghkjkjdghldfgkhl;dfgkhljkfdgh+_(&*%^$&$%^&#$%66'));
const testNumber = 52540635;
  
test('测试Base32编码', () => {
    const resultString = 'JBCEMR2IIRDEOSCGI5EGIZTHNBVWU23KMRTWQ3DEMZTWW2DMHNSGMZ3LNBWGU23GMRTWQK27FATCUJK6EQTCIJK6EYRSIJJWGY======';
    const result = wasm.__getString(util.bytesToBase32(util.stringToBytes(allocString)));

    expect(result).toBe(resultString);
});

test('测试HMACSHA1编码(数字)', () => {
    // node 加密库作为基准结果
    const hmac = createHmac('sha1', Buffer.from(testKey));
    const resultHex: string = hmac.update(testString).digest('hex'); 
    // Buffer.from().toString('hex')
    const result = wasm.__getUint8Array(cryptoLib.hmac(testNumber, allocKey));
    // console.log('hmac', cryptoLib.hmac(testNumber, allocKey));
    expect(result).toBe(resultHex);
});

test('测试SHA1编码(数字))', () => {
    // node 加密库作为基准结果
    const sha1 = createHash('sha1');
    const bytes = wasm.__getUint8Array(util.intToBytes(testNumber));
    const c = Buffer.from(bytes);
    const resultHex: string = sha1.update(c).digest('hex'); 
    const result = Buffer.from(wasm.__getUint8Array(cryptoLib.sha1(bytes))).toString('hex');
    console.log('hmac', result);

    expect(result).toBe(resultHex);
});

test('测试SHA1编码(数字))', () => {
    // node 加密库作为基准结果
    const sha1 = createHash('sha1');
    const bytes = wasm.__getUint8Array(util.intToBytes(testNumber));
    const c = Buffer.from(bytes);
    const resultHex: string = sha1.update(c).digest('hex'); 
    const result = wasm.__getUint8Array(cryptoLib.sha1());
    console.log('result', result);

    expect(result).toBe(resultHex);
});

afterAll(() => {
    wasm.__release(allocKey);
    wasm.__release(allocString);
});


