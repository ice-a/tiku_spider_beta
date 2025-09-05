import CryptoJS from 'crypto-js';

// AES加密密钥和IV (初始化向量)
const AES_KEY = 'tiku_secure_key_2025';
const AES_IV = 'tiku_secure_iv_25';

/**
 * 生成请求签名
 * @param {Object} params - 请求参数
 * @returns {string} - 生成的签名
 */
export function generateSign(params = {}) {
  try {
    // 获取用户代理
    const userAgent = navigator.userAgent || '';
    
    // 获取当前时间戳
    const timestamp = Date.now();
    
    // 构建签名原始字符串
    const signString = `${userAgent}|${timestamp}|${JSON.stringify(params)}`;
    
    // 使用AES加密
    const encrypted = CryptoJS.AES.encrypt(signString, CryptoJS.enc.Utf8.parse(AES_KEY), {
      iv: CryptoJS.enc.Utf8.parse(AES_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // 返回Base64编码的签名
    return encrypted.toString();
  } catch (error) {
    console.error('生成签名失败:', error);
    return '';
  }
}

/**
 * 获取请求头信息
 * @param {Object} params - 请求参数
 * @returns {Object} - 包含签名的请求头
 */
export function getRequestHeaders(params = {}) {
  const timestamp = Date.now();
  const sign = generateSign(params);
  
  return {
    'X-Tiku-Sign': sign,
    'X-Tiku-Timestamp': timestamp,
    'Content-Type': 'application/json'
  };
}