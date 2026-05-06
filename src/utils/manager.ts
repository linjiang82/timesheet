/**
 * Manager utility
 */

import type { TimesheetEntry } from './timesheet';
import type { ExpenseEntry } from './expense';

export interface PendingData {
  timesheets: TimesheetEntry[];
  expenses: ExpenseEntry[];
}

export async function getPendingSubmissions(): Promise<PendingData> {
  try {
    const res: any = await uniCloud.callFunction({
      name: 'manager',
      data: {
        action: 'listPending'
      }
    })

    if (res.result.code === 0) {
      return res.result.data
    } else {
      throw new Error(res.result.message || 'Failed to fetch pending submissions')
    }
  } catch (err) {
    console.error('Manager error:', err)
    throw err
  }
}

export async function approveSubmission(type: 'timesheets' | 'expenses', id: string, comment?: string): Promise<any> {
  try {
    const res: any = await uniCloud.callFunction({
      name: 'manager',
      data: {
        action: 'approve',
        type,
        id,
        comment
      }
    })

    if (res.result.code === 0) {
      return res.result
    } else {
      throw new Error(res.result.message || 'Approval failed')
    }
  } catch (err: any) {
    console.error('Manager error:', err)
    uni.showToast({
      title: err.message || 'Approval failed',
      icon: 'none'
    })
    throw err
  }
}

export async function rejectSubmission(type: 'timesheets' | 'expenses', id: string, comment?: string): Promise<any> {
  try {
    const res: any = await uniCloud.callFunction({
      name: 'manager',
      data: {
        action: 'reject',
        type,
        id,
        comment
      }
    })

    if (res.result.code === 0) {
      return res.result
    } else {
      throw new Error(res.result.message || 'Rejection failed')
    }
  } catch (err: any) {
    console.error('Manager error:', err)
    uni.showToast({
      title: err.message || 'Rejection failed',
      icon: 'none'
    })
    throw err
  }
}
