import { BASE_URL } from "./auth";

export default class Api {
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
  
  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }
  
  getInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  _setHeaders() {
    this._token = localStorage.getItem("token");
    this._headers.authorization = `Bearer ${this._token}`;
    return this._headers;
  }
  
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }
  
  addInfo(data) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._setHeaders(),
      method: "PATCH",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    });
  }
  
  createCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._setHeaders(),
      method: "POST",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    });
  }
  
  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._setHeaders(),
          method: "PUT",
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._setHeaders(),
        method: "DELETE",
      });
    }
  }
  
  deleteCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      headers: this._setHeaders(),
      method: "DELETE",
    });
  }
  
  addAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._setHeaders(),
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});