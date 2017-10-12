var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

let newUsers = []

router.post('/init', function(req, res, next) {

});

router.post('/', (req, res) => {
	let params = {
		name: req.body.name,
		tel: req.body.tel
	}
	User.findOneUser({
		tel: params.tel
	}).then(user => {
		if (user) {
			res.json({
				success: true,
				data: user,
				alreadyIn: true
			})
		} else {
			let user = new User(params)
			user.save().then(data => {
				// newUsers.push(data)
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
		}
	}).catch(err => {
		res.json({
			success: false,
			err
		})
	})

})

router.get('/', (req, res) => {
	User.findAll({
		state: 0
	}).then(data => {
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

router.get('/stream', (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	});

	res.write("retry: 10000\n");
	res.write("event: connecttime\n");
	res.write("data: " + (new Date()) + "\n\n");
	res.write("data: " + (new Date()) + "\n\n");

	interval = setInterval(function() {
		res.write("data: " + JSON.stringify(newUsers) + "\n\n");
		newUsers = []
	}, 5000);

	req.connection.addListener("close", function() {
		clearInterval(interval);
	}, false);
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

router.delete('/:id', (req, res) => {
	let id = req.params.id
	console.log('====id====', id)
	User.deleteOne(id).then(data => {
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