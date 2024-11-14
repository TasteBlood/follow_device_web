function json_success(data) {
    return {code:0,msg:'操作成功',...data}
}
function json_fail(msg) {
    return {code: -1,msg}
}

module.exports = {json_success, json_fail};