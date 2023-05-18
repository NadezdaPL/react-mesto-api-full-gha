export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

function checkResponse(response) {
  if (response.ok) {
    return response.json();
  }
    return Promise.reject(response);
  }

export function register(data) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "email": data.email, "password": data.password })
  }).then((response) => checkResponse(response));
}

export function authorize(data) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "email": data.email, "password": data.password })
  }).then((response) => checkResponse(response));
}

export const checkToken = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    }
  });
}


// export const BASE_URL = "https://api.project-mesto.nomoredomains.monster";

// function makeRequest(url, method, body, token) {
//   const headers = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   if (token !== undefined) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const config = {
//     method,
//     headers,
//   };

//   if (body !== undefined) {
//     config.body = JSON.stringify(body);
//   }

//   return fetch(`${BASE_URL}${url}`, config).then((response) => {
//     return response.ok
//       ? response.json()
//       : Promise.reject(`Error: ${response.status} ${response.statusText}`);
//   });
// }

// export function register(email, password) {
//   return makeRequest("/signup", "POST", { email, password });
// }

// export function authorize(email, password) {
//   return makeRequest("/signin", "POST", { email, password });
// }

// export const checkToken = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     }
//   });
// }