let storeTokenLocal = JSON.parse(localStorage.getItem('StoreToken'))
export default function () {
  return {
    entities: [],
    storeToken: storeTokenLocal? storeTokenLocal: null,
    attachments: []
  }
}
