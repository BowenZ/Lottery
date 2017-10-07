<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '~@/assets/sass/base.scss';
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #f3f4f5;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.mint-indicator{
  position: relative;
  z-index: 99999;
}
</style>
