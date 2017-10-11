<template>
<div class="lottery-page">
  <div class="bg-wrapper"></div>
  <div class="logo">
    <img src="~@/assets/img/logo.png"
         alt="">
  </div>
  <div class="lottery-wrapper">
    <div class="title">
      <h1>一步用车创业者激励大奖</h1>
      <h2>创业并不孤独，一步与你同路</h2>
    </div>
    <div class="content"
         v-if="!showResult && !ended">
      <div class="user-list">
        <h3>当前参与人数</h3>
        <h4>
						<span>{{joinCount}}</span>人
					</h4>
        <div class="user-pool"
             v-show="!running">
          <ul v-if="this.users">
            <li v-for="(user, index) in users"
                :key="index">
              {{user.tel}}
            </li>
          </ul>
        </div>
        <div class="lottery-box"
             v-if="running && randomIndexList">
          <ul>
            <li v-for="(item, index) in randomIndexList"
                :key="index">
              {{users[item] && users[item].tel}}
            </li>
          </ul>
        </div>
      </div>
      <div class="prize-container"
           v-if="lottery">
        <div class="prize">
          <div class="company-info">
            <img :src="getImgUrl(lottery.companyLogo)"
                 alt="">
            <p>{{lottery.companyName}}</p>
          </div>
          <div class="prize-content"
               v-if="currentPrize">
            <h3>{{chineseNumber[currentPrize.level-1]}}等奖奖品：</h3>
            <p>{{currentPrize.prizeTitle}}x{{currentPrize.number}}</p>
          </div>
        </div>
        <a href="#"
           class="start-btn primary-btn"
           @click.prevent.stop="handleClickBtn">
					<span v-if="running">停</span>
					<span v-else>开始抽奖</span>
				</a>
      </div>
    </div>
    <div class="result-container"
         v-if="showResult || ended">
      <div class="current-winner" v-if="showResult">
        <div class="winner-list"
             :class="getWinnerFontSize()">
          <div v-for=" (winner, index) in currentWinner"
               :key="index">{{winner.tel}}</div>
        </div>
        <p v-if="currentWinner.length>1">恭喜以上{{chineseNumber[currentWinner.length-1]}}位获得</p>
        <p v-if="currentWinner.length==1">恭喜该用户获得</p>
        <h3>{{currentPrize.prizeTitle}}</h3>
        <a href="#"
           class="primary-btn next-btn"
           @click="nextLottery()">确认</a>
      </div>
      <div class="final-result" v-if="ended">
      	<h1>final</h1>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import userService from '@/service/userService';
import lotteryService from '@/service/lotteryService';
import fileService from '@/service/fileService';
export default {

  name: 'startLottery',

  data() {
    return {
      sse: null,
      users: [],
      randomIndexList: [],
      lotteryTimer: null,
      lottery: null,
      running: false,
      joinCount: '-',
      chineseNumber: [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ],
      showResult: false,
      ended: false,
      currentWinner: []
    }
  },
  computed: {
    prizeList() {
      if (!this.lottery || !this.lottery.prizes) {
        return null
      }
      return this.lottery.prizes.filter(item => {
        return item.prizeState === 0
      })
    },
    currentPrize() {
      return (this.prizeList && this.prizeList.length) ? this.prizeList[this.prizeList.length - 1] : null
    }
  },
  created() {
    userService.findAllUser().then(res => {
      let result = res.data
      if (result.success) {
        this.users = result.data
        this.joinCount = result.data.length
      }
    })
    lotteryService.findActiveLottery().then(res => {
      let result = res.data
      if (result.success) {
        this.lottery = result.data
      }
    })
  },
  mounted() {
    window.addEventListener('keyup', e => {
      if (e.keyCode === 32) {
      	if(this.showResult){
      		this.nextLottery()
      	}else{
      		this.handleClickBtn()
      	}
      }
    })
    setTimeout(() => {
      this.autoScrollPool(0)
    }, 1000)
  },
  beforeDestroy() {
    this.sse && this.sse.close()
  },
  methods: {
    getWinnerFontSize() {
      let level = this.currentPrize.level
      if (level > 2) {
        return 'size-' + 3
      }
      return 'size-' + level
    },
    getImgUrl(img) {
      return fileService.getImgUrl(img)
    },
    loadNewUser() {
      var source = new EventSource('http://localhost:3000/user/stream')
      source.onopen = function(event) {
        console.log('open', event)
      }

      source.onmessage = function(event) {
        console.log('msg', event)
      }

      source.onerror = function(error) {
        console.log('error', error)
      }
      this.sse = source
    },
    autoScrollPool() {
      let $pool = this.$el.querySelector('.user-pool')
      let timer = setInterval(() => {
        if ($pool.clientHeight + $pool.scrollTop === $pool.scrollHeight) {
          $pool.scrollTo(0, 0)
        }
        $pool.scrollBy(0, 1)
      }, 20)
    },
    getRandomIndex(length, count) {
      let n = count
      let ret = {}
      while (n) {
        let random = Math.floor(Math.random() * length)
        if (!ret[random]) {
          ret[random] = true
          n--
        }
      }
      return Object.keys(ret)
    },
    startLottery() {
      if (!this.currentPrize) {
        return
      }
      let length = this.users.length
      if (length < this.currentPrize.number) {
        alert('参与人数小于中奖人数')
        return
      }
      this.running = true
      this.lotteryTimer = setInterval(() => {
        this.randomIndexList = this.getRandomIndex(length, this.currentPrize.number)
      }, 80)
    },
    stopLottery() {
      this.running = false
      clearInterval(this.lotteryTimer)
      let winnerList = this.randomIndexList.map(item => {
        return this.users[item]
      })
      this.currentWinner = winnerList
      setTimeout(() => {
        this.users = this.users.filter(item => {
          return !winnerList.some(winner => {
            return winner._id === item._id
          })
        })
      }, 10)
      let prizeId = this.currentPrize._id
      this.currentPrize.winners = winnerList

      console.log('====lottery====', this.lottery)
      lotteryService.setLotteryWinner(this.lottery._id, prizeId, JSON.stringify(winnerList)).then(res => {
        console.log('====set winner====', res)
      })

      this.showResult = true
    },
    nextLottery() {
      this.currentPrize.prizeState = 1
      this.showResult = false
      if (!this.currentPrize) {
      	alert(0)
        this.ended = true
      }
    },
    handleClickBtn() {
      if (!this.running) {
        this.startLottery()
      } else {
        this.stopLottery()
      }
    }
  }
};

