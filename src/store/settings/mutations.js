export function SET_PAYMENT_GATEWAY_NAME(state, res) {
  state.gateway = JSON.parse(JSON.stringify(res));
  localStorage.setItem('GatewayLocalStorage', JSON.stringify(state.gateway))
}

export function SET_TYRO_INTEGRATED_RECEIPT(state, val) {
  let gatewaySettingsLocal = JSON.parse(localStorage.getItem('GatewaySettingsLocalStorage'))
  state.tyroIntegratedReceipt = val

  if (gatewaySettingsLocal && gatewaySettingsLocal.length !== 0) {
    for (let i in gatewaySettingsLocal) {
      if (gatewaySettingsLocal[i].payment_gateway_id == 1) {
        gatewaySettingsLocal[i].has_integrated_receipt = state.tyroIntegratedReceipt
        localStorage.setItem('GatewaySettingsLocalStorage', JSON.stringify(gatewaySettingsLocal))
        break
      }
    }
  }
}

export function SET_TYRO_INTEGRATED_SURCHARGE(state, val) {
  let gatewaySettingsLocal = JSON.parse(localStorage.getItem('GatewaySettingsLocalStorage'))
  state.tyroIntegratedSurcharge = val
  if (gatewaySettingsLocal && gatewaySettingsLocal.length !== 0) {
    for (let i in gatewaySettingsLocal) {
      if (gatewaySettingsLocal[i].payment_gateway_id == 1) {
        gatewaySettingsLocal[i].has_integrated_surcharge = state.tyroIntegratedSurcharge
        localStorage.setItem('GatewaySettingsLocalStorage', JSON.stringify(gatewaySettingsLocal))
        break
      }
    }
  }
}

export function SET_MERCHANT_ID(state, val) {
  let gatewaySettingsLocal = JSON.parse(localStorage.getItem('GatewaySettingsLocalStorage'))
  state.merchantId = val
  if (gatewaySettingsLocal && gatewaySettingsLocal.length !== 0) {
    for (let i in gatewaySettingsLocal) {
      if (gatewaySettingsLocal[i].payment_gateway_id == 1) {
        gatewaySettingsLocal[i].merchant_id = state.merchantId
        localStorage.setItem('GatewaySettingsLocalStorage', JSON.stringify(gatewaySettingsLocal))
        break
      }
    }
  }

}

export function SET_TERMINAL_ID(state, val) {
  state.terminalId = val
  localStorage.setItem('TyroTerminalIdLocalStorage', JSON.stringify(state.terminalId))

}

export function SET_POS_PRODUCT_INFO(state, data) {
  let temp = JSON.parse(localStorage.getItem('SettingLocalStorage'))
  state.tyroPosProductInfo = JSON.parse(JSON.stringify(data));
  if (temp) {
    temp.product_vendor_name = state.tyroPosProductInfo.vendor
    temp.product_name = state.tyroPosProductInfo.productName
    temp.product_version = state.tyroPosProductInfo.version
    temp.site_reference = state.tyroPosProductInfo.siteReference
    temp.address_line_1 = state.tyroPosProductInfo.addressLine1
    temp.address_line_2 = state.tyroPosProductInfo.addressLine2
    localStorage.setItem('SettingLocalStorage', JSON.stringify(temp))
  }
}


export function SET_OTHER_PAYMENT_DETAILS(state, data) {
  let temp = JSON.parse(localStorage.getItem('SettingLocalStorage'))
  state.otherPaymentDetails = JSON.parse(JSON.stringify(data))
  if (temp) {
    temp.gst_tax_rate = state.otherPaymentDetails.gstTaxRate
    temp.gst_ratio = state.otherPaymentDetails.gstRatio
    temp.expected_floating_amount = state.otherPaymentDetails.floatingAmount
    localStorage.setItem('SettingLocalStorage', JSON.stringify(temp))
  }
}

export function SET_SHOW_PRODUCT_OFFER_POPUP(state, val) {
  let temp = JSON.parse(localStorage.getItem('SettingLocalStorage'))
  state.showProductOfferPopup = val
  if (temp) {
    temp.show_product_offer_popup = state.showProductOfferPopup

    localStorage.setItem('SettingLocalStorage', JSON.stringify(temp))
  }
}


