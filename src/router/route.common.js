// 不需要鉴权的路由
const commonRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', isFullScreen: true },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    meth: { title: '修改密码', isFullScreen: true },
    component: () => import('@/views/login/modifyPassword.vue'),
  },
];

export default commonRoutes;
