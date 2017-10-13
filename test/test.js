let axios = require('axios')

function randomNumber() {
	return String(Math.random()).subStr()
}

let failCount = 0
let errCount = 0
let current = 0

let timer = setInterval(()=>{
	axios.post('http://106.14.92.204:3000/user/', {
		tel: Date.now()
	}).then(res => {
		if(!res.data.success){
			console.log('====fail====: ', ++failCount)
		}
	}).catch(err => {
		console.log('====err====: ', ++errCount)
	})
	if(current%100 == 0){
		console.log('====current====: ', ++current)
	}
	if(current == 25000){
		clearInterval(timer)
	}
}, 20)

