import {fetch} from './fetch.js'
import api from './api.js'

const login = function(username, password){
	return fetch(api.LOGIN, {
		username,
		password
	})
}

export default {
	login
}