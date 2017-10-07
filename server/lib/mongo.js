var config = require('config-lite')(__dirname)
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(config.mongodb, {
	useMongoClient: true,
}).then(db => {
	// console.log('====db connected====', db)
	// db.getCollection('Admin').find({}).then(data=>{
	// 	console.log('====data====', data)
	// })
})

module.exports = mongoose