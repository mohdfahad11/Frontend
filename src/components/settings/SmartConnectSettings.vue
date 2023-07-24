<template>
  <div class="">
    <section id="pairing q-mt-none">
      <!-- <div class="row">
        <div class="col col-12 text-center">
          <span class="text-h5">SmartPay Settings</span>
        </div>
      </div> -->
      <div class="row q-pa-none" v-if="showTerminalInstructions">
        <div class="col col-12 text-h5 text-center">
          On the SmartPay Terminal
        </div>
        <div class="col col-12">
          <ul>
            <li>Press the 'Menu' Button.</li>
            <li>Select 'CONFIG'.</li>
            <li>Enter authentication code and press 'Enter'.</li>
            <li>Select 'POS Integrations'.</li>
            <li>Select 'Authorise POS'.</li>
            <li>You will get a new 'Pairing code'. Enter that in the form on next screen.</li>
          </ul>
        </div>
        <div class="col col-12 text-red text-italic">
          Note: Please refer terminal guide for updated version.
        </div>
        <div class="col col-12 text-right">
          <q-btn push label="Next" @click="showForm = true; showTerminalInstructions = false" class="bg-white text-primary text-bold q-py-sm" />
        </div>
      </div>

      <div class="row items-center" v-if="showForm">
        <div class="col col-6 q-pa-sm">
          Pairing Code:
          <q-input v-model="pairingCode" type="text" outlined class="q-mb-sm" />
        </div>
        <div class="col col-6 q-pa-sm q-mt-sm text-center" >
          <q-btn push label="Pair To Device" @click="doPairing" class="bg-white text-primary text-bold q-py-sm" />
        </div>
      </div>
    </section>
    <q-dialog v-model="smartConnectDialog" persistent>
      <q-card style="min-width:max-content">
        <q-card-actions align="right">
          <div class="col col-12 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>

        <q-card-section>
          <div class="row">
            <div class="col col-2 text-center">
              <q-icon :name="msgIcon" :color="iconColor" size="lg" />
            </div>
            <div class="col col-10">
              <span class="text-h6">{{pairingMsg}}</span>
                <q-spinner-dots
                color="white"
                size="2em"
                v-if="showLoading"
                class="q-pl-xs"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import { sendParingRequest  } from 'src/boot/smartconnect';
export default {
  data() {
    return {
      pairingCode: null,
      smartConnectDialog: false,
      pairingMsg: 'Pairing with the terminal',
      showLoading: true,
      msgIcon: 'access_time_filled',
      iconColor: 'yellow',
      showTerminalInstructions: true,
      showForm: false
    }
  },
  methods: {
    doPairing() {
      let pairingCode = this.pairingCode;
      this.smartConnectDialog = true
      this.showLoading = true

      sendParingRequest(pairingCode)
        .then(() => {
          this.pairingMsg = "Pairing complete! Your device should now show it is paired.";
          this.msgIcon = 'check_circle'
          this.iconColor = 'green'
          setTimeout(()=> {
            this.$router.push({ name: 'home' })
          },3000)
        })
        .catch(errorMessage => {
          this.pairingMsg = "Error! Message: " + errorMessage;
          this.msgIcon = 'error'
          this.iconColor = 'red'
        })
        .finally(()=> {
          this.showLoading = false
          setTimeout(()=> {
            this.smartConnectDialog = false
          },2500)
        })
    },
  }
}
</script>
