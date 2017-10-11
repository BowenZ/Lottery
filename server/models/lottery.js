const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID
const ObjectIdType = mongoose.Schema.Types.ObjectId

const lotterySchema = new mongoose.Schema({
	title: String,
	content: String,
	companyName: String,
	companyLogo: String,
	level: Number,
	prizes: [{
		level: {
			type: Number,
			default: 1
		},
		prizeTitle: String,
		prizeContent: String,
		imgurl: [String],
		number: {
			type: Number,
			default: 1
		},
		prizeState: {
			type: Number,
			default: 0
		},
		winners: []
	}],
	state: {
		type: Number,
		default: 0
	},
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

LotteryModel.setWinner = function(prizeId, winner){
	return this.findOneAndUpdate({
		'prizes._id': ObjectID(prizeId)
	}, {
		$set: {
			'prizes.$.prizeState': 1,
			'prizes.$.winners': winner
		}
	})
}

LotteryModel.clearWinner = function(id){
	return new Promise((resolve, reject) => {
		this.findOne({
			_id: ObjectID(id)
		}).then(doc => {

			let prizes = doc.prizes
			prizes.forEach(prize => {
				prize.prizeState = 0
				prize.winners = []
			})

			this.update({
				_id: ObjectID(id)
			}, {
				$set: {
					prizes
				}
			}).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})

		}).catch(err => {
			reject(err)
		})
	})
	
}

module.exports = LotteryModel