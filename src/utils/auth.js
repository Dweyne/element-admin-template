import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  //Cookies.get(TokenKey)
  return localStorage.getItem('token')
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  Cookies.set(TokenKey, token)
  return localStorage.setItem('token', token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
