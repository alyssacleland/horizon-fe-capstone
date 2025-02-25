import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// READ SINGLE USER BY UID
const getUser = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/users.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(Object.values(data));
        } else {
          resolve([]);
        }
      })
      .catch(reject);
  });

// CREATE USER
const createUser = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/users.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// UPDATE USER
const updateUser = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
export { getUser, createUser, updateUser };
