<template>
  <div>
    <!-- <div class="row">
      <div class="col col-12 text-center text-h6 text-primary">
        Advance Cash
      </div>
    </div> -->
    <div class="row">
      <div class="col col-12 q-pa-sm">
        Date:
        <q-input v-model="today" type="text" readonly disable outlined />
      </div>

      <div class="col col-12 q-pa-sm">
        Floating Amount*:
        <q-input
          v-model="floatingAmount"
          type="text"
          prefix="$"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>

      <div class="col col-12 q-pa-sm">
        Note:
        <q-input v-model="notes" type="textarea" autofocus outlined />
      </div>
    </div>

    <div class="row">
      <div class="col col-12 q-pa-sm">
        <q-btn
          push
          label="Accept"
          @click="advanceCashFunction"
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
  props: ["witnessUserDetails"],
  data() {
    return {
      today: moment(new Date()).format("DD MMMM YYYY"),
      username: null,
      notes: null,
      floatingAmount: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("settings", ["otherPaymentDetails"]),
  },
  created() {
    this.floatingAmount = this.otherPaymentDetails.floatingAmount;
  },
  methods: {
    ...mapActions("cash", ["advanceCash"]),
    advanceCashFunction() {
      this.advanceCash({
        restaurant_id: parseInt(process.env.RESTAURANT_ID),
        advance_amount: parseInt(this.floatingAmount),
        note: this.notes,
      }).then((response) => {
        if (response.status === 200) {
          notifications.successNotify("Advance cash added successfully!");
        }
      });
    },
  },
};
</script>
