const mongoose = require('../lib/mongo.js')
const ObjectID = require('mongodb').ObjectID
const ObjectId = mongoose.Schema.Types.ObjectId

const partiSchema = new mongoose.Schema({
	lotteryId: ObjectId,
	userId: ObjectId
})

partiSchema.methods.findAll = function(){
	return this.model('Participation').find({})
}

partiSchema.methods.findUserByLottery = function(id){
	return this.model('Participation').find({
		_id: new ObjectID(id)
	})
}

partiSchema.methods.checkAlreadyIn = function(lotteryId, userId){
	return new Promise((resolve, reject) => {
		this.model('Participation').find({
			lotteryId: ObjectId(lotteryId),
			userId: ObjectId(userId)
		}).then(data => {
			resolve(data && data.length)
		}).catch(err => {
			reject(err)
		})
	})
}

const PartiModel = mongoose.model('Participation', partiSchema)

PartiModel.prototype.takePartIn = function(lotteryId, userId) {
	return this.findOneAndUpdate({
		lotteryId,
		userId
	}, {
		lotteryId,
		userId
	}, {
		upsert: true
	})
};

module.exports = PartiModel