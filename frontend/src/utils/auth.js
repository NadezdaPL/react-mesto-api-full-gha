export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

function makeRequest(url, method, body) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const config = {
    method,
    headers,
    credentials: "include"
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${BASE_URL}${url}`, config).then((response) => {
    return response.ok
      ? response.json()
      : Promise.reject(`Error: ${response.status} ${response.statusText}`);
  });
}

const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
    return response.ok 
    ? response.json()
    : Promise.reject( new Error(`Error: ${response.status} ${response.statusText}`));
  }

export function register({ email, password }) {
  return makeRequest("/signup", "POST", { email, password }).then((response) => checkResponse(response))
}

export function authorize({ email, password }) {
  return makeRequest("/signin", "POST", { email, password }).then((response) => checkResponse(response))
}

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: `Bearer ${token}`
    },
  }).then((response) => this._checkResponse(response))
}
