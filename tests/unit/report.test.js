import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getReportData, generateCSV } from '../../src/utils/report'

// Mock uni and uniCloud
global.uni = {
  getStorageSync: vi.fn()
}

global.uniCloud = {
  callFunction: vi.fn()
}

describe('Report Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    uni.getStorageSync.mockReturnValue({ _id: 'manager1', role: 'manager' })
  })

  it('should fetch report data for a specific period', async () => {
    uniCloud.callFunction.mockResolvedValue({
      result: {
        code: 0,
        data: {
          timesheets: [{ _id: 'ts1', hours: 8, date: '2026-05-01' }],
          expenses: [{ _id: 'exp1', amount: 100, date: '2026-05-01' }]
        }
      }
    })

    const result = await getReportData('2026-05')
    expect(result.timesheets.length).toBe(1)
    expect(result.expenses.length).toBe(1)
    expect(uniCloud.callFunction).toHaveBeenCalledWith(expect.objectContaining({
      name: 'report',
      data: expect.objectContaining({ action: 'getSummary', period: '2026-05' })
    }))
  })

  it('should generate a CSV string from report data', () => {
    const data = {
      timesheets: [{ date: '2026-05-01', hours: 8, description: 'Work' }],
      expenses: [{ date: '2026-05-01', amount: 100, category: 'Travel' }]
    }
    const csv = generateCSV(data)
    expect(csv).toContain('Date,Type,Amount/Hours,Description')
    expect(csv).toContain('2026-05-01,Timesheet,8,"Work"')
    expect(csv).toContain('2026-05-01,Expense,100,"",Travel')
  })
})
