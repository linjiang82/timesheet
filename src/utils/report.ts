/**
 * Report utility
 */

import type { TimesheetEntry } from './timesheet';
import type { ExpenseEntry } from './expense';

export interface ReportData {
  timesheets: TimesheetEntry[];
  expenses: ExpenseEntry[];
}

export async function getReportData(period: string): Promise<ReportData> {
  try {
    const res: any = await uniCloud.callFunction({
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

export function generateCSV(data: ReportData): string {
  let csv = 'Date,Type,Amount/Hours,Description,Category\n'
  
  data.timesheets.forEach(item => {
    csv += `${item.date},Timesheet,${item.hours},"${item.description || ''}",\n`
  })
  
  data.expenses.forEach(item => {
    csv += `${item.date},Expense,${item.amount},"${item.description || ''}",${item.category}\n`
  })
  
  return csv
}
