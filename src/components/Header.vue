<template>
  <t-header>
    <t-head-menu v-module="currentMenu" class="header bg-cyan-300" expand-type="popup">
      <!-- Logo -->
      <template #logo></template>
      <!-- 菜单栏 只允许二级路由，不能再嵌套子路由 -->
      <template v-for="subitem in menuList" :key="subitem.value">
        <t-menu-item v-if="!subitme.child || !subitem.child.length" :value="subitem.menu">{{ subitem.name }}</t-menu-item>
        <t-submenu v-else :value="subitem.menu" :title="subitem.name">
          <template v-for="menuitem in subitem.child" :key="menuitem.value">
            <t-menu-item :value="menuitem.menu">{{ menuitem.name }}</t-menu-item>
          </template>
        </t-submenu>
      </template>
      <!-- 用户信息 -->
      <template #operations>
        <t-space>
          <t-dropdown :options="options" trigger="click" :hide-after-item-click="false" :min-column-width="100">
            <t-avatar :image="user.userInfo.avatar" :hide-on-load-failed="true" />
            <div>{{ user.userInfo.nickName }}</div>
          </t-dropdown>
        </t-space>
      </template>
    </t-head-menu>
  </t-header>
</template>
<script setup>
import { MessagePlugin } from 'tdesign-vue-next';

const options = [
  {
    content: '个人中心',
    value: 1,
    onClick: () => MessagePlugin.success('个人中心'),
  },
  {
    content: '退出登录',
    value: 2,
    onClick: () => MessagePlugin.success('退出登录'),
  },
];
</script>
<style lang="less" scoped>
.header {
  // menu-item文字颜色
  --td-font-gray-1: rgb(255 255 255 / 90%);
  --td-font-gray-2: rgb(255 255 255 / 80%);
  // menu-item背景颜色
  --td-gray-color-1: #a5f3fc;
  --td-gray-color-2: #a5f3fc;
  // 二级菜单弹框内的文字和背景色
  :deep(.t-menu__popup) {
    --td-gray-color-1: #ecf2fe;
    --td-font-gray-2: #999;
  }
}
</style>
