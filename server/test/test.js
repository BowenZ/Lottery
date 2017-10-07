const mongoose = require('../lib/mongo.js')
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('../models/users.js')
const Admin = require('../models/admin.js')
const Parti = require('../models/participation.js')

// var user = new User()

// user.findAll().then(data => {
// 	console.log('====user====', data)
// })

// var admin = new Admin({
// 	name: 'admin',
// 	password: 'admin'
// })
// admin.save().then(data => {
// 	console.log('====save admin====', data)
// 	admin.findOne('admin', 'admin').then(data => {
// 		console.log('====find admin====', data)
// 	})
// })

let parti = new Parti({
	lotteryId: ObjectId(1),
	userId: ObjectId(2)
})

parti.checkAlreadyIn(1,2).then(res => {
	console.log('====in====', res)
	if(!res){
		parti.save().then(data => {
			console.log('====save parti====', data)
		})
	}
})
// parti.save().then()