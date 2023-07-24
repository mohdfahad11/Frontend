import { ServiceAgent } from "src/agent";
import { Loading } from "quasar"
import notifications from "src/boot/notifications";
import Vue from 'vue';
const objVue = new Vue
let res;

export function getCategories ({ commit, dispatch}, params) {
  // displayLoader.displayLoader()
  ServiceAgent.getCategories(params)
    .then(response => {
      if (response.status === 200) {
          res = {
              res_data: response.data.categories,
              res_msg: 'Successful!'
          }
          commit('GET_CATEGORIES', res.res_data)
      }
      else {
        notifications.failureNotify(response.message)
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
    })
    .finally(() => {
      process.env.CLIENT?Loading.hide():null
    })
}
