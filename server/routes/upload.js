var express = require('express');
var router = express.Router();
var path = require('path');

var fs = require('fs'),
    multer = require('multer'),
    upload = multer({
        dest: '/public/upload/img'
    });
router.post('/img', upload.single('img'), function(req, res, next) {
	console.log('====req.file====', req.file)
    if (req.file == undefined) {
        res.json({
            success: false,
            msg: 'no file'
        });
        return;
    }

    var tmp_path = req.file.path;

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var file_name = (Date.now()) + (Math.random()+'').substr(-5) + ('.' + req.file.originalname.split('.').pop());
    var target_path = path.join(__dirname, '../public/upload/img/') + file_name;
    console.log('====target_path====', target_path)
    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        res.json({
            success: true,
            filename: '/public/upload/img/' + file_name
        });
    });
    src.on('error', function(err) {
        res.json({
            success: false,
            msg: err
        });
    });
    return;
});

module.exports = router;