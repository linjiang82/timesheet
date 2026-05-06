'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
  const { action, code } = event;

  if (action === 'login') {
    if (!code) {
      return { code: 1, message: 'Code is required' };
    }

    // In a real app, you would call WeChat API to exchange code for openid
    // For this prototype, we'll simulate it
    const openid = `mock_openid_${code}`;
    
    const userResult = await db.collection('users').where({
      openid: openid
    }).get();

    let userInfo;
    if (userResult.data.length === 0) {
      // Create new user, default to employee
      userInfo = {
        openid: openid,
        role: 'employee',
        created_at: Date.now(),
        updated_at: Date.now()
      };
      const addRes = await db.collection('users').add(userInfo);
      userInfo._id = addRes.id;
    } else {
      userInfo = userResult.data[0];
    }

    return {
      code: 0,
      message: 'Login success',
      userInfo: userInfo
    };
  }

  return {
    code: 1,
    message: 'Unknown action'
  };
};
