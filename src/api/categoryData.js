import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// CREATE CATEGORY
const createCategory = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories.json`, {
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

// UPDATE CATEGORY
const updateCategory = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories/${payload.firebaseKey}.json`, {
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

// READ ALL CATEGORIES BY UID
const getCategories = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

// READ SINGLE CATEGORY BY FIREBASE KEY
const getSingleCategory = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

// DELETE CATEGORY
const deleteSingleCategory = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/categories/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

export { createCategory, updateCategory, getCategories, getSingleCategory, deleteSingleCategory };
