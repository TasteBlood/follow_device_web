let express = require('express');
let isAuth = require('./authentication')
let router = express.Router();

/* GET users listing. */
router.get('/',function(req, res, next) {
    res.render('version/list', {title:'版本管理'});
});

module.exports = router;
