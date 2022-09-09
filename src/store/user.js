import storage from '../utils/storage';
import api from '@/service';

const useUserStore = defineStore('admin', {
  state: () => {
    return {
      info: null,
      menus: null,
    };
  },
  getters: {
    // 管理员信息
    adminInfo: (state) => state.info || {},
    menuInfo: (state) => state.menus || [],
    isFirstLogin: (state) => state.info?.changePwd === 0,
    isAdmin: (state) => state.info?.rolePermission?.includes('admin') ?? true,
    menuList: (state) => state.info?.menuPermission || [],
    btnList: (state) => state.info?.buttons || [],
  },
  actions: {
    // 获取用户信息：包含权限菜单标识（但不包含自定义菜单信息），权限角色标识，权限按钮标识
    async getUserInfo() {
      if (this.info) return;
      this.info = await api.get('/platform/user/profile');
    },
    // 获取菜单信息
    async getMenuInfo() {
      if (this.menus) return;
      this.menus = await api.get('platform/menu/getRouters');
    },
    // 登录
    async login(data) {
      this.$reset(); // 重置信息
      const res = await api.post('/auth/login', data);
      const { tokenName, tokenValue, tokenTimeout } = res;
      storage.localStorage.setItem('MUSIC-TOKEN', { tokenName, tokenValue }, tokenTimeout * 1000);
    },
    // 退出登录
    async logout() {
      await api.post('/auth/logout');
      this.$reset(); // 退出后重置信息
    },
  },
  persist: true, // 数据持久化，刷新后仍可用
});

export default useUserStore;
