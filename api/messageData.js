import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createMessage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getMessages = (senderId, receiverId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages.json?orderBy="senderId"&equalTo="${senderId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const filteredMessages = Object.values(data).filter((message) => message.receiverId === receiverId);
        resolve(filteredMessages);
      } else {
        resolve([]);
      }
    })
    .catch(reject);
});

const updateMessage = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const deleteMessage = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/messages/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

export {
  createMessage, getMessages, updateMessage, deleteMessage,
};
