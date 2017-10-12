<template>
<div class="main-wrapper">
  <div class="nav-container">
    <el-menu theme="dark"
             :default-active="activeIndex"
             :router="true"
             mode="horizontal">
      <el-menu-item index="/startLottery">开始抽奖</el-menu-item>
      <el-menu-item index="/admin/lotteryAdmin">抽奖活动管理</el-menu-item>
      <el-menu-item index="/admin/userAdmin">用户管理</el-menu-item>
      <el-menu-item index="/login" @click="logout" class="right-menu">退出</el-menu-item>
    </el-menu>
  </div>
  <div class="main-container">
  	<router-view></router-view>
  </div>
</div>

</template>

<script>
export default {

  name: 'adminIndex',

  data() {
    return {
    	 activeIndex: '2',
    }
  },
  created(){
    this.activeIndex = this.$route.fullPath
  },
  methods: {
    logout(){
      this.$store.commit('logout')
    }
  }
};

</script>

<style lang="scss">
.nav-container{
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 9;
  .right-menu{
    float: right;
  }
}
.main-container{
	max-width: 1200px;
	margin: 60px auto 0;
	padding: 20px;
}
</style>
