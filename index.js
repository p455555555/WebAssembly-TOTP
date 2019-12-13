import { readFileSync } from 'fs';
import * as loader from '@assemblyscript/loader';

const TotpModule = loader.instantiateSync(
    readFileSync(`${__dirname}/build/optimized.wasm`),
    {
        env: {
            abort(_msg, _file, line, column) {
                console.error(
                    `msg: ${(_msg && myModule.__getString(_msg)) || _msg}\n`,
                    `file: ${(_file && myModule.__getString(_file)) || _file}\n`,
                    `line: ${line}\n`,
                    `col: ${column}\n`
                );
            }
        },
        module: {
            console: {
                log(value) {
                    console.log('log: ' + value);
                }
            }
        }
    }
);

export default class TOTP {

    /**
	 * 生成app可识别二维码链接
	 * @param {String} key 密钥
	 * @return {String} uri
	 */
	static getQRUri(key) {
        const allocKey = TotpModule.__retain(TotpModule.__allocString(key));
		const uri = TotpModule.__getString(TotpModule.TOTP.getQRUri(allocKey));

        TotpModule.__release(allocKey);

		return uri;
    }
    
    /**
	 * TOTP 算法实现
	 * @param {String} key 160位密钥
	 * @return {String}
	*/
    static totp(key) {
        const allocKey = TotpModule.__retain(TotpModule.__allocString(key));
        const result = TotpModule.__getString(TotpModule.TOTP.totp(allocKey));

        TotpModule.__release(allocKey);

        return result;
    }

    /**
	 * TOTP 密码效验
	 * @return {Integer} 大于等于0 是时间偏移量，等于-1是不匹配
	 */
    static totpVerify(code, key) {
        const allocCode = TotpModule.__retain(TotpModule.__allocString(code));
        const allocKey = TotpModule.__retain(TotpModule.__allocString(key));
        const result = TotpModule.TOTP.totpVerify(allocCode, allocKey);

        TotpModule.__release(allocCode);
        TotpModule.__release(allocKey);

        return result;
    }
};