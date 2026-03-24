// utils/auth.js

export const isLoggedIn = () => {
  const token = localStorage.getItem("accessToken");
  return !!token; // true if token exists
};

export const getUser = () => {
  return {
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  };
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/"; // force redirect
};
