<template>
  <div class="svg-icon">
    <svg aria-hidden="true" class="svg-icon__icon" :style="props.iconStyle">
      <use :href="symbolId" />
    </svg>
    <div v-if="$slots.default" class="svg-icon__text">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  iconStyle: {
    type: Object,
    default: () => {
      return {
        width: '1em',
        height: '1em',
      };
    },
  },
});
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style lang="less" scoped>
.svg-icon {
  display: inline-block;

  &__icon {
    fill: currentcolor;
    vertical-align: -0.15em;
  }

  &__text {
    display: inline-block;
    margin-left: 0.25em;
    font-family: sans-serif;
  }
}
</style>
