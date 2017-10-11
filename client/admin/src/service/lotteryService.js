import {fetch} from './fetch.js'
import api from './api.js'

const addLottery = function(data){
	return fetch(api.ADD_LOTTERY, {
		data
	})
}

const findAllLottery = function(){
	return fetch(api.FIND_ALL_LOTTERY, null, 'get')
}

const deleteLottery = function(id){
	return fetch(api.LOTTERY + '/' + id, null, 'delete')
}

const startLottery = function(id){
	return fetch(api.LOTTERY + '/' + id, {
		state: 1
	}, 'put')
}

const stopLottery = function(id){
	return fetch(api.LOTTERY + '/' + id, {
		state: 2
	}, 'put')
}

const findActiveLottery = function(){
	return fetch(api.LOTTERY + '?type=active', null, 'get')
}

const setLotteryWinner = function(lotteryId, prizeId, winner){
	return fetch(api.LOTTERY + '/' + lotteryId, {
		prizeId,
		winner
	}, 'put')
}

const clearLotteryWinner = function(id){
	return fetch(api.LOTTERY + '/' + id + '?param=clearWinner', null, 'put')
}

export default {
	addLottery,
	findAllLottery,
	deleteLottery,
	startLottery,
	stopLottery,
	findActiveLottery,
	setLotteryWinner,
	clearLotteryWinner
}