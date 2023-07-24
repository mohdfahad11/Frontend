import { SettingsAgent } from "src/agent";
import { Loading, Notify } from "quasar"
import displayLoader from "src/boot/displayLoader";
import notifications from "src/boot/notifications";
import Vue from 'vue';
const objVue = new Vue
let res;

export function getPaymentGateways({ commit }) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.getPaymentGateways()
      .then(response => {
        if (response.status === 200) {
          commit('GET_PAYMENT_GATEWAYS', response.data.payment_gateways)
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : error && error.response
            ? error.response.status == 401
              ? notifications.failureNotify("Unauthorized Access!")
              : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
            : error && error.request
              ? notifications.failureNotify('Backend server issue!')
              : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function getRestaurantSettings({ commit }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.getRestaurantSettings(params)
      .then(response => {
        if (response.status === 200) {
          commit('INIT_SETTINGS', response.data.restaurant_settings)
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : error && error.response
            ? error.response.status == 401
              ? notifications.failureNotify("Unauthorized Access!")
              : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
            : error && error.request
              ? notifications.failureNotify('Backend server issue!')
              : notifications.failureNotify('Something went wrong!')
        reject(error.response)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function getGatewaySettings({ commit }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.getGatewaySettings(params)
      .then(response => {
        if (response.status === 200) {
          commit('INIT_GATEWAY_SETTINGS', response.data.restaurant_payment_gateway_settings)
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        console.log(error)
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : error && error.response
            ? error.response.status == 401
              ? notifications.failureNotify("Unauthorized Access!")
              : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
            : error && error.request
              ? notifications.failureNotify('Backend server issue!')
              : notifications.failureNotify('Something went wrong!')
        reject(error.response)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function editPosGeneralSettings({ commit }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()

    SettingsAgent.editPosGeneralSettings(params)
      .then(response => {
        if (response.status === 200) {
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function editPaymentGateway({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.editPaymentGateway(params)
      .then(response => {
        if (response.status === 200) {
          dispatch('getGatewaySettings', { restaurant_id: 1 })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function savePosConfiguration({ commit, dispatch, rootState }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.savePosConfiguration(params)
      .then(response => {
        if (response.status === 200) {
          dispatch('getRestaurantSettings', { restaurant_id: rootState.storeUser.envVariable.restaurant_settings.restaurant_id })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function saveGatewayConfiguration({ commit, dispatch, rootState }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.saveGatewayConfiguration(params)
      .then(response => {
        if (response.status == 200) {
          dispatch('getGatewaySettings', { restaurant_id: rootState.storeUser.envVariable.restaurant_settings.restaurant_id })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function getRestaurantTables({ commit }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.getRestaurantTables(params)
      .then(response => {
        if (response.status === 200) {
          commit('SET_RESTAURANT_TABLE_LIST', response.data.restaurant_tables)
          commit('SET_TABLE_COUNT', response.data.total)
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function saveRestaurantTableList({ commit, dispatch, rootState }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.saveRestaurantTableList(params)
      .then(response => {
        if (response.status === 200) {
          dispatch('getRestaurantTables', { restaurant_id: rootState.storeUser.envVariable.restaurant_settings.restaurant_id })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function activeInactiveGateway({ commit, dispatch, rootState }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.activeInactiveGateway(params)
      .then(response => {
        if (response.status === 200) {
          dispatch('getGatewaySettings', { restaurant_id: rootState.storeUser.envVariable.restaurant_settings.restaurant_id })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function editRestaurantTable({ commit, dispatch, rootState }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    SettingsAgent.editRestaurantTable(params)
      .then(response => {
        if (response.status === 200) {
          // commit('UPDATE_RESTAURANT_TABLE', params)
          dispatch('getRestaurantTables', { restaurant_id: rootState.storeUser.envVariable.restaurant_settings.restaurant_id })
          resolve()
        } else {
          notifications.failureNotify(response)
          reject(response)
        }
      })
      .catch(error => {
        error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : reject(error)
      })
      .finally(() => {
        Loading.hide()
      })
  })
}

export function setCashDrawerAPIPort({ commit }, params) {
  commit('SET_CASHDRAWER_API_PORT', params.cashDrawerAPIPort)
}
