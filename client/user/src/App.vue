<template>
<div id="app">
  <div class="bg">
    <img v-if="!lotteryEnded" src="~@/assets/bg.jpg"
         alt="">
    <img v-else src="~@/assets/bg2.jpg"
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
    <h2>参与成功!</h2>
    <h3>{{user.tel}}</h3>
    <p>请关注大屏抽奖信息</p>
  </div>
  <!-- <div class="ended shadow-box"
       v-if="lotteryEnded">
    <h2>活动已结束</h2>
    <h3 v-if="user">{{user.tel}}</h3>
    <p>如需领取奖励，请前往外场一步用车工作处兑奖。</p>
  </div> -->
  <div class="register" v-if="lotteryEnded">
    <div class="input-container shadow-box" v-if="!registerEnded">
      <div class="tel-input">
        <input type="tel"
               v-model="userTel"
               placeholder="请输入您的手机号">
      </div>
      <a href="#"
         @click="handleClickRegister">注册账号</a>
    </div>
    <div class="register-success shadow-box" v-if="registerEnded">
      <h2>参与成功</h2>
      <h3>{{userTel}}</h3>
      <p>新用户请于明日10时从您的钱包-优惠券处查看大礼包</p>
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.usercar.yongche" class="download-btn">
        即刻下载APP，享受便捷出行
      </a>
    </div>
    <div class="bottom-text">
      <img src="~@/assets/copy2.png"
           alt="">
    </div>
  </div>
</div>

</template>

<script>
import axios from 'axios';
import qs from 'qs'
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
let URL = 'http://106.14.92.204:3000/'
export default {
  name: 'app',
  components: {},
  data() {
    return {
      userTel: '',
      user: null,
      lotteryEnded: false,
      registerEnded: false,
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
          tel: this.userTel,
          from: 'lottery'
        }).then(res => {
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
              axios.post('http://wx.1byongche.com/invite/regist-in-phone.html', qs.stringify({
                phone: this.userTel,
                certkey: '17e5a0d2e2387b35fd752b581634700a'
              })).then(res => {
                console.log('====user====', res)
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
    },
    handleClickRegister(){
      if (!this.checkTel()) {
        Toast({
          message: '您输入的手机号有误',
          position: 'bottom'
        })
      } else {
        Indicator.open('加载中...')
        axios.post('http://wx.1byongche.com/invite/regist-in-phone.html', qs.stringify({
          phone: this.userTel,
          certkey: '17e5a0d2e2387b35fd752b581634700a'
        })).then(res => {
          Indicator.close()
          console.log('====user====', res)
          if(res.data.code == 0){
            this.registerEnded = true
            Toast({
              message: '恭喜您注册成功'
            })
            axios.post(URL + 'user', {
              tel: this.userTel,
              from: '555coupon'
            }).then(res => {
              console.log('====mongo====', res)
            })
          }else{
            Toast({
              message: res.data.msg || '注册失败'
            })
            if(res.data.msg == '该用户已注册'){
              this.registerEnded = true
            }
          }
        }).catch(err => {
          Indicator.close()
        })
      }
    }
  },
  created() {
    this.user = this.getUser()
    axios.get(URL + 'lottery?type=active').then(res => {
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
    if (window.innerHeight / window.innerWidth < 1.5) {
      this.$el.className = 'tiny'
    } else if (window.innerHeight / window.innerWidth < 1.58) {
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
  overflow: auto;
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
  margin-top: 6%;
  margin-bottom: 2%;
  img {
    display: block;
    width: 100%;
  }
}

.waiting, .ended {
  background-color: #fff;
  text-align: center;
  padding: 7vw 0 10vw;
  h2 {
    margin: 0 0 3vw;
    font-size: 7vw;
  }
  h3 {
    margin: 0;
    font-weight: normal;
    font-size: 5.5vw;
  }
  p {
    margin: 3vw 0 0;
    font-size: 3.6vw;
  }
}

.register{
  .register-success{
    background-color: #fff;
    text-align: center;
    padding: 3vw 0 0;
    h2 {
      margin: 0 0 2vw;
      font-size: 7vw;
    }
    h3 {
      margin: 0;
      font-weight: normal;
      font-size: 5.5vw;
    }
    p {
      margin: 2vw 0 3vw;
      font-size: 3.6vw;
    }
    .download-btn{
      width: 100%;
      height: 11vw;
      line-height: 11vw;
      background-color: $yellow;
      display: block;
      text-decoration: none;
      color: $dark
    }
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
