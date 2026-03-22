// src/services/api.js

// PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT URL HERE:
export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxvmDkmvlxc-ZXCxhgFy5K9RtvaP47VZ7ZPGJgNtASNWjroDE-92ewkyigQ6MjBnXI/exec";

export const saveUserLocally = (name, phone) => {
  localStorage.setItem('hash_user_v2', JSON.stringify({ name, phone }));
};

export const getUserLocally = () => {
  const data = localStorage.getItem('hash_user_v2');
  return data ? JSON.parse(data) : null;
};

export const logoutLocally = () => {
  localStorage.removeItem('hash_user_v2');
};

export const apiCall = async (action, payload = {}) => {
  const user = getUserLocally();
  if (!user && action !== 'register') return { error: "Thou art unidentified in this realm." };

  const data = {
    action,
    name: payload.name || (user ? user.name : ""),
    phone: payload.phone || (user ? user.phone : ""),
    fragmentId: payload.fragmentId || null
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      }
    });

    const json = await response.json();
    return json;
  } catch (err) {
    console.error("API Error:", err);
    return { error: "The Oracle is silent. The thread of fate has been severed." };
  }
};
