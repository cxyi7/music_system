// 错误页面 ---> 需要放在最后面
const errorRoutes = [
  {
    path: '/403',
    name: '403',
    meta: { title: '您无访问权限！', isFullScreen: true },
    component: () => import('@/views/error/403.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '哦吼，页面走丢了~', isFullScreen: true },
    component: () => import('@/views/error/404.vue'),
  },
  {
    path: '/500',
    name: '500',
    meta: { title: '服务器出错了，请稍后再试~' },
    component: () => import('@/views/error/500.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];

export default errorRoutes;
