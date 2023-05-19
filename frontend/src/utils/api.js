import { BASE_URL } from "./auth";

class Api {
  constructor(options) {
    this._options = options;
    this._baseUrl = this._options.baseUrl;
    this._headers = this._options.headers;
  }
  
  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error(`Error: ${response.status}: ${response.statusText}`));
  }
  
  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }
  
  getInitialCards(jwt) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      }
    })
  }
  
  addInfo(data, jwt) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      method: "PATCH",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    })
  }
  
  createCard(data, jwt) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      method: "POST",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    })
  }
  
  changeLikeCardStatus(id, isLiked, jwt) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        method: "PUT",
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        method: "DELETE",
      })
    }
  }
  
  deleteCard(id, jwt) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      method: "DELETE",
    })
  }
  
  addAvatar(data, jwt) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    })
  }

  getInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      credentials: "include",
      headers: this._headers,
    })
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
  },
});
