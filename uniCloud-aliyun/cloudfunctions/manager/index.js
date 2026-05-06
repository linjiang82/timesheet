'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, type, id, comment } = event;
  const { auth } = context;

  // In real uniCloud, we check auth.role
  // Mocking for now
  const isManager = true; 

  if (!isManager) {
    return { code: 1, message: 'Forbidden' };
  }

  if (action === 'listPending') {
    const timesheets = await db.collection('timesheets').where({
      status: 'pending'
    }).get();

    const expenses = await db.collection('expenses').where({
      status: 'pending'
    }).get();

    return {
      code: 0,
      data: {
        timesheets: timesheets.data,
        expenses: expenses.data
      }
    };
  }

  if (action === 'approve' || action === 'reject') {
    if (!type || !id) {
      return { code: 1, message: 'Type and ID are required' };
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    
    await db.collection(type).doc(id).update({
      status: status,
      manager_comment: comment,
      updated_at: Date.now()
    });

    return { code: 0, message: `Successfully ${status}` };
  }

  return { code: 1, message: 'Unknown action' };
};
