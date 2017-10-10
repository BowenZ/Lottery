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
	lottery.save().then(data => {
		console.log('====save lottery====', data)
		res.json({
			success: true,
			data
		})
	}).catch(err => {
		res.json({
			success: false,
			msg: '添加抽奖请求失败',
			err
		})
	})
})

router.get('/lottery', (req, res) => {
	let queryLottery
	if(req.query.type == 'active'){
		queryLottery = Lottery.findActive()
	}else{
		queryLottery = Lottery.findAll()
	}
	queryLottery.then(data => {
		res.json({
			success: true,
			data
		})
	}).catch(err => {
		res.json({
			success: false,
			msg: '查询抽奖信息出错',
			err
		})
	})
})

router.get('/lottery/:id', function(req, res){
	console.log('====param====', req.param)
	if(req.params){

	}
})

router.delete('/lottery/:id', (req, res) => {
	if(req.params){
		Lottery.deleteOne(req.params.id).then(data => {
			console.log('====data====', data)
			res.json({
				success: true,
				data
			})
		}).catch(err => {
			res.json({
				success: false,
				err
			})
		})
	}else{
		res.json({
			success: false,
			msg: '未指定删除数据的id'
		})
	}
})

router.put('/lottery/:id', (req, res) => {
	if(req.params){
		Lottery.changeState(req.params.id, req.body.state).then(data => {
			res.json({
				success: true,
				data
			})
		}).catch(err => {
			res.json({
				success: false,
				err
			})
		})
	}else{
		res.json({
			success: false,
			msg: '未指定数据的id'
		})
	}
})

module.exports = router;
