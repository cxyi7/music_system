<template>
  <t-header>
    <t-head-menu v-model="currMenu" class="header bg-cyan-300" expand-type="popup">
      <!-- Logo -->
      <!-- <template #logo></template> -->
      <!-- 菜单栏 只允许二级路由，不能再嵌套子路由 -->
      <template v-for="subitem in menuList" :key="subitem.value">
        <t-menu-item v-if="!subitem.children || !subitem.children.length" :value="subitem.perms">{{ subitem.name }}</t-menu-item>
        <t-submenu v-else :value="subitem.perms" :title="subitem.name">
          <Menu :data="subitem.children"></Menu>
        </t-submenu>
      </template>
      <!-- 用户信息 -->
      <template #operations>
        <t-space>
          <t-dropdown :options="options" trigger="click" :hide-after-item-click="false" :min-column-width="100">
            <t-avatar :image="user.adminInfo.avatar" :hide-on-load-failed="true" />
            <span>{{ user.adminInfo.nickName }}</span>
          </t-dropdown>
        </t-space>
      </template>
    </t-head-menu>
  </t-header>
</template>
<script setup>
import { MessagePlugin } from 'tdesign-vue-next';
import { findLast } from 'lodash';
import useUserStore from '@/store/user';
import asyncRoutes from '@/router/routeAsync';
import storage from '@/utils/storage';

const router = useRouter();
const user = useUserStore();

const options = [
  {
    content: '个人中心',
    value: 1,
    onClick: () => MessagePlugin.success('个人中心'),
  },
  {
    content: '退出登录',
    value: 2,
    onClick: async () => {
      await user.logout();
      storage.localStorage.removeItem('MUSIC-TOKEN');
      router.push('/login');
      MessagePlugin.success('退出登录');
    },
  },
];

const menuList = computed(() => {
  if (!import.meta.env.DEV) return user.menuInfo;
  return createLocalRoutes(asyncRoutes);
});

// 构建路由菜单
const createLocalRoutes = (routes) => {
  if (!routes) return null;
  return routes
    .filter((item) => item.meta?.title)
    .map((item) => {
      return {
        children: createLocalRoutes(item.children),
        name: item.meta.title,
        perms: item.name,
      };
    });
};

// 获取当前激活的
const currMenu = computed({
  get: () => findLast(router.currentRoute.value.matched, (item) => item.meta.title)?.name,
  set: (name) => router.push({ name }),
});
</script>
<style lang="less" scoped>
.header {
  // z-index: 9999;
  // menu-item文字颜色
  --td-font-gray-1: rgb(255 255 255 / 90%);
  --td-font-gray-2: rgb(255 255 255 / 80%);
  // menu-item背景颜色
  --td-gray-color-1: rgb(0 74 179 / 80%);
  --td-gray-color-2: rgb(0 74 179 / 90%);
  // 二级菜单弹框内的文字和背景色
  :deep(.t-menu__popup) {
    --td-gray-color-1: #ecf2fe;
    --td-font-gray-2: #999;
  }
}
</style>
