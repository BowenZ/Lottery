const mongoose = require('../lib/mongo.js')

const lotterySchema = new mongoose.Schema({
	title: String,
	content: String,
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

lotterySchema.methods.findAll = function(){
	return this.model('Lottery').find({})
}

const LotteryModel = mongoose.model('Lottery', lotterySchema)

module.exports = LotteryModel