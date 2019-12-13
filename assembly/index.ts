import { Util } from './tools/util';
import { Cypto } from './tools/cypto';

const DIGIT: u8 = 6; // 生成密码位数

/**
 * TOPT 动态密码模块
 */
export class TOTP {

	/**
	 * 生成app可识别二维码链接
	 */
	public static getQRUri(key: string): string {
		const encoded = Util.bytesToBase32(Util.stringToBytes(key));
		const encodedForApp = encoded.toString().replace('/=/g', '');
		const uri = 'otpauth://totp/somelabel?secret='.concat(encodedForApp); // 生成链接用于二维码识别

		return uri;
	}

	/**
	 * HOTP 算法实现
	 * HOTP(K,C) = Truncate(HMAC-SHA-1(K,C)) 
	 * PWD(K,C,digit) = HOTP(K,C) mod 10^Digit
	*/
	public static hotp(key: string, count: i32): string {
		const stringArray: u8[] = Cypto.hmac(count, key); // HSA1加密

		// Truncate 截断函数
		const offset: u8 = stringArray[19] & 15; // 选取最后一个字节的低字节位4位的整数值作为偏移量
		// 从指定偏移位开始，连续截取 4 个字节（32 位），最后返回 32 位中的后面 31 位
		const cas1: u32 = (stringArray[offset] & 127);
		const cas2: u32 = (stringArray[offset + 1] & 255);
		const cas3: u32 = (stringArray[offset + 2] & 255);
		const cas4: u32 = (stringArray[offset + 3] & 255);
		const p: u32 = cas1 << 24 | cas2 << 16 | cas3 << 8 | cas4;
		const result = u32(p % Math.pow(10, DIGIT)).toString();

		return result;
	}

	/**
	 * HOTP 密码效验
	 * @param {String} code 6位动态密码
	 * @param {String} key 160位密钥
	 * @param {Integer} count 移动因子
	 * @return {Object} 
	 * status 效验结果
	 * delta 偏移量
	 */
	public static hotpVerify(code: string, key: string, count: i32): i32 {
		const times = 2; // 允许误差2分钟

		for (let i = count - times; i <= count + times; i++) {
			const hotpCode = this.hotp(key, i);

			if (hotpCode == code) {
				return i32(i - count);
			}
		}

		return -1;
	}

	/**
	 * TOTP 算法实现
	 * TOTP = HOTP(K, T) 
	 * @param {String} key 160位密钥
	 * @return {String}
	*/
	public static totp(key: string): string {
		const count = this.getCount();
		const code = this.hotp(key, count);

		return code;
	}

	/**
	 * TOTP 密码效验
	 * @return {Object}
	 */
	public static totpVerify(code: string, key: string): i32 {
		return this.hotpVerify(code, key, this.getCount());
	}

	/**
	 * 转换时间为移动因子
	 * T = (Current Unix time - T0) / X
	 * @return {Number} count
	 */
	private static getCount (): i32 {
		const time: i64 = Date.now();
		const windowTime = 30; // 密码有效期(s)

		return i32(Math.floor(f64(time / 1000) / windowTime));
	}
}