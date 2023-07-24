<template>
  <div>
    <div class="row">
      <div class="col col-12">
        <q-tabs
          v-model="tab"
          align="justify"
          class="bg-white text-primary nested-tab-panels"
          active-color="primary"
          active-bg-color="grey-3"
          indicator-color="grey-3"
        >
          <q-tab name="Payment Gateway" icon="settings" label="Payment Gateway" />
          <q-tab :disable="settingsMode!='EDIT'" name="General" icon="settings" label="General" />
          <q-tab :disable="settingsMode!='EDIT'" name="Payment" icon="money" label="Payment" />
        </q-tabs>

        <q-separator />


        <q-tab-panels
          v-model="tab"
          class="q-mt-sm"
          animated
        >
          <q-tab-panel name="Payment Gateway">
            <GatewayConfiguration :tab.sync="tab" />
          </q-tab-panel>
          <q-tab-panel name="General">
            <GeneralSettings :tab.sync="tab" />
          </q-tab-panel>

          <q-tab-panel name="Payment">
            <PaymentGateway :tab.sync="tab" />
          </q-tab-panel>

        </q-tab-panels>
      </div>
    </div>

  </div>
</template>

<script>
import PaymentGateway from 'src/components/settings/PaymentGateway.vue'
import GeneralSettings from 'src/components/settings/GeneralSettings.vue';
import { mapState } from 'vuex';
import GatewayConfiguration from './PaymentGatewayConfiguration.vue';
export default {
  data() {
    return {
      tab: "Payment Gateway"
    };
  },
  components: { PaymentGateway, GeneralSettings, GatewayConfiguration },
  methods: {
    goToPayment(data) {
      this.tab = data.tabName
    }
  },
  computed: {
    ...mapState('settings',['settingsMode'])
  }
}
</script>

<style lang="scss" scoped>
  .nested-tab-panels {
    .disabled, [disabled] {
      opacity: 1 !important;
    }
  }
</style>
