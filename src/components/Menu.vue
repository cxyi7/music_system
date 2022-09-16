<template>
  <template v-for="item in props.data" :key="item.perms">
    <t-menu-item v-if="!item.children || !item.children.length" :value="item.perms">{{ item.name }}</t-menu-item>
    <t-submenu v-else :value="item.perms" :title="item.name">
      <Menu :data="item.children"></Menu>
    </t-submenu>
  </template>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
