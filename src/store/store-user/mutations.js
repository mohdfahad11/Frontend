import Vue from "vue";

export function SET_ACTIVE_TABLE_ID (state,val) {
  state.activeTableId = Object.assign({}, val)
  localStorage.setItem('ActiveTableIdLocalStorage', JSON.stringify(state.activeTableId))
}

export function SET_EMP_TO_LOGOUT(state, obj) {
  state.empToLogout = Object.assign({}, obj)
  localStorage.setItem('empToLogoutLocalStorage',JSON.stringify(state.empToLogout))
}

export function LOGIN_SUCCESS(state, PERSON) {
  if(PERSON.user.role_id == 1) {
    state.admin = Object.assign({}, PERSON)
    localStorage.setItem('AdminTokenLocalStorage', JSON.stringify(state.admin))
  }
  Vue.set(state.loggedInStoreUsers, PERSON.user.id, PERSON)
  localStorage.setItem('LoggedInStoreUsersLocalStorage', JSON.stringify(state.loggedInStoreUsers))
}
export function LOGIN_FAIL(state) {
  state.status = {};
  state.user = null;
  state.loggedIn = false;
}

export function LOGOUT_STORE_ADMIN() {
  localStorage.removeItem('StoreAdminTokenLocalStorage')
}
export function LOGOUT(state) {
  let su = JSON.parse(localStorage.getItem('empToLogoutLocalStorage'))
  localStorage.removeItem('empToLogoutLocalStorage')
  if(su.user.role_id == 1) {
    localStorage.removeItem('AdminTokenLocalStorage')
  }
  Vue.delete(state.loggedInStoreUsers, su.user.id)
  if(Object.keys(state.loggedInStoreUsers).length == 0) {
    localStorage.removeItem('LoggedInStoreUsersLocalStorage')
    localStorage.removeItem('OrderListLocalStorage')
    localStorage.removeItem('PaidByCashLocalStorage')
    localStorage.removeItem('PaidByCardLocalStorage')
    localStorage.removeItem('TotalAmountLocalStorage')
    localStorage.removeItem('CurrentCustomerLocalStorage')
    localStorage.removeItem('OrderPaymentsLocalStorage')
  } else {
    localStorage.setItem('LoggedInStoreUsersLocalStorage', JSON.stringify(state.loggedInStoreUsers))
  }
}
export function LOGIN_STATUS(state,res) {
  state.loggedIn = res
}

export function GET_STORE_ADMIN_TOKEN (state, res) {
  state.admin = res
  state.admin ? localStorage.setItem('AdminTokenLocalStorage', JSON.stringify(state.admin)) : null
}

export function GET_ENV_VARIABLE (state, res) {
  state.envVariable = res
}