</script>

<style lang="scss">
.lottery-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  background: linear-gradient(to bottom, #0c5394 0%, #00386a 100%);
  .bg-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/img/bg.jpg');
    background-size: cover;
    background-position: center;
  }
  .logo {
    img {
      position: absolute;
      width: 15rem;
      display: block;
      left: 4%;
      top: 3%;
    }
  }
  .primary-btn {
    display: block;
    width: 100%;
    height: 4rem;
    border-radius: 1rem;
    overflow: hidden;
    background: #1466b2;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .3);
    text-decoration: none;
    line-height: 4rem;
    text-align: center;
    color: #fff;
    font-size: 1.6rem;
  }
  .lottery-wrapper {
    position: absolute;
    max-width: 1280px;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    color: #e8e8e8;
    padding: 2% 2% 4%;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      h1 {
        font-weight: normal;
        font-size: 2.5rem;
      }
      h2 {
        font-weight: normal;
        font-size: 1.7rem;
      }
    }
    .content {
      flex: 1;
      display: flex;
      .user-list {
        flex: 1;
        margin-right: 5%;
        background: #125696;
        box-shadow: 0 0 3rem rgba(0, 0, 0, .4);
        border-radius: 0.5rem;
        overflow: hidden;
        text-align: center;
        display: flex;
        flex-direction: column;
        h3 {
          font-weight: normal;
          margin-bottom: 0;
        }
        h4 {
          margin-top: 0.5rem;
          font-size: 1.5rem;
          font-weight: normal;
          span {
            font-size: 4rem;
            font-weight: bold;
            color: #fff;
          }
        }
        .user-pool {
          flex: 1;
          font-size: 2rem;
          margin-top: 1rem;
          margin-bottom: 3rem;
          overflow: hidden;
        }
        .lottery-box {
          flex: 1;
          font-size: 2rem;
          overflow: hidden;
          li {
            letter-spacing: 0.3rem;
          }
        }
      }
      .prize-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .prize {
          display: flex;
          .company-info {
            text-align: center;
            img {
              width: 6rem;
            }
            p {
              font-size: 1.3rem;
              margin: 1rem 0;
            }
          }
          .prize-content {
            flex: 1;
            margin-left: 7%;
            h3 {
              font-size: 1.8rem;
              font-weight: normal;
            }
            p {
              font-size: 1.5rem;
            }
          }
        }
        .start-btn {
          margin-top: 2rem;
          margin-bottom: 4rem;
        }
      }
    }
    .result-container {
      background: #125696;
      box-shadow: 0 0 3rem rgba(0, 0, 0, .4);
      border-radius: 0.5rem;
      overflow: hidden;
      text-align: center;
      flex: 1;
      padding-top: 2rem;
      padding-top: 2rem;
      padding-bottom: 2rem;
      display: flex;
      .current-winner {
        flex: 1;
        display: flex;
        flex-direction: column;
        .winner-list {
          font-size: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &.size-1{
          	font-size: 4rem;
          }
          &.size-2{
          	font-size: 3rem;
          }
        }
        p {
          font-size: 1.3rem;
          margin: 0;
        }
        h3 {
          font-size: 1.8rem;
          margin: 1rem 0 1.4rem;
        }
        .next-btn {
          max-width: 20rem;
          margin: auto;
          font-size: 1.5rem;
          height: 3rem;
          line-height: 3rem;
          border-radius: 0.3rem;
        }
      }
    }
  }
}
</style>
