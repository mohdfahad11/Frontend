import Vue from "vue"

export function GET_CUSTOMERS (state, res) {
  state.customers = [...res]
}

export function SET_CURRENT_CUSTOMER (state, res) {
  Vue.set(state.currentCustomer, res.activeTableId, res.customer_rec)
  localStorage.setItem('CurrentCustomerLocalStorage', JSON.stringify(state.currentCustomer))
}

export function GET_CUSTOMER_DETAILS (state, res) {
  state.customerDetails = Object.assign({}, res)
}

export function DELETE_CURRENT_CUSTOMER (state, id) {
  Vue.delete(state.currentCustomer, id)
  localStorage.setItem('CurrentCustomerLocalStorage', JSON.stringify(state.currentCustomer))
}
