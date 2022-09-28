<template>
  <div class="home">
    我是home
    <router-link to="/login">登录</router-link>
    <router-link to="/analysis">跳转</router-link>
  </div>
</template>
<script>
export default {
  name: 'Home',
};
</script>
<style lang="less" scoped>
.home {
  position: relative;
  display: flex;
}
</style>
