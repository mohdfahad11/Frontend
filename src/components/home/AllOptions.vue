<template>
  <div class="q-pt-sm">
    <div class="row">
      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="mdi-account-supervisor-outline"
          label="Staff"
          padding="15px"
          @click="showStaff = true"
          class="full-width text-capitalize full-height"
        />
      </div>
      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="close"
          label="Write Off"
          @click="authBasedTasks('authActiveUser', 'writeOff')"
          :disable="!orderList[tableId]"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>
      <div class="col col-3 q-pr-xs q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="money"
          label="Cashup"
          @click="authBasedTasks('witnessUser', 'cashUp')"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>

      <div class="col col-3 q-pb-xs">
        <q-btn
          stack
          color="primary"
          icon="payments"
          label="Advance Cash"
          @click="authBasedTasks('witnessUser', 'advanceCash')"
          padding="15px"
          class="full-width text-capitalize full-height"
        />
      </div>
    </div>

    <q-dialog v-model="showStaff" persistent>
      <q-card style="min-width: 700px">
        <q-card-actions align="right">
          <q-btn icon="close" color="red" class="q-pa-none" v-close-popup />
        </q-card-actions>
        <q-card-section>
          <staff-details />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="authDialog" persistent>
      <q-card>
        <q-card-actions align="right">
          <q-btn icon="close" color="red" class="q-py-none" v-close-popup />
        </q-card-actions>
        <!-- <q-card-section v-if="(task == 'writeOff' && containsService[activeTableId.name] > 0) || isService">
          <span class="text-h6">You cannot write off service!</span>
        </q-card-section> -->
        <q-card-section>
          <LoginForm :mode="mode" :task="task" @change="doDialogActions" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showFormDialog" persistent>
      <q-card class="q-pa-none">
        <q-card-actions align="right" class="q-py-none">
          <q-btn
            icon="close"
            color="red"
            v-close-popup
            class="q-py-none"
            :ripple="false"
          />
        </q-card-actions>
        <q-card-section v-if="task == 'cashUp'">
          <CashUp :witnessUserDetails="witnessUserDetails" />
        </q-card-section>
        <q-card-section v-if="task == 'advanceCash'">
          <AdvanceCash :witnessUserDetails="witnessUserDetails" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoginForm from "../sign-in-out/LoginForm.vue";
import AdvanceCash from "../payment/advanceCash.vue";
import CashUp from "../payment/cashUp.vue";
import notifications from "src/boot/notifications";
import StaffDetails from "./StaffDetails.vue";

export default {
  data() {
    return {
      showStaff: false,
      authDialog: false,
      mode: null,
      task: null,
      showFormDialog: false,
      witnessUserDetails: {},
      tableId: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers"]),
    ...mapState("orders", ["containsService", "orderList"]),
    ...mapState("settings", ["showProductOfferPopup", "restaurantMode"]),
  },
  methods: {
    authBasedTasks(mode, task) {
      if (Object.keys(this.loggedInStoreUsers).length == 0) {
        notifications.warningNotify("Please sign in to Continue with the app!");
      } else {
        this.mode = mode;
        this.task = task;
        this.authDialog = true;
      }
    },
    doDialogActions(data) {
      if (this.task == "writeOff") {
        this.authDialog = data.authDialog;
      } else if (this.task == "cashUp" || this.task == "advanceCash") {
        if (this.mode == "witnessUser") {
          this.authDialog = data.authDialog;
          this.witnessUserDetails = data.witnessUserDetails;
          this.mode = "authActiveUser";
          this.authDialog = true;
        } else {
          this.authDialog = data.authDialog;
          this.showFormDialog = data.showFormDialog;
        }
      }
    },
  },
  created() {
    this.tableId =
      this.restaurantMode == "TAKEAWAY" ? "Takeaway" : this.activeTableId.name;
  },
  components: { LoginForm, AdvanceCash, CashUp, StaffDetails },
};
</script>
