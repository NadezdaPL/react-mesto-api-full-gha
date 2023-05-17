import { BASE_URL, makeRequest } from "./auth";

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
    return makeRequest("/users/me", "GET");
  }
  
  getInitialCards() {
    return makeRequest("/cards", "GET");
  }
  
  addInfo({ name, about }) {
    return makeRequest("/users/me", "PATCH", { name, about });
  }
  
  createCard({ name, link }) {
    return makeRequest("/cards", "POST", { name, link });
  }
  
  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return makeRequest(`/cards/${id}/likes`, "PUT");
    } else {
      return makeRequest(`/cards/${id}/likes`, "DELETE");
    }
  }
  
  deleteCard(id) {
    return makeRequest(`/cards/${id}`, "DELETE");
  }
  
  addAvatar({ avatar }) {
    return makeRequest("/users/me/avatar", "PATCH", { avatar });
  }
}

export const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});