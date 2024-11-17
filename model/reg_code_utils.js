//加密的key
const key = '1!2@3#4$5%';
// 计算注册码的工具
function generateUUIDFromImei(imei) {
    // 获取当前的时间戳（以毫秒为单位）
    const timestamp = Date.now().toString();

    // 将 IMEI 和时间戳结合起来，进行 SHA-256 哈希计算
    const dataToHash = imei + timestamp;

    // 使用 Web Crypto API 计算 SHA-256 哈希
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataToHash))
        .then(hashBuffer => {
            // 将 hashBuffer 转换为十六进制字符串
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

            // 提取哈希的前 32 位作为 UUID
            return hashHex.substring(0, 32); // 32 个十六进制字符（128 位）
        });
}
//加密
module.exports = generateUUIDFromImei;