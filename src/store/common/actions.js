import { CommonAgent } from "src/agent";
import { Loading } from "quasar"
import displayLoader from "src/boot/displayLoader";
import notifications from "src/boot/notifications";
import Vue from 'vue';
const objVue = new Vue
let res;

export function getEntities ({ commit, dispatch}, params) {
  return new Promise((resolve, reject) => {
    CommonAgent.getEntities(params)
      .then(response => {
        if (response.status === 200) {
          commit('services/GET_SERVICES', {data: response.data.products}, {root: true})
          resolve()
        }
        else {
          notifications.failureNotify(response.message)
          reject()
        }
      })
      .catch(error => {
        error && error.response
          ? error.response.status==401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject()
      })
      .finally(() => {
        process.env.CLIENT?Loading.hide():null
      })
  })
}

export function getRestaurantProducts ({ commit, dispatch}, params) {
  return new Promise((resolve, reject) => {
    CommonAgent.getRestaurantProducts(params)
      .then(response => {
        if (response.status === 200) {
          commit('products/GET_RESTAURANT_PRODUCTS', {data: response.data.restaurant_products}, {root: true})
          resolve()
        }
        else {
          notifications.failureNotify(response.message)
          reject()
        }
      })
      .catch(error => {
        console.log(error)
        error && error.response
          ? error.response.status==401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject()
      })
      .finally(() => {
        process.env.CLIENT?Loading.hide():null
      })
  })
}


export function getAttachments ({ commit, dispatch}, params) {
  return new Promise((resolve, reject) => {
    CommonAgent.getAttachments(params)
      .then(response => {
        if (response.status === 200) {
          commit('GET_ATTACHMENTS', {data: response.data.attachment})
          resolve()
        }
        else {
          notifications.failureNotify(response.message)
          reject()
        }
      })
      .catch(error => {
        console.log(error)
        error && error.response
          ? error.response.status==401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject()
      })
      .finally(() => {
        process.env.CLIENT?Loading.hide():null
      })
  })
}


