let settingLocal = JSON.parse(localStorage.getItem('SettingLocalStorage'))
let areasLocal = JSON.parse(localStorage.getItem('NumberOfAreas'))
let tableCountLocal = JSON.parse(localStorage.getItem('TableCountLocalStorage'))
let tablePrefixLocal = JSON.parse(localStorage.getItem('TablePrefixLocalStorage'))
// let restaurantTableListLocal = JSON.parse(localStorage.getItem('RestaurantTableListLocalStorage'))
let themeLocal = JSON.parse(localStorage.getItem('ThemeLocalStorage'))
let tyroTerminalId = JSON.parse(localStorage.getItem('TyroTerminalIdLocalStorage'))
let printerLocal = JSON.parse(localStorage.getItem('PrinterLocalStorage'))
let printerCoffeeLocal = JSON.parse(localStorage.getItem('PrinterCoffeeLocalStorage'))
let intervalLocal = JSON.parse(localStorage.getItem('IntervalLocalStorage'))
let gatewaySettingsLocal = JSON.parse(localStorage.getItem('GatewaySettingsLocalStorage'))
let gatewayFromLocalStorage = JSON.parse(localStorage.getItem('GatewayLocalStorage'))
let gatewayLocal = gatewaySettingsLocal && gatewaySettingsLocal.length !== 0
  ? gatewaySettingsLocal.map((v) => {
    if (v.status == 1) {
      return v
    }
  }).filter(Boolean)
  : null
let tyro = gatewaySettingsLocal && gatewaySettingsLocal.length !== 0
  ? gatewaySettingsLocal.map((v) => {
    if (v.payment_gateway_id == 1) {
      return v
    }
  }).filter(Boolean)
  : null
export default function () {
  return {
    restaurantMode: 'TAKEAWAY',
    posSettings: settingLocal ? settingLocal : null,
    paymentGateways: [],
    gatewaySettings: gatewaySettingsLocal ? gatewaySettingsLocal : [],
    gateway: gatewayFromLocalStorage ? gatewayFromLocalStorage : (gatewayLocal && gatewayLocal[0] ? gatewayLocal[0] : null),
    tyroIntegratedReceipt: tyro && tyro[0] ? !!tyro[0].has_integrated_receipt : true,
    tyroIntegratedSurcharge: tyro && tyro[0] ? !!tyro[0].has_integrated_surcharge : true,
    merchantId: tyro && tyro[0] ? tyro[0].merchant_id : null,
    terminalId: tyroTerminalId ? tyroTerminalId : null,
    tyroPosProductInfo: {
      vendor: process.env.PRODUCT_VENDOR_NAME,
      productName: process.env.PRODUCT_NAME,
      version: process.env.PRODUCT_VERSION_NUMBER,
      siteReference: process.env.SITE_REFERENCE,
      addressLine1: settingLocal ? settingLocal.address_line_1 : null,
      addressLine2: settingLocal ? settingLocal.address_line_2 : null
    },
    otherPaymentDetails: {
      gstTaxRate: settingLocal ? settingLocal.gst_tax_rate : null,
      gstRatio: settingLocal ? settingLocal.gst_ratio : null,
      floatingAmount: settingLocal ? settingLocal.expected_floating_amount : null
    },
    showProductOfferPopup: settingLocal ? !!settingLocal.show_product_offer_popup : true,
    defaultPrinter: printerLocal ? printerLocal : {},
    defaultCoffeePrinter: printerCoffeeLocal ? printerCoffeeLocal : {},
    intervalTime: intervalLocal ? intervalLocal : {
      id: 2,
      label: '30 Mins',
      value: 30
    },
    selectedTheme: themeLocal ? themeLocal : {},
    settingsMode: settingLocal ? 'EDIT' : 'CONFIG',
    tableCount: tableCountLocal ? tableCountLocal : 0,
    restaurantTableList: [],
    cashDrawerAPIPort: 8080
  }
}
