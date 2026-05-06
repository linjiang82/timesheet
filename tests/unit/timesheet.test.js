import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitTimesheet, getMyTimesheets } from '../../src/utils/timesheet'

// Mock uni and uniCloud
global.uni = {
  showToast: vi.fn(),
  getStorageSync: vi.fn()
}

global.uniCloud = {
  callFunction: vi.fn()
}

describe('Timesheet Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uni.getStorageSync.mockReturnValue({ _id: 'user1' })
  })

  it('should submit timesheet successfully', async () => {
    const timesheetData = {
      date: '2026-05-07',
      hours: 8,
      description: 'Worked on project X'
    }

    uniCloud.callFunction.mockResolvedValue({
      result: { code: 0, id: 'ts1' }
    })

    const result = await submitTimesheet(timesheetData)
    expect(result.id).toBe('ts1')
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'timesheets',
      data: expect.objectContaining({
        action: 'create',
        ...timesheetData
      })
    }))
  })

  it('should get my timesheets', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: {
        code: 0,
        data: [{ _id: 'ts1', hours: 8 }]
      }
    })

    const result = await getMyTimesheets()
    expect(result.length).toBe(1)
    expect(result[0].hours).toBe(8)
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'timesheets',
      data: expect.objectContaining({ action: 'listMine' })
    }))
  })
})
