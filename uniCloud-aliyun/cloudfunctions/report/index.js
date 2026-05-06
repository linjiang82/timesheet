'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, period } = event; // period: YYYY-MM
  const { auth } = context;

  // Mocking manager check
  const isManager = true; 

  if (!isManager) {
    return { code: 1, message: 'Forbidden' };
  }

  if (action === 'getSummary') {
    if (!period) {
      return { code: 1, message: 'Period is required' };
    }

    const timesheets = await db.collection('timesheets').where({
      status: 'approved',
      date: new RegExp(`^${period}`)
    }).get();

    const expenses = await db.collection('expenses').where({
      status: 'approved',
      date: new RegExp(`^${period}`)
    }).get();

    return {
      code: 0,
      data: {
        timesheets: timesheets.data,
        expenses: expenses.data
      }
    };
  }

  return { code: 1, message: 'Unknown action' };
};
