/**
 * Manager utility
 */

export async function getPendingSubmissions() {
  try {
    const res = await uniCloud.callFunction({
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

export async function approveSubmission(type, id, comment) {
  try {
    const res = await uniCloud.callFunction({
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
  } catch (err) {
    console.error('Manager error:', err)
    uni.showToast({
      title: err.message || 'Approval failed',
      icon: 'none'
    })
    throw err
  }
}

export async function rejectSubmission(type, id, comment) {
  try {
    const res = await uniCloud.callFunction({
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
  } catch (err) {
    console.error('Manager error:', err)
    uni.showToast({
      title: err.message || 'Rejection failed',
      icon: 'none'
    })
    throw err
  }
}
