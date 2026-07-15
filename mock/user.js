export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { accout, password } = body;
      
      // 模拟简单的账号密码验证
      if (accout && password) {
        return {
          code: 200,
          msg: '登录成功',
          data: {
            token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2)}`,
            userInfo: {
              id: 1,
              username: accout,
              nickname: '心理AI助手用户',
              avatar: '',
              email: `${accout}@example.com`
            }
          }
        };
      }
      
      return {
        code: 401,
        msg: '账号或密码错误',
        data: null
      };
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取用户信息成功',
        data: {
          id: 1,
          username: 'demo',
          nickname: '心理AI助手用户',
          avatar: '',
          email: 'demo@example.com'
        }
      };
    }
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '退出成功',
        data: null
      };
    }
  }
];
