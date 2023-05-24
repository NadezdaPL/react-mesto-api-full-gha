export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

function checkResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(new Error(`Error: ${response.status}: ${response.statusText}`));
}

export function register({ email, password }) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  }).then((response) => checkResponse(response));
}

export function authorize({ email, password }) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  }).then((response) => checkResponse(response));
}

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
}
