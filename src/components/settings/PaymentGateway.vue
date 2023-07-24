<template>
  <div>
    <div class="row">
      <div class="col col-12 text-h5 text-center">
        Payment Information
      </div>
      <div class="col col-3 q-pa-sm" :key="inputKey">
        GST Tax Rate*:
        <q-input
          v-model="otherPaymentDetailsClone.gstTaxRate"
          ref="taxRef"
          type="text"
          outlined
          @change="inputKey++"
          :rules="[val => (val!=null && val!=undefined && val!='') || 'Data is required.',
                    val => val>=0 || 'Invalid Data']"
        />
      </div>
      <div class="col col-3 q-pa-sm" :key="inputRatioKey">
        GST Ratio*:
        <q-input
          v-model="otherPaymentDetailsClone.gstRatio"
          ref="ratioRef"
          type="text"
          outlined
          @change="inputRatioKey++"
          :rules="[val => (val!=null && val!=undefined && val!='') || 'Data is required.',
                    val => val>=0 || 'Invalid Data']"
        />
      </div>
      <div class="col col-3 q-pa-sm" :key="inputFloatKey">
        Floating Amount*:
        <q-input
          v-model="otherPaymentDetailsClone.floatingAmount"
          ref="floatRef"
          type="text"
          outlined
          @change="inputFloatKey++"

          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-3 q-pa-sm">
        Payment Gateway*:
        <q-select
          outlined
          v-model="selectedGateway"
          :options="gatewaySettings"
          :option-label="(item) =>  item.payment_gateways ? item.payment_gateways.gateway : null"
          :option-value="(item) =>  item.payment_gateway_id"
          :rules="[val => !!val || 'Data is required.']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                Configure gateway from 'Payment Gateway' tab!
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div class="row">
      <div class="col col-12 text-center q-pt-md">
        <q-btn push label="Previous" @click="back" class="bg-white text-primary text-bold q-mr-md q-py-sm" v-if="settingsMode=='CONFIG'" />
        <q-btn push label="UPDATE" @click="editInformation" class="bg-white text-primary text-bold q-mr-md q-py-sm" v-if="settingsMode=='EDIT'" />
        <q-btn push label="Save" @click="saveInformation" class="bg-white text-primary text-bold q-py-sm" v-if="settingsMode=='CONFIG'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import notifications from 'src/boot/notifications'
export default {
  data() {
    return {
      inputKey: 0,
      inputRatioKey: 100,
      inputCashupKey: 200,
      inputVarKey: 300,
      inputFloatKey: 400,
      otherPaymentDetailsClone: {},
      merchantIdClone: null,
      gatewayClone: null
    };
  },
  computed: {
    ...mapState('storeUser', ['envVariable']),
    ...mapState("settings", ["gateway", 'paymentGateways', 'otherPaymentDetails', 'showProductOfferPopup', 'merchantId', 'tyroIntegratedReceipt', 'tyroIntegratedSurcharge', 'settingsMode', 'otherPaymentDetails', 'tyroPosProductInfo', 'gatewaySettings']),
    selectedGateway: {
      get() {
        let temp = this.gatewayClone ? this.gatewayClone : null;
        return temp
      },
      set(val) {
        this.gatewayClone = JSON.parse(JSON.stringify(val))
      }
    },
    isInvalidate() {
      return this.$refs.taxRef.hasError || this.$refs.ratioRef.hasError || this.$refs.floatRef.hasError
    }
  },
  methods: {
    ...mapActions('settings', ['getPaymentGateways','savePosConfiguration', 'editPosGeneralSettings','activeInactiveGateway']),
    validateForm() {
      this.$refs.taxRef.hasError
      this.$refs.ratioRef.hasError
      this.$refs.floatRef.hasError
    },
    back() {
      this.$emit('update:tab', 'General')
    },
    saveInformation() {
      this.validateForm()
      if(!this.isInvalidate && this.selectedGateway) {
        this.$store.commit('settings/SET_OTHER_PAYMENT_DETAILS', this.otherPaymentDetailsClone)
        let obj = {
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          product_vendor_name: this.tyroPosProductInfo.vendor,
          product_name: this.tyroPosProductInfo.productName,
          product_version: this.tyroPosProductInfo.version,
          site_reference: this.tyroPosProductInfo.siteReference,
          address_line_1: this.tyroPosProductInfo.addressLine1,
          address_line_2: this.tyroPosProductInfo.addressLine2,
          show_product_offer_popup: this.showProductOfferPopup*1,
          gst_tax_rate: this.otherPaymentDetailsClone.gstTaxRate*1,
          gst_ratio: this.otherPaymentDetailsClone.gstRatio*1,
          expected_floating_amount: parseInt(this.otherPaymentDetailsClone.floatingAmount)
        }
        this.savePosConfiguration(obj)
          .then(() => {
            notifications.successNotify('POS is configured successfully.')
            this.$store.commit('settings/SET_SETTING_MODE', 'EDIT', {root: true})
          })
        this.selectGateway()
      } else {
        notifications.warningNotify('Fill every details!')
      }
    },
    editInformation() {
      for(let item in this.otherPaymentDetailsClone) {
        if(this.otherPaymentDetailsClone[item] == "") {
          this.otherPaymentDetailsClone[item] = null
        }
      }
      if(_.isEqual(this.otherPaymentDetails, this.otherPaymentDetailsClone) && this.gateway && this.gateway.payment_gateway_id == this.selectedGateway.payment_gateway_id ) {
        notifications.warningNotify('You did not change anything.')
      } else {
        this.selectGateway()
        if(!_.isEqual(this.otherPaymentDetails, this.otherPaymentDetailsClone)) {
          let obj = {
            gst_tax_rate: this.otherPaymentDetails.gstTaxRate != this.otherPaymentDetailsClone.gstTaxRate ? this.otherPaymentDetailsClone.gstTaxRate * 1 : null,
            gst_ratio: this.otherPaymentDetails.gstRatio != this.otherPaymentDetailsClone.gstRatio ? this.otherPaymentDetailsClone.gstRatio *1 : null,
            expected_floating_amount: this.otherPaymentDetails.floatingAmount != this.otherPaymentDetailsClone.floatingAmount ? this.otherPaymentDetailsClone.floatingAmount * 1 : null,
          }
          for(let prop in obj) {
            if(obj[prop] == null) {
              delete obj[prop]
            }
          }
          this.editPosGeneralSettings({restaurant_id: this.envVariable.restaurant_settings.restaurant_id, body: obj})
            .then(() => {
              notifications.successNotify('Data is updated successfully!')
              this.$store.commit('settings/SET_OTHER_PAYMENT_DETAILS', this.otherPaymentDetailsClone)
            })
          }
        }
    },
    selectGateway() {
      if(this.gateway && this.selectedGateway.payment_gateway_id == this.gateway.payment_gateway_id) {
        null
      } else {
        let obj = {
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          payment_gateway_id : this.selectedGateway.payment_gateway_id,
          body: {
            status: 1
          }
        }
        this.activeInactiveGateway(obj)
          .then(() => {
            this.$store.commit("settings/SET_PAYMENT_GATEWAY_NAME", this.selectedGateway)
            notifications.successNotify("Payment gateway is updated successfully!")
          })
      }
    }
  },
  created() {
    this.paymentGateways
      ? this.getPaymentGateways()
      : null
    this.otherPaymentDetailsClone = JSON.parse(JSON.stringify(this.otherPaymentDetails))
    this.gatewayClone = JSON.parse(JSON.stringify(this.gateway))
  }
}
</script>
