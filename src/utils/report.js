/**
 * Report utility
 */

export async function getReportData(period) {
  try {
    const res = await uniCloud.callFunction({
      name: 'report',
      data: {
        action: 'getSummary',
        period
      }
    })

    if (res.result.code === 0) {
      return res.result.data
    } else {
      throw new Error(res.result.message || 'Failed to fetch report data')
    }
  } catch (err) {
    console.error('Report error:', err)
    throw err
  }
}

export function generateCSV(data) {
  let csv = 'Date,Type,Amount/Hours,Description,Category\n'
  
  data.timesheets.forEach(item => {
    csv += `${item.date},Timesheet,${item.hours},"${item.description || ''}",\n`
  })
  
  data.expenses.forEach(item => {
    csv += `${item.date},Expense,${item.amount},"${item.description || ''}",${item.category}\n`
  })
  
  return csv
}
