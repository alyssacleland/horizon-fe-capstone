import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// READ SINGLE TASK BY FIREBASE KEY
const getSingleTask = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// READ ALL TASKS BY UID
const getTasks = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

// READ TASKS BY CATEGORY_ID
const getCategoryTasks = (categoryFirebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks.json?orderBy="category_id"&equalTo="${categoryFirebaseKey}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

// CREATE TASK
const createTask = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks.json`, {
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

// UPDATE TASK
const updateTask = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks/${payload.firebaseKey}.json`, {
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

// DELETE TASK
const deleteTask = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/tasks/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { getTasks, getCategoryTasks, getSingleTask, createTask, updateTask, deleteTask };
