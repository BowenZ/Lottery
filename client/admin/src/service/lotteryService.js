import {fetch} from './fetch.js'
import api from './api.js'

const addLottery = function(data){
	return fetch(api.ADD_LOTTERY, {
		data
	})
}

export default {
	addLottery
}