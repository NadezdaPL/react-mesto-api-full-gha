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
    return Promise.reject(response);
  }
  
 _getHeaders() {
    this._token = localStorage.getItem('token');
    this._headers.authorization = `Bearer ${this._token}`
    return this._headers;
 }
  
  getInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
      method: "GET",
    }).then(this._checkResponse)
  }
  
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
      method: "GET",
    }).then(this._checkResponse)
  }
  
  addInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
      method: "PATCH",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    }).then(this._checkResponse)
  }
  
  createCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
      method: "POST",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    }).then(this._checkResponse)
  }
  
  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._getHeaders(),
          method: "PUT",
      }).then(this._checkResponse)
    } else {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._getHeaders(),
        method: "DELETE",
      }).then(this._checkResponse)
    }
  }
  
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      headers: this._getHeaders(),
      method: "DELETE",
    }).then(this._checkResponse)
  }
  
  addAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._getHeaders(),
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._checkResponse)
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});
