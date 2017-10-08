var express = require('express');
var router = express.Router();
var Admin = require('../models/admin.js')
var Lottery = require('../models/lottery.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res){
	let username = req.body.username
	let password = req.body.password
	let admin = new Admin()
	admin.findOne(username, password).then(data => {
		let result = {
			success: false
		}
		if(data && data.length){
			result.success = true
			result.data = data[0]
		}else{
			result.msg = '用户名或密码错误'
		}
		res.json(result)
	})
})

router.post('/lottery', function(req, res){
	console.log('====req====', req.body)
	let data = JSON.parse(req.body.data)
	data.state = 0
	let lottery = new Lottery(data)
	lottery.save().then(res => {
		console.log('====save lottery====', res)
	})
})

module.exports = router;
