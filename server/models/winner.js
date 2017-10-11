const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID
const ObjectIdType = mongoose.Schema.Types.ObjectId

const winnerSchema = new mongoose.Schema({
	lotteryId: {
		type: ObjectIdType,
		ref: 'Lottery'
	},
	userId: {
		type: ObjectIdType,
		ref: 'User'
	},
	level: Number
})

const WinnerModel = mongoose.model('Winner', winnerSchema)

WinnerModel.findWinnerByLottery = function(lotteryId){
	return this.find()
}

module.exports = WinnerModel