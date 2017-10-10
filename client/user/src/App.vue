<template>
<div id="app">
  <div class="bg">
    <img src="~@/assets/bg.jpg"
         alt="">
  </div>
  <div class="join"
       v-if="!user && !lotteryEnded">
    <div class="input-container shadow-box">
      <div class="tel-input">
        <input type="tel"
               v-model="userTel"
               placeholder="请输入手机号">
      </div>
      <a href="#"
         @click="handleClickJoin">参与抽奖</a>
    </div>
    <div class="bottom-text">
      <img src="~@/assets/copy.png"
           alt="">
    </div>
  </div>
  <div class="waiting shadow-box"
       v-if="user && !lotteryEnded">
    <h2>排队中</h2>
    <h3>{{user.tel}}</h3>
    <p>请关注大屏抽奖信息</p>
  </div>
  <div class="ended shadow-box"
       v-if="lotteryEnded">
    <h2>活动已结束</h2>
    <h3 v-if="user">{{user.tel}}</h3>
    <p>如需领取奖励，请前往外场对应展位核销并登记信息。</p>
  </div>
</div>

</template>

<script>
import axios from 'axios';
import { Toast,Indicator } from 'mint-ui';

let ajax = axios.create({
  baseURL: '/',
  timeout: 10000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})
let URL = 'http://192.168.1.152:3000/'
export default {
  name: 'app',
  components: {},
  data() {
    return {
      userTel: '',
      user: null,
      lotteryEnded: false
    }
  },
  methods: {
    getActiveLottery() {
      axios.get('')
    },
    getUser() {
      let user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    },
    checkTel() {
      let reg = /^((1[3-8][0-9])+\d{8})$/
      return reg.test(this.userTel)
    },
    handleClickJoin() {
      if (!this.checkTel()) {
        Toast({
          message: '您输入的手机号有误',
          position: 'bottom'
        })
      } else {
        Indicator.open('加载中...')
        axios.post(URL + 'user', {
          tel: this.userTel
        }).then(res => {
          console.log('====res====', res)
          let result = res.data
          if (result.success) {
            if (result.alreadyIn) {
              Toast({
                message: '您已参与成功，不能重复参加',
                position: 'bottom'
              })
            } else {
              Toast({
                message: '参与成功',
                position: 'bottom'
              })
            }
            this.user = result.data
            localStorage.setItem('user', JSON.stringify(result.data))
          }
          Indicator.close()
        }).catch(err => {
          Indicator.close()
        })
      }
    }
  },
  created() {
    this.user = this.getUser()
    console.log('====user====', this.user)
    axios.get(URL + 'lottery?type=active').then(res => {
      console.log('====res====', res)
      let result = res.data
      if (result.success) {
        if (!result.data) {
          this.lotteryEnded = true
        }
      } else {
        Toast({
          message: '请求失败',
          position: 'bottom'
        })
        this.lotteryEnded = true
      }
    }).catch(err => {
      Toast({
        message: '请求失败',
        position: 'bottom'
      })
      this.lotteryEnded = true
    })
  },
  mounted() {
    if (window.innerHeight / window.innerWidth < 1.46) {
      this.$el.className = 'tiny'
    } else if (window.innerHeight / window.innerWidth < 1.55) {
      this.$el.className = 'small'
    }
  }
}

</script>

<style lang="scss">
$dark: #3d3d3d;
$yellow: #f6d132;
$light: #f7f7f7;
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

#app {
  width: 100%;
  height: 100%;
  background-color: $light;
}

.bg {
  img {
    display: block;
    width: 100%;
  }
}

.shadow-box {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, .4);
  margin: -8vw 5% 0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  z-index: 9;
}

.input-container {
  display: flex;
  height: 16vw;
  .tel-input {
    flex: 1;
    input {
      margin: 0;
      padding: 0 4vw;
      border: none;
      display: block;
      width: 100%;
      height: 16vw;
      font-size: 5vw;
      vertical-align: middle;
    }
  }
  a {
    width: 34vw;
    height: 16vw;
    display: block;
    line-height: 16vw;
    text-align: center;
    text-decoration: none;
    color: $dark;
    font-size: 5vw;
    background-color: $yellow;
    transform: translate3d(0, 0, 0);
  }
}

.bottom-text {
  width: 100%;
  margin-top: 8%;
  img {
    display: block;
    width: 100%;
  }
}

.waiting, .ended {
  background-color: #fff;
  text-align: center;
  padding: 8vw 0;
  h2 {
    margin: 0;
    font-size: 7vw;
  }
  h3 {
    margin: 4vw 0 1vw;
    font-weight: normal;
    font-size: 5vw;
  }
  p {
    margin: 0;
    font-size: 3.6vw;
  }
}

#app.small {
  .bottom-text {
    margin-top: 4%;
  }
}

#app.tiny {
  .bottom-text {
    margin-top: 2%;
  }
  .bg {
    margin-top: -5%;
  }
}
</style>
