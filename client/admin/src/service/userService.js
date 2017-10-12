import {fetch} from './fetch.js'
import api from './api.js'

const findAllUser = function(){
	return fetch(api.USER, null, 'get')
}

const deleteUser = function(id){
	return fetch(api.USER + '/' + id, null, 'delete')
}

const rigister = function(tel){
	return fetch('http://101.132.26.45:8085/invite/regist-in-phone.html', {
		phone: 13522381001,
		coupons: true
	})
}

export default {
	findAllUser,
	deleteUser,
	rigister
}