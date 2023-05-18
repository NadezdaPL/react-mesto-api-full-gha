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
  
  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }
  
  getInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      credentials: "include",
    });
  }
  
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      credentials: "include",
    });
  }
  
  addInfo(data) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    });
  }
  
  createCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    });
  }
  
  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "PUT",
        credentials: "include",
      });
    } else {
      return this._request(`${this._baseUrl}/cards/${id}/likes`, {
        headers: this._headers,
        method: "DELETE",
        credentials: "include",
      });
    }
  }
  
  deleteCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      headers: this._headers,
      method: "DELETE",
      credentials: "include",
    });
  }
  
  addAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      credentials: "include",
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
    Authorization: `Bearer ${localStorage.getItem('jwt')}`
  },
});
