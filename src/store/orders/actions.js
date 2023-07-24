import { OrderAgent } from "src/agent";
import { Loading } from "quasar"
import displayLoader from "src/boot/displayLoader";
import Vue from 'vue';
import notifications from "src/boot/notifications";
const objVue = new Vue
let res;

export function getPreviousOrders({ commit, dispatch }, params) {
  displayLoader.displayLoader()
  OrderAgent.getPreviousOrders(params)
    .then(response => {
      if (response.status === 200) {
        res = {
          res_data: response.data.orders,
          res_msg: 'Successful!'
        }
        commit('GET_ORDERS_APPEND', res.res_data)
        commit('TOTAL_ORDERS', response.data.total)
      }
      else {
        notifications.failureNotify(response.message)
      }
    })
    .catch(error => {
      error && error.response
        ? error.response.status == 401
          ? notifications.failureNotify("Unauthorized Access!")
          : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
        : error && error.request
          ? notifications.failureNotify('Backend server issue!')
          : notifications.failureNotify('Something went wrong!')
    })
    .finally(() => {
      process.env.CLIENT ? Loading.hide() : null
    })
}

export function createOrder({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.createOrder(params)
      .then(response => {
        if (response.status === 200) {
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let guestCustomer = {
          id: undefined,
          customer_notes: "customer notes",
          dob: "",
          email: "guest@customer.com",
          first_name: "Guest",
          gender: "",
          status: 1,
          is_verified: 1,
          last_name: "C",
          phone: "999999999",
          postcode: "9999",
        }
        let msg = null
        if (error && error.response) {
          msg = error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!'
        } else if (error && error.request) {
          msg = 'Backend server issue!'
          commit('SET_PENDING_ORDERS', params)
          commit("orders/DELETE_PAID_ORDER", {
            activeTableId: params.created_by,
          }, { root: true });

          commit(
            "orders/CHECK_IF_CONTAINS_SERVICE",
            { activeTableId: params.created_by, val: 0 },
            { root: true }
          );
          commit(
            "orders/CHECK_IF_CONTAINS_INTERNAL_PRODUCT",
            { activeTableId: params.created_by, val: 0 },
            { root: true }
          );
          commit(
            "customers/SET_CURRENT_CUSTOMER",
            {
              activeTableId: params.created_by,
              customer_rec: guestCustomer,
            },
            { root: true }
          );
          commit(
            "orders/DELETE_PAID_BY_CASH_INSTANCE",
            params.created_by, { root: true }
          );
          commit(
            "orders/DELETE_PAID_BY_CARD_INSTANCE",
            params.created_by, { root: true }
          );
        } else {
          msg = 'Something went wrong!'
        }
        notifications.failureNotify(msg)
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function refundOrder({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.refundOrder(params)
      .then(response => {
        if (response.status === 200) {
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

export function getOrderTypes({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.getOrderTypes()
      .then(response => {
        if (response.status === 200) {
          commit('GET_ORDER_TYPES', response.data.order_types)
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let msg = null
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function getPaymentMethods({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.getPaymentMethods()
      .then(response => {
        if (response.status === 200) {
          commit('GET_PAYMENT_METHODS', response.data.payment_methods)
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let msg = null
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function getOrderLineItems({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.getOrderLineItems()
      .then(response => {
        if (response.status === 200) {
          commit('GET_ORDER_LINE_ITEMS', response.data.data)
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let msg = null
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}

export function getRefundedOrders({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    OrderAgent.getRefundedOrders(params)
      .then(response => {
        if (response.status === 200) {
          commit('GET_REFUNDED_ORDERS', response.data.refunded_orders)
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let msg = null
        error && error.response
          ? error.response.status == 401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message ? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT ? Loading.hide() : null
      })
  })
}
