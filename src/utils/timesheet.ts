/**
 * Timesheet utility
 */

export interface TimesheetEntry {
  _id?: string;
  user_id?: string;
  date: string;
  hours: number;
  description: string;
  status?: 'pending' | 'approved' | 'rejected';
  manager_comment?: string;
}

export async function submitTimesheet(data: TimesheetEntry): Promise<any> {
  try {
    const res: any = await uniCloud.callFunction({
      name: 'timesheets',
      data: {
        action: 'create',
        ...data
      }
    })

    if (res.result.code === 0) {
      return res.result
    } else {
      throw new Error(res.result.message || 'Submission failed')
    }
  } catch (err: any) {
    console.error('Timesheet error:', err)
    uni.showToast({
      title: err.message || 'Submission failed',
      icon: 'none'
    })
    throw err
  }
}

export async function getMyTimesheets(): Promise<TimesheetEntry[]> {
  try {
    const res: any = await uniCloud.callFunction({
      name: 'timesheets',
      data: {
        action: 'listMine'
      }
    })

    if (res.result.code === 0) {
      return res.result.data
    } else {
      throw new Error(res.result.message || 'Failed to fetch timesheets')
    }
  } catch (err) {
    console.error('Timesheet error:', err)
    throw err
  }
}
