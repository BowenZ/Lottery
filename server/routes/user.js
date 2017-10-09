var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

router.post('/init', function(req, res, next) {
  
});

router.post('/join', (req, res) => {
	let params = {
		openid: req.body.openid,

	}
})

router.post('/', (req, res) => {
	let params = {
		name: req.body.name,
		tel: req.body.tel
	}
	console.log('====params====', params)
	let user = new User(params)
	user.save().then(data => {
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
})

router.get('/', (req, res) => {
	User.findAll().then(data => {
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
})

router.get('/random', (req, res) => {
	User.findRandom().then(data => {
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
})

router.get('/:id', (req, res) => {
	User.findOne(req.params.id).then(data => {
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
})

router.delete('/', (req, res) => {
	User.clear().then(data => {
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
})

module.exports = router;
