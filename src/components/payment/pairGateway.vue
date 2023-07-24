<template>
  <div>
    <!-- if tyro -->
    <div v-if="gateway && gateway.payment_gateway_id==1">
      <PairTyro />
    </div>

    <!-- if smartpay -->
    <div v-else-if="gateway && gateway.payment_gateway_id==2">
      <SmartConnectSetting />
    </div>

    <div v-else>
      <span class="text-h6">First set default payment gateway from 'General' tab!</span>
    </div>

  </div>
</template>

<script>
import PairTyro from './PairTyro.vue';
import SmartConnectSetting from '../settings/SmartConnectSettings.vue';
import { mapState } from 'vuex';
  export default {
    components: { PairTyro, SmartConnectSetting },
    computed: {
      ...mapState('settings', ['gateway'])
    }
}
</script>
