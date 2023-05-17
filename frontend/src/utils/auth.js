export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

function makeRequest(url, method, body) {
  const headers = {
    "Content-Type": "application/json"
  };

  const config = {
    method,
    headers,
    credentials: 'include'
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

export function register({ email, password }) {
  return makeRequest("/signup", "POST", { email, password });
}

export function authorize({ email, password }) {
  return makeRequest("/signin", "POST", { email, password });
}

export function checkToken(token) {
  return makeRequest("/users/me", "GET", undefined, token);
}
