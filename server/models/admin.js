const mongoose = require('../lib/mongo.js')

const adminSchema = new mongoose.Schema({
	name: String,
	password: String
})

adminSchema.methods.findOne = function(name, password){
	return this.model('Admin').find({
		name,
		password
	})
}

const AdminModel = mongoose.model('Admin', adminSchema)

module.exports = AdminModel