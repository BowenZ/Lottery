import api from './api.js'

export default {
	getImgUrl: function(img){
		return api.BASE + img
	}
}