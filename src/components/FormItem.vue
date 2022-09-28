<template>
  <t-form-item :label="props.label" :name="props.name" :initial-data="props.initData" :style="props.style">
    <t-input v-if="/^input$/.test(props.chooseType)" v-model="proxy" clearable :placeholder="props.placeholder"></t-input>
    <t-input
      v-if="/^limit_ipt$/.test(props.chooseType)"
      v-model="proxy"
      :placeholder="props.placeholder"
      :maxlength="props.limitNum"
      show-limit-number
    ></t-input>
    <t-input-number
      v-if="/^number$/.test(props.chooseType)"
      v-model="proxy"
      :placeholder="props.placeholder"
      theme="normal"
      :style="props.style"
    >
      <template #suffix><span>元</span></template>
    </t-input-number>
    <t-radio-group v-if="/^radio$/.test(props.chooseType)" @change="onChange">
      <t-radio value="1">是</t-radio>
      <t-radio value="0">否</t-radio>
    </t-radio-group>
  </t-form-item>
</template>
<script setup>
const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  initData: {
    type: [String, Number],
    default: '',
  },
  style: {
    type: Object,
    default: () => {
      return {
        width: '400px',
      };
    },
  },
  chooseType: {
    type: String,
    default: 'input',
  },
  limitNum: Number,
  placeholder: {
    type: [String, Number],
    default: '',
  },
});
const proxy = ref(undefined);

// 当内部的值发生变化时，将变化的值传递到父组件中
watch(
  () => proxy.value,
  (val) => emits('update:modelValue', val),
);

// 当父组件中的值发生变化时，将变化的值传递到子组件中
watchEffect(() => {
  proxy.value = props.modelValue;
});
</script>
