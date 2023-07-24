import { StoreUserAgent } from "src/agent";
import { Loading, Notify } from "quasar"
import displayLoader from "src/boot/displayLoader";
import Vue from 'vue';
import notifications from "src/boot/notifications";
const objVue = new Vue
let res;

export function login({ commit, state }, loginData) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    StoreUserAgent.login(loginData)
      .then(response => {
        if (response.status === 200) {
          let data = response.data
          if (data.token) {
            let PERSON = {
              "user": data.user,
              "token": data.token
            }

            commit('LOGIN_SUCCESS', PERSON)
            resolve()
          }
        } else {
          notifications.failureNotify(response.data.message)
          reject()
        }
      })
      .catch(error => {
        error && error.response
          ? [401, 400].includes(error.response.status)
            ? notifications.failureNotify(error.response.data.message)
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject()
      })
      .finally(() => {
        Loading.hide()
      })
  })
}


export function authenticateUser({ commit, state }, loginData) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    StoreUserAgent.login(loginData)
      .then(response => {
        if (response.status === 200) {

          let data = response.data
          if (data.token) {
            resolve({ isAuthenticated: true, data: data })
          } else {
            reject({ isAuthenticated: false, data: response })
          }
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify(error.response.data.message)
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
      })
      .finally(() => {
        Loading.hide()
      })
  })
}


export function logout({ commit, dispatch }) {
  displayLoader.displayLoader()
  StoreUserAgent.logout()
    .then((response) => {
      if (response.status == 200) {
        commit('LOGOUT');
      }
      else {
        notifications.failureNotify('Something went wrong! Please try again')
      }
    })
    .catch(error => {
      let msg = null
      error && error.response
        ? msg = error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!'
        : error && error.request
          ? msg = 'Backend server issue!'
          : msg = 'Something went wrong!'
      notifications.failureNotify(msg)
    })
    .finally(() => {
      Loading.hide()
    })
}

export function logoutStoreAdmin({ commit, dispatch }) {
  displayLoader.displayLoader()
  StoreUserAgent.logoutStoreAdmin()
    .then((response) => {
      if (response.status == 200) {
        commit('LOGOUT_STORE_ADMIN');
      }
      else {
        notifications.failureNotify('Something went wrong! Please try again!')
      }
    })
    .catch(error => {
      let msg = null
      error && error.response
        ? msg = msg = error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!'
        : error && error.request
          ? msg = 'Backend server issue!'
          : msg = 'Something went wrong!'
      notifications.failureNotify(msg)
    })
    .finally(() => {
      Loading.hide()
    })
}

export function getEnvVariable({ commit }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    StoreUserAgent.getEnvVariables(params)
      .then(response => {
        if (response.status === 200) {
          console.log(response.data)
          commit('GET_ENV_VARIABLE', response.data)
          resolve()
        } else {
          notifications.failureNotify(response.data.message)
          reject()
        }
      })
      .catch(error => {
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify(error.response.data.message)
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject()
      })
      .finally(() => {
        Loading.hide()
      })
  })
}