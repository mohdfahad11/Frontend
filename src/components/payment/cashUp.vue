<template>
  <div>
    <div class="row">
      <div class="col col-6 q-pa-sm">
        Date*:
        <q-select
          v-model="selectedDate"
          :options="sortedPendingCashupDates"
          outlined
          :rules="[(val) => !!val || 'Date is required.']"
        />
      </div>

      <div class="col col-6 q-pa-sm">
        Float Amount*:
        <q-input
          v-model="floatingAmount"
          type="text"
          prefix="$"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>

      <div class="col col-6 q-pa-sm">
        Cash/Till Amount*:
        <q-input
          v-model="cashOrTillAmount"
          type="text"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>

      <div class="col col-6 q-pa-sm">
        Bank/Safe Drop*:
        <q-input
          v-model="bankOrSafeDrop"
          type="text"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>

      <div class="col col-12 q-pa-sm">
        Note:
        <q-input v-model="notes" type="textarea" outlined />
      </div>
    </div>

    <div class="row">
      <div class="col col-12 q-pa-sm">
        <q-btn
          push
          label="Accept"
          @click="cashUpFunction"
          v-close-popup
          class="full-width bg-white text-primary text-bold q-py-sm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
import notifications from "src/boot/notifications";

export default {
  data() {
    return {
      today: moment(new Date()).format("DD MMMM YYYY"),
      notes: null,
      cashOrTillAmount: null,
      bankOrSafeDrop: null,
      selectedDate: null,
      floatingAmount: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("cash", ["pendingCashUpDates"]),
    ...mapState("settings", ["otherPaymentDetails"]),
    sortedPendingCashupDates() {
      let arr = [...this.pendingCashUpDates];
      return arr.sort(this.dateComparison).reverse();
    },
  },
  created() {
    this.floatingAmount = this.otherPaymentDetails.floatingAmount;

    this.getPendingCashUpDates({
      restaurant_id: 1,
      cashup_date_from: moment().subtract(10, "days").format("YYYY-MM-DD"),
      cashup_date_to: moment().format("YYYY-MM-DD"),
    });
  },
  methods: {
    ...mapActions("cash", ["getPendingCashUpDates", "cashUp"]),
    cashUpFunction() {
      this.cashUp({
        restaurant_id: parseInt(process.env.RESTAURANT_ID),
        cashup_date: this.selectedDate,
        float_amount: this.floatingAmount,
        till_amount: this.cashOrTillAmount,
        safedrop_amount: this.bankOrSafeDrop,
        note: this.notes,
      }).then((response) => {
        if (response.status === 200) {
          notifications.successNotify("Cashup added successfully!");
        }
      });
    },
  },
};
</script>
