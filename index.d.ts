export default class TOTP {
    static getQRUri(key: string): string;
    static totp(key: string): string;
    static totpVerify(code: string, key: string): number;
}
