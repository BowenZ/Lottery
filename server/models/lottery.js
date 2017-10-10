const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID

const lotterySchema = new mongoose.Schema({
	title: String,
	content: String,
	companyName: String,
	companyLogo: String,
	level: Number,
	prizes: [{
		level: Number,
		prizeTitle: String,
		prizeContent: String,
		imgurl: [String],
		number: Number,
		state: Number
	}],
	state: Number,
	createTime: {
		type: Date,
		default: Date.now
	}
})

// lotterySchema.methods.findAll = function(){
// 	return this.model('Lottery').find({})
// }

const LotteryModel = mongoose.model('Lottery', lotterySchema)

LotteryModel.findAll = function(){
	return this.find({}).sort({createTime: -1}).exec()
}

LotteryModel.deleteOne = function(id){
	return this.remove({
		_id: ObjectID(id)
	})
}

LotteryModel.findActive = function(){
	return this.findOne({state: 1}).exec()
}

LotteryModel.changeState = function(id, state){
	return this.findOneAndUpdate({
		_id: ObjectID(id)
	}, {
		$set: {
			state: state
		}
	})
}

module.exports = LotteryModel