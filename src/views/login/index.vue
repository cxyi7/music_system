<template>
  <div class="login w-screen h-screen">
    <!-- 登录表单 -->
    <div class="login-bg">
      <SvgIcon name="login-bg" :icon-style="iconStyle"></SvgIcon>
    </div>
    <t-form ref="form" class="login-form" :data="formData" :rules="rules" :label-width="0" @submit="onSubmit">
      <div class="login-form-header font-sans text-center">
        <h1 class="login-form-title">花雨音乐后台管理系统</h1>
        <p class="login-form-label">欢迎使用，请登录您的账号</p>
      </div>
      <div>
        <p class="login-form-label">用户名</p>
        <t-form-item name="username">
          <t-input v-model="formData.username" clearable placeholder="">
            <template #prefix-icon>
              <desktop-icon />
            </template>
          </t-input>
        </t-form-item>
        <p class="login-form-label">密码</p>
        <t-form-item name="password">
          <t-input v-model="formData.password" type="password" clearable placeholder="">
            <template #prefix-icon>
              <lock-on-icon />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item name="code">
          <t-input v-model="formData.code" placeholder="">
            <template #suffix>
              <!-- <img :src="imgCode" class="login-form-code" @click.stop="getImgCode" /> -->
              <div class="login-form-code" @click.stop="getImgCode" v-html="imgCode"></div>
            </template>
          </t-input>
        </t-form-item>
        <t-form-item style="padding-top: 8px">
          <t-button theme="primary" type="submit" block>登录</t-button>
        </t-form-item>
      </div>
    </t-form>
  </div>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import useUserStore from '@/store/user';
import api from '@/service';
import jsencrypt from '@/utils/jsencrypt';

export default {
  name: 'Login',
};
</script>
<script setup>
const iconStyle = {
  width: '500px',
  height: '500px',
};

const userStore = useUserStore();
const router = useRouter();
const imgCode = ref(null);

// 校验规则
const rules = {
  username: [{ required: true, message: '必填', trigger: 'blur' }],
  password: [{ required: true, message: '必填', trigger: 'blur' }],
  code: [{ required: true, message: '必填', trigger: 'blur' }],
};
// 登录表单
const formData = reactive({
  username: '',
  password: '',
});

// 获取验证码
const getImgCode = async () => {
  const res = await api.get('/captcha');
  imgCode.value = res.img;
  formData.uuid = res.uuid;
};

// 登录
const onSubmit = async ({ validateResult, firstError, e }) => {
  e.preventDefault();
  if (validateResult) {
    try {
      const password = jsencrypt(formData.password);
      await userStore.login({ ...formData, password });
      router.push('/');
    } catch (error) {
      getImgCode();
    }
  } else {
    MessagePlugin.error(firstError);
  }
};

onMounted(() => {
  getImgCode();
});
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &-bg {
    position: absolute;
    top: 14%;
    left: 14%;
    width: 500px;
    height: 500px;
  }

  &-form {
    position: absolute;
    top: 30%;
    right: 20%;
    width: 500px;
    height: 400px;

    &-label {
      margin-bottom: 5px;
      color: rgb(107 114 128 / 50%);
    }
  }
}
</style>
