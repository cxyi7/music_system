import { createRouter, createWebHashHistory } from 'vue-router'; // 使用hash模式
import NProgress from 'nprogress';
import api from '@/service';
import pinia from '@/store';
import useUserStore from '@/store/user';

// 引入不同的路由地址
import asyncRoutes, { isAsyncRoute } from '@/router/routeAsync';
import commonRoutes from '@/router/routeCommon';
import errorRoutes from '@/router/routeError';

const routes = [
  // 无鉴权的路由放在最前面
  ...commonRoutes,
  // 需要鉴权的路由放中间
  ...asyncRoutes,
  // 异常路由必须放在最后面
  ...errorRoutes,
];

const userStore = useUserStore(pinia);
const router = createRouter({
  // 新的vue-router4 使用 history路由模式 和 base前缀
  history: createWebHashHistory(import.meta.env.VITE_BASE),
  routes,
});

/**
 * @description: 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
 * @param {RouteLocationNormalized} to     导航去的路由地址
 * @param {RouteLocationNormalized} from   导航来的路由地址
 * @return {*}
 */
router.beforeEach(async (to, from, next) => {
  // 在进行跳转时先清除上一个页面的所有请求
  api.cleanPendingRequest();

  // 设置当前页面的标题
  document.title = to.meta.title || import.meta.env.VITE_TITLE;
  // https://github.com/rstacruz/nprogress/blob/master/nprogress.js  源码中有该方法
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  try {
    // 权限路由需要用户信息
    if (isAsyncRoute(to.name)) {
      await userStore.getUserInfo();
      await userStore.getMenuInfo();
      // 【开发环境】可以进入所有页面
      // https://cn.vitejs.dev/guide/env-and-mode.html
      if (import.meta.env.DEV) return next();
      // 首次登录则跳转到修改密码页面
      if (userStore.isFirstLogin) return next('/modifyPassword');
      // 【管理员】首次登录修改密码后，可以进入所有页面
      if (userStore.isAdmin) return next();
      // 如果没有任何权限，则跳转到403
      if (!userStore.menuList.length) return next('/403');
      // 当前页面无权限： 1. 如果时从登录页面跳转的，则重定向到有权限的第一个页面  2. 否则提示页面不存在
      if (!userStore.menuList.includes(to.name)) {
        const name = getRedirectUrl(userStore.menuInfo[0]);
        if (to.name.includes(name)) return next();
        if (from.name !== 'login') return next('/404');
        return next({ name });
      }
    }
    next();
  } catch (error) {
    next('/login');
  }
});

// 路由后置守卫 ---> 当跳转之后，取消进度条
router.afterEach(() => {
  NProgress.done();
});

// 获取重定向路由
export const getRedirectUrl = (menu) => {
  // 【开发环境】 则重定向到数据大屏页面
  if (import.meta.env.DEV) return 'home';
  // 没有权限，则返回403页面
  if (!menu) return '403';
  // 有权限则返回第一个权限页面
  if (menu.children && menu.children.length) {
    return getRedirectUrl(menu.children[0]);
  }
  return menu.perms;
};

export default router;
