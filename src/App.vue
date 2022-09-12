<template>
  <router-view v-slot="{ Component, route }">
    <t-layout class="main w-screen h-screen">
      <Header></Header>
      <t-content class="content-wrap flex flex-col">
        <t-breadcrumb>
          <t-breadcrumbItem v-for="item in breadcrumbs" :key="item.name" @click="clickItem(Component, route)">
            {{ item.meta.label || item.meta.title }}
          </t-breadcrumbItem>
          <template #separator>/</template>
        </t-breadcrumb>
      </t-content>
      <div class="content-body flex flex-col flex-1" :class="{ 'full-screen': isFullScreen }">
        <component :is="Component" />
      </div>
    </t-layout>
  </router-view>
</template>
<script setup>
const router = useRouter();
const clickItem = (Component, route) => {
  console.log(Component, route);
};
const breadcrumbs = computed(() => router.currentRoute.value.matched.filter((item) => item.meta.label || item.meta.title));
const isFullScreen = computed(() => {
  if (!router.currentRoute.value.name) return true;
  return !!router.currentRoute.value.meta.isFullScreen;
});
</script>
<style lang="less" scoped>
.main {
  background: #fff;
}

.content-wrap {
  margin: 30px 40px 50px;
  overflow: auto;
}

.content-body {
  margin-top: 10px;
  overflow: auto;
  background: #fff;
  border-radius: 4px;

  &.full-screen {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
