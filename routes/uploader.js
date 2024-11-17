const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
const {UPLOAD_PATH, MAX_FILE_SIZE} = require("../model/config");
const {json_fail, json_success} = require("../model/output");


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename(req, file, cb) {
        const uniqueName = Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage,limits: { fileSize: MAX_FILE_SIZE } });//单文件限制50MB

/**
 * 上传单个文件
 */
router.post('/single',upload.single('file'),(req, res) => {
    if(!req.file){
        return res.send(json_fail('请上传文件！'))
    }
    return res.send(json_success({file:{filename: req.file.filename,size:req.file.size}}));
});

/**
 * 上传多个文件，最多同时上传5个
 */
router.post('/multi',upload.array('files',5),(req, res) => {

})
module.exports = router;