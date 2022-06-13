// 对传输的数据进行加密和解密

import CryptoJS from 'crypto-js'
import { CRYPTO_SECRET_KEY, CRYPTO_SECRET_IV } from './constant'

const KEY_UTF8 = CryptoJS.enc.Utf8.parse(CRYPTO_SECRET_KEY)
const IV_UTF8 = CryptoJS.enc.Utf8.parse(CRYPTO_SECRET_IV)

// 使用AES进行加密 --> 注意纯文本和对象的加解密方式有点点不同
export function encrypt (msg) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(msg), KEY_UTF8, {
    iv: IV_UTF8,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return ciphertext
}

// 解密
export function decrypt (ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, KEY_UTF8, {
    iv: IV_UTF8,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  return decryptedData
}
