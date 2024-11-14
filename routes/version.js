let express = require('express');
let isAuth = require('./authentication')
let router = express.Router();

/* GET users listing. */
router.get('/', isAuth,function(req, res, next) {
    res.render('hospital/list', {title:'版本管理'});
});

module.exports = router;
