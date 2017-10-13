<template>
<div class="lottery-page"
     v-loading="loading"
     element-loading-text="正在读取数据，请稍后...">
  <div class="bg-wrapper"></div>
  <div class="logo">
    <router-link :to="{name: 'lotteryAdmin'}">
      <img src="~@/assets/img/logo.png"
           alt="">
    </router-link>
  </div>
  <div class="lottery-wrapper">
    <div class="title">
      <h1>一步用车创业者激励大奖</h1>
      <h2>创业并不孤独，一步与你同路</h2>
    </div>
    <div class="content"
         v-show="!showResult && !ended">
      <div class="user-list">
        <h3>当前参与人数</h3>
        <h4>
					<span>{{joinCount}}</span>人
				</h4>
        <div class="user-pool-container"
             v-show="!running">
          <div class="user-pool">
            <ul v-if="this.users">
              <li v-for="(user, index) in users"
                  :key="index">
                {{user.tel}}
              </li>
            </ul>
          </div>
          <img class="cover cover-top"
               src="~@/assets/img/cover.png"
               alt="">
          <img class="cover cover-bottom"
               src="~@/assets/img/cover.png"
               alt="">
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
      <div class="current-winner"
           v-if="showResult">
        <div class="winner-list"
             :class="getWinnerFontSize()">
          <div v-for=" (winner, index) in currentWinner"
               :key="index"
               v-html="hideTel(winner.tel)"></div>
        </div>
        <p v-if="currentWinner.length>1">恭喜以上{{chineseNumber[currentWinner.length-1]}}位获得</p>
        <p v-if="currentWinner.length==1">恭喜该用户获得</p>
        <h3>{{currentPrize.prizeTitle}}</h3>
        <a href="#"
           class="primary-btn next-btn"
           @click.prevent.stop="nextLottery">确认</a>
      </div>
      <div class="final-result"
           v-if="ended && !showSpecial">
        <h3 @click="showSpecial = true">所有奖项已抽取完毕</h3>
        <h4>请以上中奖人员，前往外场一步用车工作处兑奖</h4>
        <div class="final-winners"
             v-if="lottery && lottery.prizes.length !=3">
          <div class="winner-container"
               v-for="(item, index) in lottery.prizes"
               :key="index">
            <h4>{{chineseNumber[item.level-1]}}等奖：{{item.prizeTitle}}</h4>
            <ul>
              <li v-for="(winner, winnerIndex) in item.winners"
                  :key="winnerIndex"
                  v-html="hideTel(winner.tel)"></li>
            </ul>
          </div>
        </div>
        <div class="final-winners"
             v-if="lottery && lottery.prizes.length ==3">
          <div class="winner-col">
            <div class="winner-container">
              <h4>一等奖：{{lottery.prizes[0].prizeTitle}}</h4>
              <ul>
                <li v-for="(winner, winnerIndex) in lottery.prizes[0].winners"
                    :key="winnerIndex"
                    v-html="hideTel(winner.tel)"></li>
              </ul>
            </div>
            <div class="winner-container">
              <h4>二等奖：{{lottery.prizes[1].prizeTitle}}</h4>
              <ul>
                <li v-for="(winner, winnerIndex) in lottery.prizes[1].winners"
                    :key="winnerIndex"
                    v-html="hideTel(winner.tel)"></li>
              </ul>
            </div>
          </div>
          <div class="winner-col">
            <div class="winner-container">
              <h4>三等奖：{{lottery.prizes[2].prizeTitle}}</h4>
              <ul>
                <li v-for="(winner, winnerIndex) in lottery.prizes[2].winners"
                    :key="winnerIndex"
                    v-html="hideTel(winner.tel)"></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="special-prize"
           v-if="showSpecial">
        <h3>特等奖</h3>
        <p>今日参与抽奖活动的创业者</p>
        <p>都将获得价值<span>555</span>元创业者激励礼券包！</p>
        <div class="download-app">
          请下载一步用车App， 明日10:00后查收礼券包
        </div>
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
      currentWinner: [],
      loadStep: 0,
      loading: true,
      showSpecial: false
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
        this.loadStep++
        this.addNewUser()
      }
    })
    lotteryService.findActiveLottery().then(res => {
      let result = res.data
      if (result.success) {
      	if(!result.data){
      		this.ended = true
          this.showSpecial = true
      	}
        this.lottery = result.data
        this.loadStep++
      }
      setTimeout(() => {
        if (!this.currentPrize) {
          this.ended = true
        }
      }, 10)
    })
  },
  watch: {
    loadStep(step) {
      if (step === 2) {
        this.loading = false
        this.checkOldWinner()
      }
    }
  },
  mounted() {
    window.addEventListener('keyup', e => {
      if (e.keyCode === 32) {
        if (this.showResult) {
          this.nextLottery()
        } else {
          this.handleClickBtn()
        }
      }
    })
    setTimeout(() => {
      this.autoScrollPool()
      if (window.innerWidth / window.innerHeight > 1.69) {
        this.$el.classList.add('narrow')
      }
      if (window.innerWidth / window.innerHeight > 2.9) {
        this.$el.classList.add('super-narrow')
      }
    }, 500)

  },
  beforeDestroy() {
    this.sse && this.sse.close()
  },
  methods: {
    addNewUser() {
      setTimeout(() => {
        if (!this.running && this.joinCount > 16) {
          this.joinCount += Math.floor(Math.random() * 5)
          this.addNewUser()
        }
      }, Math.floor(Math.random() * 3 + 2) * 1000)
    },
    checkOldWinner() {
      if (this.lottery.prizes.some(item => item.winners.length > 0)) {
        let oldWinners = []
        this.lottery.prizes.forEach(item => {
          if (item.winners.length > 0) {
            oldWinners = oldWinners.concat(item.winners)
          }
        })
        this.users = this.users.filter(item => {
          return !oldWinners.some(winner => {
            return winner._id === item._id
          })
        })
      }
    },
    hideTel(tel) {
      return tel.substr(0, 3) + '<span class="hide-tel">一步用车</span>' + tel.substr(-4, 4)
    },
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
      let scrollStep = 1
      let timer = setInterval(() => {
        if (!$pool) {
          return
        }
        if ($pool.clientHeight + $pool.scrollTop === $pool.scrollHeight) {
          scrollStep = 0
          $pool.scrollTop = 0
        }
        $pool.scrollTop = scrollStep++
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
      let userLength = this.users.length
      if (!userLength || userLength < 1) {
        this.$message({
          message: '参与人数过少',
          type: 'error'
        })
      }
      if (userLength < this.currentPrize.number) {
        alert('参与人数小于中奖人数')
        return
      }

      this.running = true
      this.lotteryTimer = setInterval(() => {
        this.randomIndexList = this.getRandomIndex(userLength, this.currentPrize.number)
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

      lotteryService.setLotteryWinner(this.lottery._id, prizeId, JSON.stringify(winnerList)).then(res => {
        console.log('====set winner====', res)
      })

      this.showResult = true
    },
    nextLottery() {
      this.currentPrize.prizeState = 1
      this.showResult = false
      if (!this.currentPrize) {
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
  ul {
    list-style-type: none;
  }
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
      z-index: 9;
    }
  }
  .primary-btn {
    display: block;
    width: 100%;
    height: 6rem;
    border-radius: 1rem;
    overflow: hidden;
    background: #1466b2;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .3);
    text-decoration: none;
    line-height: 6rem;
    text-align: center;
    color: #fff;
    font-size: 2.5rem;
  }
  .hide-tel {
    font-size: 0.8em;
    vertical-align: baseline;
    color: #b8d6f1;
    margin: 0 0.5rem;
    position: relative;
    bottom: 0.1em;
  }
  .lottery-wrapper {
    position: absolute;
    max-width: 1280px;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    color: #e8e8e8;
    padding: 3% 2% 5%;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      h1 {
        font-weight: normal;
        font-size: 4rem;
        margin-top: 1rem;
        margin-bottom: 0;
      }
      h2 {
        font-weight: normal;
        font-size: 2.5rem;
        margin-bottom: 4rem;
      }
    }
    .content {
      flex: 1;
      display: flex;
      overflow: hidden;
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
          font-size: 2rem;
        }
        h4 {
          margin-top: 1rem;
          font-size: 2rem;
          font-weight: normal;
          span {
            font-size: 5rem;
            font-weight: bold;
            color: #fff;
          }
        }
        .user-pool-container {
          flex: 1;
          font-size: 3rem;
          margin-top: 1rem;
          margin-bottom: 3rem;
          overflow: hidden;
          position: relative;
          .user-pool {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .cover {
            position: absolute;
            width: 100%;
            height: auto;
            left: 0;
            &.cover-top {
              top: 0;
            }
            &.cover-bottom {
              bottom: 0;
              transform: rotate(180deg);
            }
          }
        }
        .lottery-box {
          flex: 1;
          font-size: 3rem;
          overflow: hidden;
          display: flex;
          padding-bottom: 15%;
          ul {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          li {
            letter-spacing: 0.3rem;
            margin-bottom: 0.8rem;
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
              width: 9rem;
            }
            p {
              font-size: 2rem;
              margin: 1rem 0;
            }
          }
          .prize-content {
            flex: 1;
            margin-left: 7%;
            h3 {
              font-size: 3rem;
              font-weight: normal;
            }
            p {
              font-size: 2.2rem;
            }
          }
        }
        .start-btn {
          margin-top: 4rem;
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
          font-size: 3rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &.size-1 {
            font-size: 5rem;
          }
          &.size-2 {
            font-size: 4rem;
          }
          >div {
            margin-bottom: 1rem;
          }
        }
        p {
          font-size: 2rem;
          margin: 0;
        }
        h3 {
          font-size: 3rem;
          margin: 1.2rem 0 2rem;
          font-weight: normal;
        }
        .next-btn {
          max-width: 20rem;
          margin: 0 auto 2rem;
          font-size: 2rem;
			    height: 5rem;
			    line-height: 5rem;
          border-radius: 0.3rem;
        }
      }
      .final-result {
        width: 100%;
        display: flex;
        flex-direction: column;
        h3 {
          font-size: 3rem;
          font-weight: normal;
          margin-bottom: 0;
        }
        h4 {
          font-weight: lighter;
          font-size: 2rem;
          margin: 1.5rem 0 0.5rem;
        }
        .final-winners {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          .winner-col {
            flex: 1;
            ul {
              list-style: none;
            }
            .winner-container {
            	h4{
        		    margin: 3rem 0 1.5rem;
            	}
              li {
                font-size: 2.8rem;
                margin-bottom: 1.5rem;
              }
            }
          }
        }
      }
      .special-prize {
  	    width: 100%;
  	   	display: flex;
   	    flex-direction: column;
        justify-content: center;
    		padding-bottom: 5rem;
        h3 {
          font-size: 5rem;
    			margin: 2rem 0;
        }
        p {
          font-size: 2.5rem;
    			margin: 0.5rem 0;
          span {
  	        font-size: 5rem;
    				font-weight: bold;
				    vertical-align: middle;
            color: #fdd000;
          }
        }
        .download-app{
	        font-size: 2rem;
    			margin-top: 2rem;
        }
      }
    }
  }
}

/* .lottery-page.narrow {
  .lottery-wrapper .result-container .final-result {
    >h3 {
      margin: 0;
    }
    >h4 {
      margin: 1rem 0 0;
    }
  }
}

.lottery-page.super-narrow {
  .primary-btn {
    border-radius: 0.3rem;
  }
  .lottery-wrapper {
    padding: 2rem;
    .title h1 {
      font-size: 2.3rem;
      margin-top: 0.5rem;
    }
    .content .user-list {
      h4 {
        margin-bottom: 1rem;
      }
      .user-pool-container {
        margin-top: 0rem;
        margin-bottom: 1rem;
      }
      .user-pool {
        margin: 0 0 2rem;
      }
    }
    .result-container {
      padding-top: 1rem;
      padding-bottom: 1rem;
      .final-result {
        h3 {
          margin: 1rem 0 0;
        }
        h4 {
          margin: 1rem 0 0;
        }
        .winner-container h4 {
          margin: 2rem 0 1rem;
          ;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  html {
    font-size: 14px;
  }
}

@media screen and (max-width: 1000px) {
  html {
    font-size: 12px;
  }
}

@media screen and (max-width: 800px) {
  html {
    font-size: 10px;
  }
  .lottery-page .logo img {
    width: 13rem;
    left: 2%;
  }
} */
</style>
