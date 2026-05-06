/**
 * Auth utility for WeChat Mini Program
 */

export interface UserInfo {
  _id: string;
  openid: string;
  role: 'employee' | 'manager';
  nickname?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  code: number;
  message?: string;
  userInfo: UserInfo;
}

export async function login(): Promise<AuthResponse> {
  try {
    const [loginRes]: any = await uni.login({
      provider: 'weixin'
    })
    
    if (!loginRes.code) {
      throw new Error('Login failed: No code returned')
    }

    const res: any = await uniCloud.callFunction({
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
  } catch (err: any) {
    console.error('Auth error:', err)
    uni.showToast({
      title: err.message || 'Login failed',
      icon: 'none'
    })
    throw err
  }
}

export function getUserRole(userInfo: UserInfo | null): string | null {
  return userInfo ? userInfo.role : null
}
