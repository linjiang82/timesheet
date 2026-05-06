import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, getUserRole } from '../../src/utils/auth'

// Mock uni and uniCloud
global.uni = {
  login: vi.fn(),
  getUserInfo: vi.fn(),
  showToast: vi.fn(),
  setStorageSync: vi.fn()
}

global.uniCloud = {
  callFunction: vi.fn()
}

describe('Auth Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should login successfully and return user data', async () => {
    uni.login.mockResolvedValue([{ code: 'mock-code' }])
    uniCloud.callFunction.mockResolvedValue({
      result: {
        code: 0,
        userInfo: { _id: 'user1', role: 'employee' }
      }
    })

    const result = await login()
    expect(result.userInfo._id).toBe('user1')
    expect(uni.login).toHaveBeenCalled()
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'auth',
      data: expect.objectContaining({ action: 'login' })
    }))
  })

  it('should identify user as manager if role is manager', () => {
    const user = { role: 'manager' }
    expect(getUserRole(user)).toBe('manager')
  })

  it('should identify user as employee if role is employee', () => {
    const user = { role: 'employee' }
    expect(getUserRole(user)).toBe('employee')
  })
})
