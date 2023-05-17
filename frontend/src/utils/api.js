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
  
  getInfo(jwt) {
    return this._request(`${BASE_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });
  }
  
  getInitialCards(jwt) {
    return this._request(`${BASE_URL}/cards`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });
  }
  
  addInfo(data, jwt) {
    return this._request(`${BASE_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        name: `${data.name}`,
        about: `${data.about}`,
      }),
    });
  }
  
  createCard(data, jwt) {
    return this._request(`${BASE_URL}/cards`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: data.title,
        link: data.link,
      }),
    });
  }
  
  changeLikeCardStatus(id, isLiked, jwt) {
    if (isLiked) {
      return this._request(`${BASE_URL}/cards/${id}/likes`, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
          method: "PUT",
      });
    } else {
      return this._request(`${BASE_URL}/cards/${id}/likes`, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
    }
  }
  
  deleteCard(id, jwt) {
    return this._request(`${BASE_URL}/cards/${id}`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
  }
  
  addAvatar(data, jwt) {
    return this._request(`${BASE_URL}/users/me/avatar`, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }
}

export const api = new Api({
  baseUrl: "https://localhost:3000",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
    "Content-Type": "application/json",
  },
});
