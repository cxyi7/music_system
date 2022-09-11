// 需要鉴权的路由，开发时使用本地，生产时使用接口返回数据生成路由
const asyncRoutes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '数据大屏', isFullScreen: true },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/analysis',
    name: 'analysis',
    meta: { title: '网站分析' },
    redirect: '/analysis/list',
    children: [
      {
        path: 'list',
        name: 'analysis-list',
        component: () => import('@/views/analysis/index.vue'),
      },
      {
        path: 'detail/:id',
        name: 'analysis-detail',
        meta: { label: '查看' },
        component: () => import('@/views/analysis/detail.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/customer',
    name: 'customer',
    meta: { title: '用户管理' },
    redirect: '/customer/list',
    children: [
      {
        path: 'list',
        name: 'customer-list',
        component: () => import('@/views/customer/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'customer-edit',
        meta: { label: '编辑' },
        component: () => import('@/views/customer/edit.vue'),
        props: true,
      },
      {
        path: 'detail/:id',
        name: 'customer-detail',
        meta: { label: '查看' },
        component: () => import('@/views/customer/detail.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/recommend',
    name: 'recommend',
    meta: { title: '推荐管理' },
    redirect: '/recommend/list',
    children: [
      {
        path: 'list',
        name: 'recommend-list',
        component: () => import('@/views/recommend/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'recommend-edit',
        meta: { label: '编辑' },
        component: () => import('@/views/recommend/edit.vue'),
        props: true,
      },
      {
        path: 'detail/:id',
        name: 'recommend-detail',
        meta: { label: '查看' },
        component: () => import('@/views/recommend/detail.vue'),
        props: true,
      },
      {
        path: 'add',
        name: 'recommend-add',
        meta: { label: '新增' },
        component: () => import('@/views/recommend/edit.vue'),
      },
    ],
  },
  {
    path: '/singer',
    name: 'singer',
    meta: { title: '歌手管理' },
    redirect: '/singer/list',
    children: [
      {
        path: 'list',
        name: 'singer-list',
        component: () => import('@/views/singer/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'singer-edit',
        meta: { label: '编辑' },
        component: () => import('@/views/singer/edit.vue'),
        props: true,
      },
      {
        path: 'detail/:id',
        name: 'singer-detail',
        meta: { label: '查看' },
        component: () => import('@/views/singer/detail.vue'),
        props: true,
      },
      {
        path: 'add',
        name: 'singer-add',
        meta: { label: '新增' },
        component: () => import('@/views/singer/edit.vue'),
      },
    ],
  },
  {
    path: '/song',
    name: 'song',
    meta: { title: '歌曲管理' },
    redirect: '/song/list',
    children: [
      {
        path: 'list',
        name: 'song-list',
        component: () => import('@/views/song/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'song-edit',
        meta: { label: '编辑' },
        component: () => import('@/views/song/edit.vue'),
        props: true,
      },
      {
        path: 'detail/:id',
        name: 'song-detail',
        meta: { label: '查看' },
        component: () => import('@/views/song/detail.vue'),
        props: true,
      },
      {
        path: 'add',
        name: 'song-add',
        meta: { label: '新增' },
        component: () => import('@/views/song/edit.vue'),
      },
    ],
  },
  {
    path: '/sranking',
    name: 'sranking',
    meta: { title: '推荐管理' },
    redirect: '/sranking/list',
    children: [
      {
        path: 'list',
        name: 'sranking-list',
        component: () => import('@/views/sranking/index.vue'),
      },
      {
        path: 'edit/:id',
        name: 'sranking-edit',
        meta: { label: '编辑' },
        component: () => import('@/views/sranking/edit.vue'),
        props: true,
      },
      {
        path: 'detail/:id',
        name: 'sranking-detail',
        meta: { label: '查看' },
        component: () => import('@/views/sranking/detail.vue'),
        props: true,
      },
      {
        path: 'add',
        name: 'sranking-add',
        meta: { label: '新增' },
        component: () => import('@/views/sranking/edit.vue'),
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    meta: { title: '系统管理' },
    redirect: '/system/menu',
    children: [
      {
        path: 'menu',
        name: 'system-menu',
        meta: { title: '菜单管理' },
        component: () => import('@/views/system/menu/index.vue'),
      },
      {
        path: 'user',
        name: 'system-user',
        meta: { title: '人员管理' },
        redirect: '/system/user/list',
        children: [
          {
            path: 'list',
            name: 'system-user-list',
            component: () => import('@/views/system/user/index.vue'),
          },
          {
            path: 'detail/:id',
            name: 'system-user-detail',
            meta: { label: '查看' },
            component: () => import('@/views/system/user/detail.vue'),
            props: true,
          },
          {
            path: 'edit',
            name: 'system-user-edit',
            meta: { label: '编辑' },
            component: () => import('@/views/system/user/edit.vue'),
            props: (route) => ({ id: route.query.id }),
          },
        ],
      },
      {
        path: 'role',
        name: 'system-role',
        meta: { title: '角色管理' },
        redirect: '/system/role/list',
        children: [
          {
            path: 'list',
            name: 'system-role-list',
            component: () => import('@/views/system/role/index.vue'),
          },
          {
            path: 'auth/:id',
            name: 'system-role-auth',
            meta: { label: '分配用户' },
            component: () => import('@/views/system/role/authUser.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'dict',
        name: 'system-dict',
        meta: { title: '字典管理' },
        redirect: '/system/dict/list',
        children: [
          {
            path: 'list',
            name: 'system-dict-list',
            component: () => import('@/views/system/dict/index.vue'),
          },
          {
            path: 'items/:id',
            name: 'system-dict-items',
            meta: { label: '字典配置' },
            component: () => import('@/views/system/dict/items.vue'),
            props: true,
          },
        ],
      },
    ],
  },
];

export function isAsyncRoute(name) {
  const arr = [...asyncRoutes];
  let item;
  while ((item = arr.shift())) {
    // 当arr为空数组时会退出循环
    if (item.name === name) return true;
    item.children && arr.push(...item.children);
  }
  return false;
}

export default asyncRoutes;
