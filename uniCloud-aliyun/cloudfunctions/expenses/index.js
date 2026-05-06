'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, date, amount, category, receipt_image_url, description } = event;
  const { auth } = context;

  const uid = auth ? auth.uid : event.uid;

  if (!uid) {
    return { code: 1, message: 'Unauthorized' };
  }

  if (action === 'create') {
    const res = await db.collection('expenses').add({
      user_id: uid,
      date,
      amount,
      category,
      receipt_image_url,
      description,
      status: 'pending',
      created_at: Date.now(),
      updated_at: Date.now()
    });
    return { code: 0, id: res.id };
  }

  if (action === 'listMine') {
    const res = await db.collection('expenses').where({
      user_id: uid
    }).orderBy('date', 'desc').get();
    return { code: 0, data: res.data };
  }

  return { code: 1, message: 'Unknown action' };
};
