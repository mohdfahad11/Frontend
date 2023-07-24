
import { axiosInstance, anotherAxiosInstance } from "./boot/axios";
export function attachActiveTableStaffHeader() {
  let linkedStaffToken
  let activeTable = JSON.parse(localStorage.getItem('ActiveTableIdLocalStorage'))
  let staffLinkTable = JSON.parse(localStorage.getItem('StaffTableLinkLocalStorage'))
  let admin = JSON.parse(localStorage.getItem('AdminTokenLocalStorage'))
  if (activeTable && staffLinkTable && staffLinkTable.hasOwnProperty(activeTable.name)) {
    linkedStaffToken = staffLinkTable[activeTable.name]['token']
  } else if (admin) {
    linkedStaffToken = admin.token
  } else {
    let loggedInStoreUsers = JSON.parse(localStorage.getItem('LoggedInStoreUsersLocalStorage'))
    linkedStaffToken = loggedInStoreUsers[Object.keys(loggedInStoreUsers)[0]]['token']
  }
  if (linkedStaffToken) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + linkedStaffToken
  }
}
export function attachEmpAuthHeader() {
  let empTokenToLogouot
  empTokenToLogouot = JSON.parse(localStorage.getItem('empToLogoutLocalStorage'))
  if (empTokenToLogouot.token) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + empTokenToLogouot.token
  }
}


const anotherRequests = {
  post: (url, body, headers) => anotherAxiosInstance().post(url, body, headers),
}

export function attachPrinterName(name) {
  console.log('printer', name)
  anotherAxiosInstance().defaults.headers.common["PrinterName"] = name
}

const Requests = {
  del: (url, body = {}) => {
    return axiosInstance.delete(url, { data: body });
  },
  get: (url, params = {}) =>
    axiosInstance.get(url, { params }),
  post: (url, body) => axiosInstance.post(url, body),
  put: (url, body) => axiosInstance.put(url, body),
  patch: (url, body) => axiosInstance.patch(url, body)
};

export const ServiceAgent = {
  getCategories: (params) => {
    return Requests.get('categories', params)
  }
}

export const StoreUserAgent = {
  login: (params) => {
    return Requests.post('login', params).catch(err => {
      throw err
    })
  },
  logout: () => {
    attachEmpAuthHeader();
    return Requests.put('logout')
  },
  getEnvVariables: (params) => {
    return Requests.get('restaurant-setting/' + params.unique_id)
  }
}
export const SettingsAgent = {
  getRestaurantTables: (params) => {
    return Requests.get('restaurant-tables', params)
  },
  saveRestaurantTableList: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('restaurant-tables', params)
  },
  editRestaurantTable: (params) => {
    attachActiveTableStaffHeader()
    return Requests.patch('restaurant-table/' + params.restaurant_id + '/' + params.table_id, params.obj)
  },
  getPaymentGateways: () => {
    return Requests.get('payment-gateways')
  },
  getRestaurantSettings: (params) => {
    return Requests.get('restaurant-settings', params)
  },
  getGatewaySettings: (params) => {
    return Requests.get('restaurant-payment-gateway-settings', params)
  },
  savePosConfiguration: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('restaurant-settings', params)
  },
  saveGatewayConfiguration: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('restaurant-payment-gateway-settings', params)
  },
  editPosGeneralSettings: (params) => {
    attachActiveTableStaffHeader()
    return Requests.patch('/restaurant-settings/' + params.restaurant_id, params.body)
  },
  editPaymentGateway: (params) => {
    attachActiveTableStaffHeader()
    return Requests.patch('restaurant-payment-gateway-settings/' + params.restaurant_id + "/" + params.gateway_id, params.body)
  },
  activeInactiveGateway: (params) => {
    attachActiveTableStaffHeader()
    return Requests.patch('restaurant-payment-gateway-settings/status/' + params.restaurant_id + "/" + params.payment_gateway_id, params.body)
  }
}
export const OrderAgent = {
  getOrderLineItems: (params) => {
    return Requests.get('order-line-items', params)
  },
  getPreviousOrders: (params) => {
    return Requests.get('orders', params)
  },
  createOrder: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('order', params)
  },
  getOrderTypes: () => {
    return Requests.get('order-types')
  },
  getPaymentMethods: () => {
    return Requests.get('payment-methods')
  },
  refundOrder: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('refund', params)
  },
  getRefundedOrders: (params) => {
    return Requests.get('refunded-orders', params)
  }
}

export const CommonAgent = {
  getEntities: (params) => {
    return Requests.get('products', params)
  },
  getRestaurantProducts: (params) => {
    return Requests.get('restaurant-products', params)
  },
  getAttachments: (params) => {
    return Requests.get('attachments', params)
  }
}

export const CustomerAgent = {
  registerCustomer: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('user', params)
  },
  getCustomers: (params) => {
    return Requests.get('users', params)
  },
  getCustomerDetails: (params) => {
    return Requests.get('user/' + params)
  },
  updateCustomer: (params) => {
    attachActiveTableStaffHeader()
    return Requests.patch('user/' + params.id, params.body)
  }
}

export const CashAgent = {
  getPendingCashUpDates: (params) => {
    attachActiveTableStaffHeader()
    return Requests.get('cashup-dates', params)
  },
  cashUp: (params) => {
    attachActiveTableStaffHeader()
    return Requests.post('cashup', params)
  },
  getCashups: (params) => {
    attachActiveTableStaffHeader()
    return Requests.get('cashups', params)
  },
  advanceCash: (params => {
    attachActiveTableStaffHeader()
    return Requests.post('advance-cash', params).catch(error => { throw error })
  })
}

export const CashDrawerAgent = {
  
  openCashDrawerAPI: (params => {
    //attachPrinterName(params)
    return anotherRequests.post('cashdrawer/open', null, {
      headers: {
        'PrinterName': params
      }
    })
  })
}

export const ProductAgent = {
  getRestaurantProductModifiers: (params => {
    return Requests.get('restaurant-product-modifiers', params)
  })
}
