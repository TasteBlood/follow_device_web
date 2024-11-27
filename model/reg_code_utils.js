const crypto = require('crypto');
//加密的key
const key = '1!2@3#4$5%';
// 计算注册码的工具
function generateUUIDFromImei(imei) {
    // 获取当前的时间戳（以毫秒为单位）
    const timestamp = Date.now().toString();

    // 将 IMEI 和时间戳结合起来，进行 SHA-256 哈希计算
    const dataToHash = imei + timestamp + key;
    return crypto.createHash('md5').update(dataToHash).digest('hex');
}
//加密
module.exports = generateUUIDFromImei;