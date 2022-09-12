// 引入mockjs
import Mock from 'mockjs';

const { Random } = require('mockjs');

// 可以模拟很多个接口数据，接口地址不一致即可
Mock.mock(
  '/platform/user/profile', // 接口地址
  {
    code: 0,
    message: '操作成功',
    // 重复属性值 array 生成一个新数组，重复次数为 5
    data: {
      info: {
        // eslint-disable-next-line no-undef
        avatar: Random.image('200x100'),
        nickname: '@cname',
      },
    },
  },
);
