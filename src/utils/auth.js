import Cookies from 'js-cookie'

const TokenKey = 'TEMPLATE-VUE-ADMIN-TOKEN'
const Expired = 'seconds'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, seconds) {
  const times = seconds || getSeconds()
  const date = new Date()
  date.setTime(date.getTime() + (times * 1000))
  return Cookies.set(TokenKey, token, { expires: date })
}

export function getSeconds() {
  return Cookies.get(Expired)
}

export function setSeconds(seconds) {
  const date = new Date()
  date.setTime(date.getTime() + (seconds * 1000))
  return Cookies.set(Expired, seconds, { expires: date })
}

export function removeToken() {
  Cookies.remove(Expired)
  return Cookies.remove(TokenKey)
}
