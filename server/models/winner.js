const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID
const ObjectIdType = mongoose.Schema.Types.ObjectId

const winnerSchema = new mongoose.Schema({
	lotteryId: ObjectIdType,
	userId: ObjectIdType,
	level: Number
})


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