import { Loading, QSpinnerPie } from "quasar";

function displayLoader () {
  process.env.CLIENT?
  Loading.show({
    spinner: QSpinnerPie,
    spinnerSize: 100,
    spinnerColor: 'primary'
  }): null
}


export default {displayLoader}
