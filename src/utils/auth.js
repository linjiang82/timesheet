/**
 * Auth utility for WeChat Mini Program
 */

export async function login() {
  try {
    const [loginRes] = await uni.login({
      provider: 'weixin'
    })
    
    if (!loginRes.code) {
      throw new Error('Login failed: No code returned')
    }

    const res = await uniCloud.callFunction({
      name: 'auth',
      data: {
        action: 'login',
        code: loginRes.code
      }
    })

    if (res.result.code === 0) {
      uni.setStorageSync('userInfo', res.result.userInfo)
      return res.result
    } else {
      throw new Error(res.result.message || 'Login failed')
    }
  } catch (err) {
    console.error('Auth error:', err)
    uni.showToast({
      title: err.message || 'Login failed',
      icon: 'none'
    })
    throw err
  }
}

export function getUserRole(userInfo) {
  return userInfo ? userInfo.role : null
}
