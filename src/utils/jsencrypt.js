import CryptoJS from 'crypto-js';

const CRYPTO_SECRET_KEY = '___cxyi7_music-back_crypto_js___';
const CRYPTO_SECRET_IV = '__MUSIC_BACK_IV__';

const KEY_UTF8 = CryptoJS.enc.Utf8.parse(CRYPTO_SECRET_KEY); // 十六位十六进制数作为密钥
const IV_UTF8 = CryptoJS.enc.Utf8.parse(CRYPTO_SECRET_IV); // 十六位十六进制数作为密钥偏移量

export default (word) => {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, KEY_UTF8, {
    iv: IV_UTF8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};
