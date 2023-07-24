import { CustomerAgent } from "src/agent";
import { Loading } from "quasar"
import displayLoader from "src/boot/displayLoader";
import Vue from 'vue';
import notifications from "src/boot/notifications";
const objVue = new Vue
let res;

export function registerCustomer({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    CustomerAgent.registerCustomer(params)
      .then(response => {
        if (response.status === 200) {
          notifications.successNotify('Customer is Registered Successfully!')
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
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
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function getCustomers({ commit, dispatch }, params) {
  displayLoader.displayLoader()
  CustomerAgent.getCustomers(params)
    .then(response => {
      if (response.status === 200) {
        commit('GET_CUSTOMERS', response.data.users)
      }
      else {
        notifications.failureNotify(response.message)
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
      process.env.CLIENT ? Loading.hide() : null
    })
}

export function getCustomerDetails({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    CustomerAgent.getCustomerDetails(params)
      .then(response => {
        if (response.status === 200) {
          commit('GET_CUSTOMER_DETAILS', response.data.user)
          resolve()
        }
        else {
          notifications.failureNotify(response.message)
          reject()
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
        reject()
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function updateCustomer({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    CustomerAgent.updateCustomer(params)
      .then(response => {
        if (response.status === 200) {
          dispatch('getCustomers', { per_page: 9999 })
          resolve()
        }
        else {
          notifications.failureNotify(response.message)
          reject()
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
        reject()
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}
