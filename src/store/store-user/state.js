let localLoggedIn = JSON.parse(localStorage.getItem('LoggedInStoreUsersLocalStorage'))
let localActiveTableId = JSON.parse(localStorage.getItem('ActiveTableIdLocalStorage'))
let adminTokenLocal = JSON.parse(localStorage.getItem('AdminTokenLocalStorage'))
let empToLogoutLocal = JSON.parse(localStorage.getItem('empToLogoutLocalStorage'))

export default function () {
  return {
    activeTableId: localActiveTableId ? localActiveTableId: null,
    loggedInStoreUsers:  localLoggedIn ? localLoggedIn : {},
    admin: adminTokenLocal? adminTokenLocal : null,
    empToLogout: empToLogoutLocal ? empToLogoutLocal : null,
    envVariable: []
  }
}
