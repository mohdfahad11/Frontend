import { ProductAgent } from "src/agent";
import displayLoader from "src/boot/displayLoader";
import Vue from 'vue';
import { Loading } from "quasar"
const objVue = new Vue;
let res;


export function getRestaurantProductModifiers ({ commit, dispatch}, params) {
  return new Promise((resolve, reject) => {
    displayLoader.displayLoader()
    ProductAgent.getRestaurantProductModifiers(params)
      .then(response => {
        if(response.status === 200) {
          commit('GET_RESTAURANT_PRODUCT_MODIFIERS', response.data.restaurant_product_modifiers)
          resolve(response)
        } else {
          notifications.failureNotify(response.message)
          reject(response)
        }
      })
      .catch(error => {
        let msg = null
        error && error.response
          ? error.response.status==401
            ? notifications.failureNotify("Unauthorized Access!")
            : notifications.failureNotify(error.response.data && error.response.data.data && error.response.data.data.message? error.response.data.data.message : 'Something went wrong!')
          : error && error.request
            ? notifications.failureNotify('Backend server issue!')
            : notifications.failureNotify('Something went wrong!')
        reject(error)
      })
      .finally(() => {
        process.env.CLIENT?Loading.hide():null
      })
  })
}
