<template>
  <div class="q-pt-sm">
    <div class="row">
      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="shopping_basket"
          label="Takeaway"
          @click="setRestaurantMode('TAKEAWAY')"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>
      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="mdi-table-chair"
          label="Dine Inn"
          @click="dineInnFunction"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>

      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="print"
          label="Item Receipt & Refund"
          @click="itemReceiptSearchFunction"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>
      <div class="col col-3 q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="settings"
          label="General"
          padding="15px"
          class="full-width text-capitalize full-height"
          @click="showMenu = true"
        >
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="showTables" persistent>
      <q-card style="min-width: 700px">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-pa-sm rounded-borders"> Table List </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn
              icon="close"
              color="red"
              class="q-py-sm"
              v-close-popup
              padding=""
            />
          </div>
        </q-card-actions>
        <q-card-section class="">
          <available-tables />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="itemReceiptSearch" persistent>
      <q-card style="min-width: 550px !important">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Receipt Search & Refund</span>
          </div>
          <div class="col col-2 text-right">
            <q-btn
              icon="close"
              color="red"
              class="q-py-sm"
              v-close-popup
              padding=""
            />
          </div>
        </q-card-actions>
        <q-card-section class="" align="center">
          <ReceiptSearch :itemReceiptSearch.sync="itemReceiptSearch" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders" v-if="form == 'cashup'"> Cash Up </span>
            <span class="q-px-sm rounded-borders" v-if="form == 'advance-cashup'"> Advance Cash </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn
              icon="close"
              color="red"
              class="q-py-sm"
              v-close-popup
              padding=""
            />
          </div>
        </q-card-actions>
        <!-- <q-card-actions align="right" class="q-pb-none">
          <q-btn flat icon="close" color="red" class="q-py-sm" v-close-popup />
        </q-card-actions> -->
        <q-card-section v-if="form == 'cashup'" class="q-pt-none">
          <Cashup />
        </q-card-section>
        <q-card-section v-if="form == 'advance-cashup'" class="q-pt-none">
          <AvanceCashup />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showMenu" persistent>
      <q-card class="q-pb-md" style="min-width: 750px !important">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> General Settings </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn
              icon="close"
              color="red"
              class="q-py-sm"
              v-close-popup
              padding=""
            />
          </div>
        </q-card-actions>
        <q-card-actions class="q-pt-lg">
          <div class="col col-3 q-px-sm">
            <q-btn
              stack
              color="primary"
              icon="settings"
              label="setting"
              to="/setting"
              padding="15px"
              class="full-width text-capitalize full-height"
              @click="showMenu = true"
            />
          </div>
          <div class="col col-3 q-px-sm">
            <q-btn
              stack
              color="primary"
              icon="money"
              label="Cash Up"
              padding="15px"
              class="full-width text-capitalize full-height"
              @click="openDialog('cashup')"
            />
          </div>
          <div class="col col-3 q-px-sm">
            <q-btn
              stack
              color="primary"
              icon="payments"
              label="Advance Cash"
              padding="15px"
              class="full-width text-capitalize full-height"
              @click="openDialog('advance-cashup')"
            />
          </div>

          <div class="col col-3 q-px-sm">
            <q-btn
              stack
              color="primary"
              icon="payments"
              label="Open Cashdrawer"
              padding="15px"
              class="full-width text-capitalize full-height"
              @click="openCashDrawer()"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cashup from "../payment/cashUp.vue";
import AvanceCashup from "../payment/advanceCash.vue";
import notifications from "src/boot/notifications";
import AvailableTables from "./AvailableTables.vue";
import ReceiptSearch from "../orders/ReceiptSearch.vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showTables: false,
      itemReceiptSearch: false,
      showMenu: false,
      showDialog: false,
      form: "",
    };
  },
  computed: {
    ...mapState("settings", ["restaurantMode", "defaultPrinter"]),
    ...mapState("storeUser", ["loggedInStoreUsers"]),
    ...mapState("orders", ["containsService", "orderList"]),
  },
  methods: {
    ...mapActions("cashdrawer", ["openCashDrawerAPI"]),
    openDialog(val) {
      if (val === "cashup") {
        this.form = "cashup";
      } else {
        this.form = "advance-cashup";
      }
      this.showDialog = true;
      this.showMenu = false;
    },
    setRestaurantMode(val) {
      this.$store.commit("settings/SET_RESTAURANT_MODE", val);
    },
    dineInnFunction() {
      this.setRestaurantMode("DINEINN");
      this.showTables = true;
    },
    itemReceiptSearchFunction() {
      if (Object.keys(this.loggedInStoreUsers).length == 0) {
        notifications.warningNotify("Please sign in to Continue with the app!");
      } else {
        this.$store.commit("orders/GET_ORDERS", []);
        this.itemReceiptSearch = true;
      }
    },
    openCashDrawer() {
      this.openCashDrawerAPI(this.defaultPrinter.name)
        .then(() => {
          console.log("successful");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  components: { AvailableTables, ReceiptSearch, Cashup, AvanceCashup },
};
</script>
