// src/pureview/state.js

const state = {};
const subscribers = {};
const globalReactions = {}; // Tambahkan ini

export function getState(key) {
  return state[key];
}

export function setState(key, newValue) {
  if (state[key] !== newValue) {
    state[key] = newValue;
    if (subscribers[key]) {
      subscribers[key].forEach((subscriber) => subscriber(newValue));
    }
  }
}

export function subscribe(key, callback) {
  if (!subscribers[key]) {
    subscribers[key] = [];
  }
  subscribers[key].push(callback);
  // Kembalikan fungsi untuk unsubscribe
  return () => {
    subscribers[key] = subscribers[key].filter(sub => sub !== callback);
  };
}

export function unsubscribe(key, callback) {
  if (subscribers[key]) {
    subscribers[key] = subscribers[key].filter(sub => sub !== callback);
  }
}

export function getGlobalState(key) {
  return state[key];
}

export function setGlobalState(key, newValue) {
  if (state[key] !== newValue) {
    state[key] = newValue;
    if (subscribers[key]) {
      subscribers[key].forEach((subscriber) => subscriber(newValue));
    }
    // Jalankan check pada reaksi yang berlangganan
    if (globalReactions[key]) {
      globalReactions[key].forEach(reaction => reaction.check());
    }
  }
}

export function subscribeGlobal(key, callback) {
  return subscribe(key, callback); // Gunakan fungsi subscribe yang sudah ada
}

export function unsubscribeGlobal(key, callback) {
  return unsubscribe(key, callback); // Gunakan fungsi unsubscribe yang sudah ada
}

export function subscribeReactionGlobal(key, reaction) {
  if (!globalReactions[key]) {
    globalReactions[key] = [];
  }
  globalReactions[key].push(reaction);
}