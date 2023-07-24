<template>
  <div>
    <div class="q-pt-none">
      <div class="row">
        <div class="col col-6 q-pa-sm">
          Entity Name:
          <q-input v-model="lineItem.name" type="text" disable outlined />
        </div>
        <div class="col col-6 q-pa-sm">
          Price($):
          <q-input v-model="itemPrice" type="text" outlined :disable="true" />
        </div>
        <div class="col col-6 q-pa-sm">
          Quantity:
          <q-select v-model="quantity" :options="quantityOptions" outlined />
        </div>
        <div class="col col-6 q-pa-sm" v-if="quantity == 'More'">
          Specify Quantity:
          <q-input
            v-model="moreQuantity"
            type="text"
            outlined
            :rules="[
              (v) =>
                /^(?!0+(?:\.0+)?)\d*(?:\.\d+)?$/.test(v) ||
                'Enter positive numbers only',
            ]"
          />
        </div>
      </div>
      <div class="row justify-around">
        <div class="col col-6 q-pa-sm">
          <q-btn
            push
            label="Accept Quantity"
            @click="acceptQuatity()"
            class="full-width bg-white text-primary text-bold q-py-sm"
            v-close-popup
            :disable="
              !quantity ||
              quantity == lineItem.quantity ||
              (quantity == 'More' && !moreQuantity)
            "
          />
        </div>

        <!-- <div class="col col-6 q-pa-sm">
          <q-btn push label="Void" @click="authAdminDialog=true" class="full-width bg-white text-red text-bold q-py-sm" :disable="orderTotalAmount[tableId]>totalAmount[tableId] || lineItem.quantity==0" />
        </div> -->
      </div>
    </div>

    <q-dialog v-model="authAdminDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Authenticate Admin </span>
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
        <q-card-section class="row items-center">
          <loginForm
            @change="closeAllDialogs"
            :mode="'authAdmin'"
            :task="'makeVoid'"
            :lineItemIndex="index"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import loginForm from "../sign-in-out/LoginForm.vue";
export default {
  data() {
    return {
      empKey: 0,
      quantity: null,
      itemPrice: null,
      authAdminDialog: false,
      filterStoreUserOptions: [],
      quantityOptions: [
        1,
        2,
        3,
        4,
        5,
        "More",
      ],
      moreQuantity: null,
      tableId: null,
    };
  },
  props: ["index"],
  computed: {
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers"]),
    ...mapState("orders", ["orderList", "totalAmount", "orderTotalAmount"]),
    ...mapState("settings", ["restaurantMode"]),
    lineItem() {
      let tableId =
        this.restaurantMode == "TAKEAWAY"
          ? "Takeaway"
          : this.activeTableId.name;
      return this.orderList[tableId][this.index];
    },
  },
  created() {
    this.quantity = this.lineItem.quantity;
    this.itemPrice = this.lineItem.price;
    this.tableId =
      this.restaurantMode == "TAKEAWAY" ? "Takeaway" : this.activeTableId.name;
  },
  methods: {
    acceptQuatity() {
      let qty = this.quantity == "More" ? this.moreQuantity : this.quantity;
      this.$store.commit("orders/SET_QUANTITY", {
        activeTableId: this.tableId,
        index: this.index,
        quantity: parseFloat(qty),
      });
    },
    acceptPrice() {
      let difference = this.itemPrice - this.lineItem.price;
      this.$store.commit("orders/SET_PRICE", {
        activeTableId: this.tableId,
        index: this.index,
        price: this.itemPrice,
        difference: difference,
      });
    },
    closeAllDialogs(data) {
      this.authAdminDialog = data.authAdminDialog;
      this.$emit("update:actionsDialog", data.actionsDialog);
    },
  },
  components: { loginForm },
};
</script>
