export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  })
  .then((response => response.ok || response.status === 400
    ? response.json()
    : Promise.reject(`Error: ${response.status} ${response.statusText}`)
  ))
}

export function authorize(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password })
  })
  .then((response => response.ok || response.status === 401
    ? response.json()
    : Promise.reject(`Error: ${response.status} ${response.statusText}`)
  ))
}

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  .then((response => response.ok
    ? response.json()
    : Promise.reject(`Error: ${response.status} ${response.statusText}`)
  ))
  .then((data) => data)
}
