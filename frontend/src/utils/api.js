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
      return response.ok 
      ? response.json()
      : Promise.reject( new Error(`Error: ${response.status} ${response.statusText}`));
    }
  
  getInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      credentials: "include",
      headers: this._headers,
    }).then((response) => this._checkResponse(response))
  }
  
  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }).then((response) => this._checkResponse(response))
  }
  
  addInfo(data, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      method: "PATCH",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    }).then((response) => this._checkResponse(response))
  }
  
  createCard(data, token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    }).then((response) => this._checkResponse(response))
  }
  
  changeLikeCardStatus(id, isLiked, token) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
          method: "PUT",
      });
    } else {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        method: "DELETE",
      }).then((response) => this._checkResponse(response))
    }
  }
  
  deleteCard(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      method: "DELETE",
    }).then((response) => this._checkResponse(response))
  }
  
  addAvatar(data, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((response) => this._checkResponse(response))
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`
  },
});
