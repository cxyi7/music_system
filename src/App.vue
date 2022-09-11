<template>
  <router-view>
    <t-layout class="main w-screen h-screen">
      <Header></Header>
      <t-content>Content</t-content>
      <t-footer>Footer</t-footer>
    </t-layout>
  </router-view>
</template>
<style lang="less" scoped>
.main {
  background: #fff;
}
</style>
