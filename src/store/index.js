import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import storeUser from './store-user'
import orders from './orders'
import services from './services'
import products from './products'
import settings from './settings'
import common from './common'
import customers from './customers'
import cash from './cash'
import cashdrawer from './cashdrawer'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      storeUser,
      orders,
      services,
      products,
      settings,
      common,
      customers,
      cash,
      cashdrawer
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
