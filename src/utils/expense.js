/**
 * Expense utility
 */

export async function submitExpense(data) {
  try {
    const res = await uniCloud.callFunction({
      name: 'expenses',
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
    console.error('Expense error:', err)
    uni.showToast({
      title: err.message || 'Submission failed',
      icon: 'none'
    })
    throw err
  }
}

export async function getMyExpenses() {
  try {
    const res = await uniCloud.callFunction({
      name: 'expenses',
      data: {
        action: 'listMine'
      }
    })

    if (res.result.code === 0) {
      return res.result.data
    } else {
      throw new Error(res.result.message || 'Failed to fetch expenses')
    }
  } catch (err) {
    console.error('Expense error:', err)
    throw err
  }
}