export function SET_DEFAULT_PRINTER(state, res) {
  state.defaultPrinter = JSON.parse(JSON.stringify(res));
  localStorage.setItem('PrinterLocalStorage', JSON.stringify(state.defaultPrinter))
}

export function SET_DEFAULT_COFFEE_PRINTER(state, res) {
  state.defaultCoffeePrinter = JSON.parse(JSON.stringify(res));
  localStorage.setItem('PrinterCoffeeLocalStorage', JSON.stringify(state.defaultCoffeePrinter))
}

export function SET_RESTAURANT_MODE(state, res) {
  state.restaurantMode = res
}
export function SET_INTERVAL_TIME(state, res) {
  state.intervalTime = JSON.parse(JSON.stringify(res));
  localStorage.setItem('IntervalLocalStorage', JSON.stringify(state.intervalTime))
}

export function SET_THEME_COLOR(state, res) {
  state.selectedTheme = JSON.parse(JSON.stringify(res))
  localStorage.setItem('ThemeLocalStorage', JSON.stringify(state.selectedTheme))
}

export function GET_PAYMENT_GATEWAYS(state, res) {
  state.paymentGateways = [...res]
}

export function INIT_SETTINGS(state, res) {
  if (res.length !== 0) {
    state.posSettings = JSON.parse(JSON.stringify(res[0]))
    localStorage.setItem('SettingLocalStorage', JSON.stringify(state.posSettings))
    state.tyroPosProductInfo.vendor = process.env.PRODUCT_VENDOR_NAME,
      state.tyroPosProductInfo.productName = process.env.PRODUCT_NAME,
      state.tyroPosProductInfo.version = process.env.PRODUCT_VERSION_NUMBER,
      state.tyroPosProductInfo.siteReference = process.env.SITE_REFERENCE,
      state.tyroPosProductInfo.addressLine1 = state.posSettings.address_line_1,
      state.tyroPosProductInfo.addressLine2 = state.posSettings.address_line_2,
      state.otherPaymentDetails.gstTaxRate = state.posSettings.gst_tax_rate,
      state.otherPaymentDetails.gstRatio = state.posSettings.gst_ratio,
      state.otherPaymentDetails.floatingAmount = state.posSettings.expected_floating_amount
    state.showProductOfferPopup = !!state.posSettings.show_product_offer_popup
    state.settingsMode = 'EDIT'
  }
}

export function SET_SETTING_MODE(state, val) {
  state.settingsMode = val
}

// export function UPDATE_RESTAURANT_TABLE (state, res) {
//   console.log(res)
//   Object.assign(
//     state.restaurantTableList.find((obj) => obj.id === res.table_id),
//     res
//   )
// }

export function SET_TABLE_COUNT(state, val) {
  state.tableCount = val
  localStorage.setItem('TableCountLocalStorage', JSON.stringify(state.tableCount))
}

export function SET_RESTAURANT_TABLE_LIST(state, res) {
  state.restaurantTableList = [...res]
}

export function INIT_GATEWAY_SETTINGS(state, res) {
  state.gatewaySettings = [...res]
  localStorage.setItem('GatewaySettingsLocalStorage', JSON.stringify(state.gatewaySettings))
  for (let i in state.gatewaySettings) {
    if (state.gatewaySettings[i].payment_gateway_id == 1) {
      let terminalIdLocal = JSON.parse(localStorage.getItem('TyroTerminalIdLocalStorage'))
      state.tyroIntegratedReceipt = !!state.gatewaySettings[i].has_integrated_receipt,
        state.tyroIntegratedSurcharge = !!state.gatewaySettings[i].has_integrated_surcharge,
        state.merchantId = state.gatewaySettings[i].merchant_id
      state.terminalId = terminalIdLocal ? terminalIdLocal : null
    }
    if (state.gatewaySettings[i].status == 1) {
      state.gateway = Object.assign({}, state.gatewaySettings[i])
      localStorage.setItem('GatewayLocalStorage', JSON.stringify(state.gateway))
    }
  }
}

export function SET_CASHDRAWER_API_PORT(state, apiPort) {
  state.cashDrawerAPIPort = apiPort
  localStorage.setItem('CashdrawerAPIPortLocalStorage', JSON.stringify(apiPort))
}
