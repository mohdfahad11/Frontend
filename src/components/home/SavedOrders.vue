<template>
  <div class="row">
    <q-item
      clickable
      v-ripple
      class="col col-4 q-pa-xs non-toggled-button"
      v-for="order in Object.values(savedOrders)"
      :key="order.id"
      :active="order.id == openedSavedOrderId"
      @click="openOrder(order.id)"
      :active-class="
        order.id == openedSavedOrderId
          ? 'toggled-button'
          : 'toggled-occupied-class'
      "
      :exact-active-class="
        order.id == openedSavedOrderId
          ? 'toggled-button'
          : 'toggled-occupied-class'
      "
    >
      <q-item-section class="user-login">
        <div style="display: flex; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div style="display: flex; flex-direction: column">
              <div>
                {{ order.currentCustomer && order.currentCustomer.name }}
              </div>

              <div>
                {{ order.currentCustomer && order.currentCustomer.phone_no }}
              </div>
              <div>
                {{ order.createdAt }}
              </div>
            </div>

            <div style="display: flex; align-items: center">
              <q-btn
                dense
                color="red"
                style="font-size: 16px !important"
                @click.stop="removeSavedOrder(order.id)"
                round
              >
                <template v-slot:default> <q-icon name="delete" /> </template>
              </q-btn>
            </div>
          </div>
        </div>
      </q-item-section>
    </q-item>

    <q-dialog
      v-model="displayConfirmSavedOrderDelete"
      persistent
      v-if="savedOrderIDToDelete"
    >
      <q-card>
        <q-card-section>
          <span class="text-h6"
            >Are you sure you want to delete the order saved for
            <strong
              >{{ customerNameToDisplayOnModal }}
              {{
                customerNameToDisplayOnModal
                  ? `(${customerNameToDisplayOnModal})`
                  : ""
              }}</strong
            >?</span
          >
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            push
            label="Delete"
            class="bg-white text-red text-bold q-py-sm q-mr-xl"
            @click="deleteSavedOrder"
            v-close-popup
          />
          <q-btn
            push
            label="Cancel"
            class="bg-white text-green text-bold q-py-sm"
            @click="displayConfirmSavedOrderDelete = false"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import notifications from "src/boot/notifications";
import { mapState } from "vuex";

export default {
  data() {
    return {
      activeOrder: null,
      displayConfirmSavedOrderDelete: false,
      savedOrderIDToDelete: null,
      customerNameToDisplayOnModal: null,
      customerPhoneToDisplayOnModal: null,
    };
  },
  computed: {
    ...mapState("orders", ["savedOrders", "openedSavedOrderId"]),
  },
  created() {},
  methods: {
    openOrder(orderId) {
      this.$store.commit("orders/OPEN_SAVED_ORDER", {
        orderIDToOpen: orderId,
        activeTableId: "Takeaway", // This feature is only available for Takeaways
      });
      this.$emit("close-dialog", false)
      notifications.successNotify("Saved order opened");
    },
    removeSavedOrder(orderId) {
      this.savedOrderIDToDelete = orderId;
      this.displayConfirmSavedOrderDelete = true;
      this.customerNameToDisplayOnModal =
        this.savedOrders[orderId].currentCustomer.name;
      this.customerPhoneToDisplayOnModal =
        this.savedOrders[orderId].currentCustomer.phone_no;
    },
    deleteSavedOrder() {
      this.$store.commit("orders/DELETE_SAVED_ORDER", {
        orderIdToDelete: this.savedOrderIDToDelete,
      });

      this.displayConfirmSavedOrderDelete = false;
      this.savedOrderIDToDelete = null;
      this.customerNameToDisplayOnModal = null;
      this.customerPhoneToDisplayOnModal = null;
    },
  },
};
</script>

<style scoped lang="scss">
.user-login {
  border: 0.2px solid var(--q-color-primary) !important;
  border-radius: 5px;
  padding: 12px;
  /* color: $primary; */
}
.non-toggled-button {
  color: var(--q-color-primary);
}
.non-toggled-occupied-button {
  color: rgb(227, 77, 77);
  .user-login {
    border-color: rgb(227, 77, 77);
  }
}
.toggled-button {
  background-color: var(--q-color-primary);
  border: 4px solid rgb(238, 238, 238);
  border-radius: 5px;
  color: white !important;
  padding: 0px;
  // padding: 0px !important;
}

.toggled-occupied-class {
  background-color: rgb(227, 77, 77);
  border: 4px solid white;
  border-radius: 5px;
  color: white !important;
  padding: 0px;
  .user-login {
    border-color: rgb(227, 77, 77);
  }
}
</style>
