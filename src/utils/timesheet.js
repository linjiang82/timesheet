/**
 * Timesheet utility
 */

export async function submitTimesheet(data) {
  try {
    const res = await uniCloud.callFunction({
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
  } catch (err) {
    console.error('Timesheet error:', err)
    uni.showToast({
      title: err.message || 'Submission failed',
      icon: 'none'
    })
    throw err
  }
}

export async function getMyTimesheets() {
  try {
    const res = await uniCloud.callFunction({
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
