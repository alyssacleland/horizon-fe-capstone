import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// CREATE REWARD
const createReward = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/rewards.json`, {
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

// UPDATE REWARD
const updateReward = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/rewards/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// DELETE REWARD
const deleteReward = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/rewards/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// GET ALL REWARDS BY UID
const getRewards = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/rewards.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

// GET SINGLE REWARD BY FB KEY
const getSingleReward = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/rewards/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { createReward, updateReward, deleteReward, getRewards, getSingleReward };
