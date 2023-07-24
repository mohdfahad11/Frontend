export function GET_ENTITIES (state, data) {
  state.entities = [...data]
}

export function GET_STORE_TOKEN (state, data) {
  state.storeToken = data.access_token
  localStorage.setItem('StoreToken', JSON.stringify(state.storeToken))
}

export function GET_ATTACHMENTS (state, data) {
  state.attachments = [...data.data]
}
