import {fetch} from './fetch.js'
import api from './api.js'

const findAllUser = function(){
	return fetch(api.USER, null, 'get')
}

export default {
	findAllUser
}