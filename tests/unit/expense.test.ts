import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitExpense, getMyExpenses } from '../../src/utils/expense'

// Mock uni and uniCloud
global.uni = {
  showToast: vi.fn(),
  getStorageSync: vi.fn(),
  chooseImage: vi.fn(),
  uploadFile: vi.fn()
}

global.uniCloud = {
  callFunction: vi.fn(),
  uploadFile: vi.fn()
}

describe('Expense Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uni.getStorageSync.mockReturnValue({ _id: 'user1' })
  })

  it('should submit expense successfully', async () => {
    const expenseData = {
      date: '2026-05-07',
      amount: 50.5,
      category: 'Meal',
      receipt_image_url: 'cloud://receipt1.jpg'
    }

    uniCloud.callFunction.mockResolvedValue({
      result: { code: 0, id: 'exp1' }
    })

    const result = await submitExpense(expenseData)
    expect(result.id).toBe('exp1')
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'expenses',
      data: expect.objectContaining({
        action: 'create',
        ...expenseData
      })
    }))
  })

  it('should get my expenses', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: {
        code: 0,
        data: [{ _id: 'exp1', amount: 50.5 }]
      }
    })

    const result = await getMyExpenses()
    expect(result.length).toBe(1)
    expect(result[0].amount).toBe(50.5)
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'expenses',
      data: expect.objectContaining({ action: 'listMine' })
    }))
  })
})
