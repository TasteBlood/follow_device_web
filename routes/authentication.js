// 检查登录状态的中间件
function isAuthenticated(req, res, next) {
    //ajax请求的处理
    if(req.headers['x-requested-with'] === 'XMLHttpRequest') {
        if(!req.session.user) {
            return res.status(401).json({error: '未登录或登录失效！'});
        }
        return next()
    }else{
        //不是ajax请求
        if (req.session && req.session.user) {
            // 如果用户已登录，继续处理下一个中间件或路由
            res.locals.user = req.session.user;
            return next();
        } else {
            // 如果未登录，返回错误或重定向
            res.redirect('/')
        }
    }
}
module.exports = isAuthenticated;
