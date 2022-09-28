<template>
  <div class="dict">
    <SearchForm :form-data="formData" @submit="onSubmit">
      <FormItem
        v-for="item in items"
        :key="item.name"
        v-model="formData[item.name]"
        :name="item.name"
        :label="item.label"
        :choose-type="item.type"
        :placeholder="item.placeholder"
        :limit-num="item.limitNum"
      ></FormItem>
    </SearchForm>
  </div>
</template>
<script setup>
const formData = reactive({
  name: '',
  code: '',
  type: '',
});
const items = reactive([
  {
    name: 'name',
    label: '字典名称',
    type: 'input',
    placeholder: '请输入字典名称',
  },
  {
    name: 'code',
    label: '字典编码',
    type: 'limit_ipt',
    limitNum: 150,
  },
  {
    name: 'type',
    label: '字典类型',
    type: 'number',
  },
]);

const onSubmit = () => {
  console.log(formData);
};
</script>
<style lang="less" scoped>
.dict {
  width: 100%;
}
</style>
