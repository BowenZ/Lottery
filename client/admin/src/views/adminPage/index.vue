<template>
<div class="main-wrapper">
  <div class="nav-container">
    <el-menu theme="dark"
             :default-active="activeIndex"
             mode="horizontal">
      <el-menu-item index="1">抽奖管理</el-menu-item>
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
    	 activeIndex: '1',
    }
  }
};

</script>

<style lang="scss">
.nav-container{
	position: fixed;
	top: 0;
	width: 100%;
}
.main-container{
	max-width: 1024px;
	margin: 60px auto 0;
}
</style>
