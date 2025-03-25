
// utils/auth.js
export function setLoggedIn(value) {
  localStorage.setItem("loggedIn", JSON.stringify(value));
  window.dispatchEvent(new Event("authChange"));
}
