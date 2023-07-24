<template>
  <div>
    <div class="row">
      <div class="col col-12 text-h5 text-center">
        Payment Gateway Configuration
      </div>
      <div class="col col-3 q-pa-sm">
        Payment Gateway*:
        <q-select
          outlined
          v-model="selectedGateway"
          :options="paymentGateways"
          :option-label="(item) =>  item.gateway"
          :option-value="(item) =>  item.id"
          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
    </div>

    <div class="row" v-if="selectedGateway && selectedGateway.id === 1">
      <div class="col col-12">
        <TyroSettings />
      </div>
    </div>

    <div class="row">
      <div class="col col-12 text-center q-pt-md">
        <q-btn push label="Save" @click="saveInformation" class="bg-white text-primary text-bold q-py-sm q-ms-am" />
        <q-btn push label="Next" @click="nextTab" class="bg-white text-primary text-bold q-py-sm q-ma-sm" v-if="settingsMode=='CONFIG'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TyroSettings from './TyroSettings.vue'
import _ from 'lodash'
import notifications from 'src/boot/notifications'
export default {
  data() {
    return {
      merchantIdClone: null,
      gatewayClone: null,
      tyroIntegratedReceiptClone: null,
      tyroIntegratedSurchargeClone: null,
      selectedGateway: null
    };
  },
  computed: {
    ...mapState('storeUser', ['envVariable']),
    ...mapState("settings", ["gateway", 'paymentGateways', 'merchantId', 'tyroIntegratedReceipt', 'tyroIntegratedSurcharge', 'settingsMode', 'gatewaySettings']),
  },
  methods: {
    ...mapActions('settings', ['getPaymentGateways','saveGatewayConfiguration', 'editPaymentGateway']),
    nextTab() {
      this.$emit('update:tab', 'General')
    },
    saveInformation() {
      if(this.selectedGateway) {
        if(!this.gatewaySettings || this.gatewaySettings.length == 0) {
          this.setupGateway()
        } else if(this.gatewaySettings.length == 1 && this.selectedGateway.id !== this.gatewaySettings[0].id) {
          this.setupGateway()
        } else {
          this.editInformation()
        }
      } else {
        notifications.warningNotify('Select Gateway!')
      }
    },
    editInformation() {
      if ( this.selectedGateway.id == 1){
        if(this.merchantIdClone == this.merchantId && this.tyroIntegratedReceiptClone == this.tyroIntegratedReceipt && this.tyroIntegratedSurchargeClone == this.tyroIntegratedSurcharge) {
          notifications.warningNotify('You did not change anything.')
        } else {
          let idToEdit
          for( let i in this.gatewaySettings) {
            if(this.gatewaySettings[i].payment_gateway_id == this.selectedGateway.id) {
              idToEdit = this.gatewaySettings[i].id
            }
          }
          let body = {}

          if(this.selectedGateway.id == 1){
            if(this.merchantIdClone != this.merchantId) {
              body.merchant_id = this.merchantId
            }
            if(this.tyroIntegratedReceiptClone != this.tyroIntegratedReceipt) {
              body.has_integrated_receipt = this.tyroIntegratedReceipt*1
            }
            if(this.tyroIntegratedSurchargeClone != this.tyroIntegratedSurcharge) {
              body.has_integrated_surcharge = this.tyroIntegratedSurcharge*1
            }
          }
          let obj = {
            gateway_id : idToEdit,
            restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
            body: {...body}
          }
          this.editPaymentGateway(obj)
            .then(() => {
              notifications.successNotify('Payment gateway updated successfuly!')
              this.merchantIdClone = this.merchantId
              this.tyroIntegratedReceiptClone = this.tyroIntegratedReceipt
              this.tyroIntegratedSurchargeClone = this.tyroIntegratedSurcharge
            })
        }
      } else {
        notifications.successNotify('Payment gateway updated successfuly!')
      }
    },
    setupGateway() {
      let localGatewayConfig = {}
      if(this.selectedGateway.id == 1){
        if(!this.merchantId) {
          notifications.warningNotify('Please specify merchant id for Tyro!')
        } else {
          localGatewayConfig = {
            restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
            payment_gateway_id: 1,
            merchant_id: this.merchantId,
            has_integrated_surcharge: this.tyroIntegratedSurcharge*1,
            has_integrated_receipt: this.tyroIntegratedReceipt*1,
            status: 0
          }
        }
      } else {
        localGatewayConfig = {
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          payment_gateway_id: 2,
          status: 0
        }
      }
      this.saveGatewayConfiguration(localGatewayConfig)
        .then(() => {
          notifications.successNotify('Saved Gateway Configuration Successfully!')
        })
        .catch (() => {
          this.$store.commit('settings/SET_MERCHANT_ID', this.merchantIdClone)
          this.$store.commit("settings/SET_TYRO_INTEGRATED_RECEIPT", this.tyroIntegratedReceiptClone);
          this.$store.commit("settings/SET_TYRO_INTEGRATED_SURCHARGE", this.tyroIntegratedSurchargeClone);
        })
    }
  },
  created() {
    this.paymentGateways
      ? this.getPaymentGateways()
      : null
    this.otherPaymentDetailsClone = Object.assign({},this.otherPaymentDetails)
    this.merchantIdClone = this.merchantId
    this.tyroIntegratedReceiptClone = this.tyroIntegratedReceipt
    this.tyroIntegratedSurchargeClone = this.tyroIntegratedSurcharge
    if(this.gateway) {
      for(let i in this.paymentGateways) {
        if(this.gateway.payment_gateway_id == this.paymentGateways[i].id) {
          this.selectedGateway = this.paymentGateways[i]
        }
      }
    }
  },
    components: { TyroSettings }
}
</script>
