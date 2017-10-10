<template>
  <div class="lottery-page">
  	<div class="user-pool">
  		<ul v-if="this.users">
  			<li v-for="(user, index) in users" :key="index">
  				{{user.tel}}
  			</li>
  		</ul>
  	</div>
		<button @click="startLottery(5)">start</button>
  	<button @click="stopLottery">stop</button>
  	<div class="lottery-box">
  		<ul>
  			<li v-for="(item, index) in randomIndexList" :key="index">
  				{{users[item].tel}}
  			</li>
  		</ul>
  	</div>
  	<hr>
  	{{randomIndexList}}
  </div>
</template>
<script>
import userService from '@/service/userService'
import lotteryService from '@/service/lotteryService'
export default {

  name: 'startLottery',

  data() {
    return {
    	sse: null,
    	users: [],
    	randomIndexList: [],
    	lotteryTimer: null
    };
  },
  created(){
  	userService.findAllUser().then(res => {
  		console.log('====res====', res)
  		let result = res.data
  		if(result.success){
  			this.users = result.data
  		}
  	})
  	lotteryService.findActiveLottery().then(res => {
  		console.log('====lottery====', res)
  	})
  },
  mounted() {
		window.addEventListener('keyup', e => {
			if(e.keyCode == 32){
				console.log('====e====', e)
			}
		})
    setTimeout(() => {
    	this.autoScrollPool(0)
    },  1000)
  },
  beforeDestroy(){
  	this.sse && this.sse.close()
  },
  methods: {
  	loadNewUser(){
  		var source = new EventSource('http://localhost:3000/user/stream')
	    source.onopen = function(event) {
	      console.log('open',event)
	    }

	    source.onmessage = function(event) {
	      console.log('msg',event)
	    }

	    source.onerror = function(error) {
	      console.log('error',error)
	    }
	    this.sse = source
  	},
  	autoScrollPool(){
  		let $pool = this.$el.querySelector('.user-pool')
  		let timer = setInterval(()=>{
  			if($pool.clientHeight + $pool.scrollTop == $pool.scrollHeight){
  				$pool.scrollTo(0,0)
  			}
  			$pool.scrollBy(0, 1)
  		}, 20)
  	},
  	getRandomIndex(length, count){
  		let n = count
  		let ret = {}
  		while(n){
  			let random = Math.floor(Math.random() * length)
  			if(!ret[random]){
  				ret[random] = true
  				n--
  			}
  		}
  		return Object.keys(ret)
  	},
  	startLottery(count){
  		let length = this.users.length
  		this.lotteryTimer = setInterval(()=>{
  			this.randomIndexList = this.getRandomIndex(length, count)
  		},80)
  	},
  	stopLottery(){
  		clearInterval(this.lotteryTimer)
  		let winnerList = this.randomIndexList.map(item => {
  			return this.users[item]
  		})
  		this.users = this.users.filter(item => {

  			return !winnerList.some(winner => {
  				return winner._id == item._id
  			})
  		})
  		console.log('====user====', this.users)
  		console.log('====winner====', winnerList)
  	},
  	handleEnterSpace(){
  		console.log('====space====', )
  	}
  }
};

</script>
<style lang="scss">
.lottery-page{
	.user-pool{
		overflow: hidden;
		max-height: 200px;
	}
}

</style>
