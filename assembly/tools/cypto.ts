import { Util } from './util';

/**
 * HMACSHA1加密类
 */
export class Cypto {
    private static blocksize: u8 = 16;

    public static sha1(msg: u8[]): u8[] {
        const m: i32[] = Util.bytesToWords(msg);
        const ml = m.length;
        const l = msg.length * 8;
        const xl = ((l + 64 >>> 9) << 4) + 15;
        const w: i32[] = [];
        let H0 =  1732584193;
        let H1 = -271733879;
        let H2 = -1732584194;
        let H3 =  271733878;
        let H4 = -1009589776;

        // Padding
        m.push(0);
        m[l >> 5] |= 0x80 << (24 - l % 32);
        for (let x = 0; x <= xl; x++) {
            if (x > ml) {
                m[x] = 0;
            } 
            if (x === xl) {
                m[x] = l;
            }
        }

        // m[((l + 64 >>> 9) << 4) + 15] = l;

        for (let i = 0; i < m.length; i += 16) {
            let a = H0;
            let b = H1;
            let c = H2;
            let d = H3;
            let e = H4;

            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = m[i + j];  
                } else {
                    const n: i32 = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
                    w[j] = (n << 1) | (n >>> 31);
                }

                let cache = 0;
                if (j < 20) {
                    cache = (H1 & H2 | ~H1 & H3) + 1518500249;
                } else if (j < 40) {
                    cache = (H1 ^ H2 ^ H3) + 1859775393
                } else if (j < 60) {
                    cache = (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588
                } else {
                    cache = (H1 ^ H2 ^ H3) - 899497514;
                }

                const t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + cache;

                H4 =  H3;
                H3 =  H2;
                H2 = (H1 << 30) | (H1 >>> 2);
                H1 =  H0;
                H0 =  t;
            }

            H0 += a;
            H1 += b;
            H2 += c;
            H3 += d;
            H4 += e;
        } 

        return Util.wordsToBytes([H0, H1, H2, H3, H4]);
    }

	public static hmac(m: i32, k: string): u8[] {
		let message: u8[] = Util.intToBytes(m);
        let key: u8[] = Util.stringToBytes(k);

		// Allow arbitrary length keys
		key = key.length > i32(this.blocksize * 4) ? this.sha1(key) : key;

		// XOR keys with pad constants
		const okey = key;
        const ikey = key.slice(0);
		for (let i = 0; i < i32(this.blocksize * 4); i++) {
			if (i < key.length) {
                okey[i] ^= 0x5C;
                ikey[i] ^= 0x36;
            } else {
                okey[i] = 0x5C;
                ikey[i] = 0x36;
            }
        }
        
        const cas1 = this.sha1(ikey.concat(message));
        const cas2 = this.sha1(okey.concat(cas1));

        return cas2;
	};
}