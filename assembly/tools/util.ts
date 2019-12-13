export const UTIL_ID = idof<Util>();
export const UTIL_SIZE = offsetof<Util>();

/**
 * 工具类
 */
export class Util {

    private static base32map: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

	/**
     * string转换为byte
     */
	public static stringToBytes (str: string): u8[] {
        const bytes: u8[] = [];
        
		for (let i = 0; i < str.length; i++) {
            bytes.push(u8(str.charCodeAt(i)));
        }
			
		return bytes;
	}

	/**
     * byte转换为string
     */
	public static bytesToString (bytes: u8[]): string {
        const str: string[] = [];
        
		for (let i = 0; i < bytes.length; i++){
            str.push(String.fromCharCode(bytes[i]));
        }

		return str.join('');
	}

    /**
     * string转换为big-endian 32-bit words
     */
	public static stringToWords (str: string): i32[] {
        const words: i32[] = [];
        // 由于AssemblyScript不能访问null数组，所以得先初始化
        for (let c = 0, b = 0; c < str.length; c++, b += 8) {
            words[b >>> 5] = 0;
        }
		for (let c = 0, b = 0; c < str.length; c++, b += 8) {
            words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
        }
			
		return words;
	}

	/**
     * byte转换为big-endian 32-bit words
     */
	public static bytesToWords (bytes: u8[]): i32[] {
        const words: i32[] = [];
        // 由于AssemblyScript不能访问null数组，所以得先初始化
        for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] = 0;
        }
		for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] |= i32(bytes[i]) << (24 - b % 32);
        }
			
		return words;
	}

	/**
     * big-endian 32-bit words转换为byte
     */
	public static wordsToBytes (words: i32[]): u8[] {
        const bytes: u8[] = [];
        
		for (let b = 0; b < words.length * 32; b += 8) {
            bytes.push(u8((words[b >>> 5] >>> (24 - b % 32)) & 0xFF));
        }
			
		return bytes;
    }
    
    /**
     * int转换为byte
     */
    public static intToBytes (n: i32): u8[] {
        const bytes: u8[] = [];
        let num: i32 = n;

        for (let i = 7; i >= 0; --i) {
            bytes[i] = u8(num & 255); // AND运算截取1字节数据存入数组中
            num = num >> 8; // 位移至下一个字节
        }

        return bytes;
    }

	/**
     * bytes转换为hex
     */
	public static bytesToHex (bytes: u8[]): string {
        const hex: string[] = [];
        
		for (let i = 0; i < bytes.length; i++) {
			hex.push((bytes[i] >>> 4).toString());
			hex.push((bytes[i] & 0xF).toString());
        }
        
		return hex.join('');
	}

	/**
     * hex转换为bytes
     */
	public static hexToBytes (hex: string): u8[] {
        const bytes: u8[] = [];
        
		for (let c = 0; c < hex.length; c += 2) {
            bytes.push(u8(parseInt(hex.substr(c, 2), 16)));
        }

		return bytes;
    }  

	/**
     * bytes转换为base32
     */
	public static bytesToBase32 (bytes: u8[]): string {
		const base32: string[] = [];
		let overflow: i8 = -1;

		for (let i = 0; i < bytes.length; i++) {
			switch (i % 5) {
				case 0:
                    base32.push(this.base32map.charAt(bytes[i] >>> 3));
					overflow = (bytes[i] & 0x7) << 2;
                    break;
                    
				case 1:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 6)));
                    base32.push(this.base32map.charAt((bytes[i] >>> 1) & 0x1F));
					overflow = (bytes[i] & 0x1) << 4;
                    break;
                    
				case 2:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 4)));
                    overflow = (bytes[i] & 0xF) << 1;
                    break;
    
                case 3:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 7)));
                    base32.push(this.base32map.charAt((bytes[i] >>> 2) & 0x1F));
                    overflow = (bytes[i] & 0x3) << 3;
                    break;

                case 4:
                    base32.push(this.base32map.charAt(overflow | (bytes[i] >>> 5)));
                    base32.push(this.base32map.charAt(bytes[i] & 0x1F));
                    overflow = -1;
                    break;
            }
		}

		// 将剩余的字节编码
		if (overflow !== -1) {
            base32.push(this.base32map.charAt(overflow));
        }

		// 填充
		while (base32.length % 8 != 0) {
            base32.push('=');
        } 

		return base32.join('');
	}

}