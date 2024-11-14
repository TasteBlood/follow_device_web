// 检查登录状态的中间件
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // 如果用户已登录，继续处理下一个中间件或路由
        return next();
    } else {
        // 如果未登录，返回错误或重定向
        res.redirect('/')
    }
}
module.exports = isAuthenticated;
