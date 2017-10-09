const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID

const userSchema = new mongoose.Schema({
	name: String,
	tel: String,
	createTime: {
		type: Date,
		default: Date.now
	},
	state: {
		type: Number,
		default: 0
	}
})

const UserModel = mongoose.model('User', userSchema)

UserModel.findOne = function(openid){
	return this.findOne({
		'wx.openid': openid
	})
}

UserModel.findAll = function(openid) {
	return this.find({})
}

UserModel.clear = function() {
	return this.remove({})
}

UserModel.findRandom = function() {
	return new Promise((resolve, reject) => {
		this.count({state: 0}).exec().then(count => {
			console.log('====count====', count)
			let random = Math.floor(Math.random() * count)
			this.find({state: 0}).skip(random).limit(1).exec().then(result => {
				console.log('====result====', result)
				this.findOneAndUpdate({
					_id: ObjectID(result[0]._id)
				}, {
					state: 1
				}).then(res => {
					resolve(res)
				}).catch(err => {
					console.log('====err1====', err)
					reject(err)
				})
			}).catch(err => {
				console.log('====err2====', err)
				reject(err)
			})
		}).catch(err => {
			console.log('====err3====', err)
			reject(err)
		})
	})
}

UserModel.changeState = function(id, state) {
	return this.update()
}

module.exports = UserModel