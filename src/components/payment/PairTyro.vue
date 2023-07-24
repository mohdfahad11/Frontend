<template>
  <div class="q-pt-none">
    <div class="row q-pa-none" v-if="showTyroTerminalInstructions">
      <div class="col col-12 text-h5 text-center">
        On the TYRO Terminal
      </div>
      <div class="col col-12">
        <ul>
          <li>Press the 'Menu' Button.</li>
          <li>Select 'Configuration'.</li>
          <li>Select 'Integrated EFTPOS'.</li>
          <li>Select 'Pair with POS'.</li>
          <li>Press 'Start'.</li>
        </ul>
      </div>
      <div class="col col-12 text-red text-italic">
        Note: Please refer terminal guide for updated version.
      </div>
      <div class="col col-12 text-right">
        <q-btn push label="Next" @click="showForm = true; showTyroTerminalInstructions = false" class="bg-white text-primary text-bold q-py-sm" />
      </div>
    </div>

    <div class="row items-center" v-if="showForm">
      <div class="col col-6 q-pa-sm">
        Terminal Id:
        <q-input v-model="tid" type="text" outlined class="q-mb-sm" />
      </div>
      <div class="col col-6 q-pa-sm q-mt-sm text-center" >
        <q-btn push label="Pair To Device" @click="doPairing" class="bg-white text-primary text-bold q-py-sm" />
      </div>
    </div>

    <q-dialog v-model="pairingStatus" persistent>
      <q-card>
        <q-card-actions align="right">
          <div class="col col-12 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>
        <q-card-section>
          <div class="row">
            <div class="col col-2">
                <q-icon :name="msgIcon" :color="iconColor" size="lg" />
              </div>
            <div class="col col-10">
              <span class="text-h6 q-mr-sm">{{tyroPairingMsg}}</span>
              <q-spinner-dots
                color="white"
                size="2em"
                v-if="tyroPairingStatus=='inProgress'"
              />
            </div>
            </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      tyroPairingMsg: ' ',
      tyroPairingStatus: '',
      pairingStatus: false,
      showTyroTerminalInstructions: true,
      showForm: false,
      msgIcon: 'access_time_filled',
      iconColor: 'yellow',
      apiKey : process.env.API_KEY
    }
  },
  methods: {
    responseReceivedCallbackImp(response) {
      let resultShown = false
      let successResult = false
      this.tyroPairingMsg = response.message
      this.tyroPairingStatus = response.status
      console.log(this.tyroPairingStatus)
      if(this.tyroPairingStatus == 'inProgress') {
        this.msgIcon= 'access_time_filled'
        this.iconColor= 'yellow'
      } else if(this.tyroPairingStatus == 'success') {
        this.msgIcon = 'check_circle'
        this.iconColor = 'green'
        resultShown = true
        successResult = true
      } else {
        this.msgIcon = 'error'
        this.iconColor = 'red'
        resultShown = true
      }
      // resultShown? setTimeout(()=> {
      //   this.pairingStatus = false
      // },3500) : null
      resultShown && successResult? setTimeout(()=> {
        this.pairingStatus = false
        this.$router.push({ name: 'home' })
      },4500) : null
      // this.$store.commit('settings/SET_TYRO_INTEGRATION_KEY', response.integrationKey)
    },
    doPairing() {
      console.log(process.env.API_KEY)
      let iclient = new TYRO.IClientWithUI(this.apiKey, this.posProductInfo);
      this.pairingStatus = true
      console.log(this.merchantId, this.tid, this.responseReceivedCallbackImp)
      iclient.pairTerminal(this.merchantId, this.tid, this.responseReceivedCallbackImp)
    }
  },
  computed: {
    ...mapState('settings',['merchantId','terminalId', 'tyroPosProductInfo']),
    posProductInfo() {
      return {
        posProductVendor: this.tyroPosProductInfo.vendor ? this.tyroPosProductInfo.vendor : process.env.PRODUCT_VENDOR_NAME ,
        posProductName: this.tyroPosProductInfo.productName ? this.tyroPosProductInfo.productName: process.env.PRODUCT_NAME ,
        posProductVersion: this.tyroPosProductInfo.version ? this.tyroPosProductInfo.version : process.env.PRODUCT_VERSION_NUMBER ,
        siteReference: this.tyroPosProductInfo.siteReference ? this.tyroPosProductInfo.siteReference : process.env.SITE_REFERNCE ,
      };
    },
    tid: {
      get() {
        return this.terminalId
      },
      set(val) {
        this.$store.commit('settings/SET_TERMINAL_ID', val)
      }
    }
  }
}
</script>
