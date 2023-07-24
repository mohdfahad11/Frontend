<template>
  <div class="q-mt-xl q-mb-md">
    <div class="row">
      <div class="col col-12 text-center">
        <span class="text-h5">Tyro Settings</span>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col col-3 text-center">
        <q-toggle
          v-model="tyroIntegratedReceiptModel"
          label="Integrated Receipt"
          left-label
        />
      </div>
      <div class="col col-3 text-center">
        <q-toggle
          v-model="tyroIntegratedSurchargeModel"
          label="Integrated Surcharge"
          left-label
        />
      </div>
      <div class="col col-3 text-center">
        <q-input
          v-model="mid"
          type="text"
          label="Merchant Id:"
          placeholder="MID"
          outlined
        />
      </div>

      <div class="col col-3 text-center">
        <q-btn
          no-caps
          push
          color="primary"
          label="iClient Logs"
          @click="showIclientLogs = true"
        />
      </div>
    </div>

    <q-dialog v-model="showIclientLogs" persistent>
      <q-card style="min-width: 70vw; min-height: 70vh">
        <q-card-actions align="right">
          <div class="col col-12 text-right">
            <q-btn
              icon="close"
              color="red"
              class="q-py-sm"
              v-close-popup
              padding=""
            />
          </div>
        </q-card-actions>
        <q-card-section>
          <iframe
            :src="tyroURL"
            title="Tyro iClient logs"
            width="100%"
            height="600"
          ></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showIclientLogs: false,
    };
  },
  computed: {
    ...mapState("settings", [
      "tyroIntegratedReceipt",
      "tyroIntegratedSurcharge",
      "merchantId",
    ]),
    tyroURL() {
      return process.env.TYRO_URL;
    },
    tyroIntegratedReceiptModel: {
      get() {
        return this.tyroIntegratedReceipt;
      },
      set(val) {
        this.$store.commit("settings/SET_TYRO_INTEGRATED_RECEIPT", val);
      },
    },
    tyroIntegratedSurchargeModel: {
      get() {
        return this.tyroIntegratedSurcharge;
      },
      set(val) {
        this.$store.commit("settings/SET_TYRO_INTEGRATED_SURCHARGE", val);
      },
    },
    mid: {
      get() {
        return this.merchantId;
      },
      set(val) {
        this.$store.commit("settings/SET_MERCHANT_ID", val);
      },
    },
  },
  methods: {},
};
</script>
