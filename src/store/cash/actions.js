import { CashAgent } from "src/agent";
import { Loading } from "quasar"
import displayLoader from "src/boot/displayLoader";
import notifications from "src/boot/notifications";
import Vue from 'vue';
// import store from "..";
const objVue = new Vue
let res;

export function cashUp({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    CashAgent.cashUp(params)
      .then(response => {
        if (response.status === 200) {
          resolve(response)
        } else {
          reject(response.status)
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

export function advanceCash({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    CashAgent.advanceCash(params)
      .then(response => {
        if (response.status === 200) {
          resolve(response)
        } else {
          reject(response.status)
        }
      })
      .catch(error => {
        error && error.response
          ? error.response.status == 400
            ? notifications.failureNotify(error.response.data.message)
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error.response.data.data.message)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function getPendingCashUpDates({ commit, dispatch }, params) {
  displayLoader.displayLoader()
  CashAgent.getPendingCashUpDates(params)
    .then(response => {
      if (response.status === 200) {
        commit('GET_PENDING_CASH_UP_DATES', response.data.cashupDates)
      }
      else {
        objVue.$q.notify({
          message: response.message,
          type: 'negative',
          position: 'center',
          timeout: 1500
        })
      }
    })
    .catch(error => {
      objVue.$q.notify({
        message: error.response && error.response.message ? error.response.message : 'Something went wrong!',
        type: 'negative',
        position: 'center',
        timeout: 1500
      })
    })
    .finally(() => {
      process.env.CLIENT ? Loading.hide() : null
    })
}
