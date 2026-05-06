import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPendingSubmissions, approveSubmission, rejectSubmission } from '../../src/utils/manager'

// Mock uni and uniCloud
global.uni = {
  showToast: vi.fn(),
  getStorageSync: vi.fn()
}

global.uniCloud = {
  callFunction: vi.fn()
}

describe('Manager Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uni.getStorageSync.mockReturnValue({ _id: 'manager1', role: 'manager' })
  })

  it('should get pending submissions', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: {
        code: 0,
        data: {
          timesheets: [{ _id: 'ts1', status: 'pending' }],
          expenses: [{ _id: 'exp1', status: 'pending' }]
        }
      }
    })

    const result = await getPendingSubmissions()
    expect(result.timesheets.length).toBe(1)
    expect(result.expenses.length).toBe(1)
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'manager',
      data: expect.objectContaining({ action: 'listPending' })
    }))
  })

  it('should approve a submission', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: { code: 0 }
    })

    await approveSubmission('timesheets', 'ts1', 'Well done')
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'manager',
      data: expect.objectContaining({
        action: 'approve',
        type: 'timesheets',
        id: 'ts1',
        comment: 'Well done'
      })
    }))
  })

  it('should reject a submission', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: { code: 0 }
    })

    await rejectSubmission('expenses', 'exp1', 'Invalid receipt')
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'manager',
      data: expect.objectContaining({
        action: 'reject',
        type: 'expenses',
        id: 'exp1',
        comment: 'Invalid receipt'
      })
    }))
  })
})
