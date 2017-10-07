const mongoose = require('../lib/mongo.js')

const lotterySchema = new mongoose.Schema({
	title: String,
	content: String,
	level: Number,
	awards: [{
		level: Number,
		title: String,
		content: String,
		imgurl: String,
		number: Number,
		state: Number
	}],
	state: Number,
	createTime: {
		type: Date,
		default: Date.now
	}
})

lotterySchema.methods.findAll = function(){
	return this.model('Lottery').find({})
}

const LotteryModel = mongoose.model('Lottery', lotterySchema)

module.exports = LotteryModel