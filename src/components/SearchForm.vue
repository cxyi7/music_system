<template>
  <div class="search-form">
    <t-form ref="form" :data="props.formData" layout="inline" scroll-to-first-error="smooth" @reset="onReset" @submit="onSubmit">
      <div class="search-form-ipt">
        <slot></slot>
      </div>
      <div class="search-form-btn">
        <t-space size="small">
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button theme="default" variant="base" type="reset">重置</t-button>
        </t-space>
      </div>
    </t-form>
  </div>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue-next';
</script>
<script setup>
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['submit']);

const onReset = () => {
  MessagePlugin.success('重置成功');
};

const onSubmit = () => emits('submit');
</script>
<style lang="less" scoped>
.search-form {
  position: relative;
  padding: 20px 40px;

  &-ipt {
    width: 90%;
  }
}
</style>
