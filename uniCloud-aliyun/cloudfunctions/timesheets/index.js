'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, date, hours, description } = event;
  const { auth } = context;

  // In real uniCloud, auth is automatically populated if using clientDB or specific auth logic
  // Here we assume the user is authenticated and we have their uid
  const uid = auth ? auth.uid : event.uid; // Mocking uid for testing/simplicity

  if (!uid) {
    return { code: 1, message: 'Unauthorized' };
  }

  if (action === 'create') {
    const res = await db.collection('timesheets').add({
      user_id: uid,
      date,
      hours,
      description,
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now()
    });
    return { code: 0, id: res.id };
  }

  if (action === 'listMine') {
    const res = await db.collection('timesheets').where({
      user_id: uid
    }).orderBy('date', 'desc').get();
    return { code: 0, data: res.data };
  }

  return { code: 1, message: 'Unknown action' };
};
