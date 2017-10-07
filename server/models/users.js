const mongoose = require('../lib/mongo.js')

const userSchema = new mongoose.Schema({
	wx: {
		openid: String,
		nickname: String,
		sex: String,
		province: String,
		city: String,
		contry: String,
		headimgurl: String,
		unionid: String
	},
	tel: String,
	createTime: {
		type: Date,
		default: Date.now
	}
})

userSchema.methods.findAll = function(){
	return this.model('User').find({})
}

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel