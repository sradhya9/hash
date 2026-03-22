// src/services/api.js

// PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT URL HERE:
export const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyw1RrIa5UO0mmppVxFnY4GqDhJtDeIbWjqhAsJHXyZJ2L_44eUOEDleMhhI2UhG4RY/exec";

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
    // Generate query string for GET request
    const params = new URLSearchParams(data).toString();
    const urlWithParams = `${SCRIPT_URL}?${params}`;

    console.log("Calling Oracle at:", urlWithParams);
    const response = await fetch(urlWithParams, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
    });

    const text = await response.text();
    console.log("Oracle Response Text:", text);

    try {
      const json = JSON.parse(text);
      return json;
    } catch (e) {
      console.error("Oracle spoke in riddles (Invalid JSON):", text);
      return { error: "The Oracle spoke in riddles. (Invalid Response)" };
    }
  } catch (err) {
    console.error("API Error:", err);
    return { error: "The Oracle is silent. The thread of fate has been severed." };
  }
};
