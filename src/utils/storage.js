/**
 * @description: 本地全局存储封装（方便存储和获取参数）
 * @auth: lxz
 * @params: localStorage / sessionStorage
 */

function getStorageObj(storage) {
  return {
    /**
     * 设置本地存储内容
     * @param {string} key 对应的key
     * @param {string} value 对应的value
     * @param {number} exp 过期时间
     * @return {object} 返回值
     */
    setItem(key, value, exp = '') {
      const curTime = Date.now();
      console.log(curTime);
      storage.setItem(key, JSON.stringify({ data: value, time: curTime, exp }));
    },

    /**
     * 获取本地存储内容
     * @param {string} key 对应的key
     * @param {number} exp 过期时间
     */
    getItem(key, exp) {
      const localData = storage.getItem(key);
      if (!localData) return null;
      try {
        const { time = Date.now(), data = '', exp: dataExp } = JSON.parse(localData);
        // 过期时间获取 （传入值 或者 设置时的过期时间）
        exp = exp || dataExp;
        if (exp && Date.now() - time > exp) {
          // 数据超出设置的时间，删除并返回null
          storage.removeItem(key);
          return null;
        }
        if (!data) return null;
        return data;
      } catch (error) {
        // 如果出现问题则删除该值
        storage.removeItem(key);
        return null;
      }
    },

    /**
     * 删除本地存储内容
     * @param {string} key 对应的key
     */
    removeItem(key) {
      Storage.removeItem(key);
    },

    /**
     * 清空本地所有存储内容
     */
    clear() {
      storage.clear();
    },
  };
}

export default {
  localStorage: getStorageObj(localStorage),
  sessionStorage: getStorageObj(sessionStorage),
};
