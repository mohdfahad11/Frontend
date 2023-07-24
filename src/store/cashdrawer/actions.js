import { CashDrawerAgent } from "src/agent";
import { Loading } from "quasar"
import notifications from "src/boot/notifications";
import Vue from 'vue';
const objVue = new Vue
let res;

export function openCashDrawerAPI ({ commit, dispatch}, params) {
  return new Promise((resolve, reject) => {
    CashDrawerAgent.openCashDrawerAPI(params)
      .then(response => {
        if (response.status === 200) {
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
            ? notifications.failureNotify('Cashdrawer not connected!')
            : notifications.failureNotify('Cashdrawer Issue!')
        reject()
      })
      .finally(() => {
        process.env.CLIENT?Loading.hide():null
      })
  })
}
