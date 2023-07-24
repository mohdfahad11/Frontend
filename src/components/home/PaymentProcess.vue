<template>
  <div>
    <div class="row q-px-lg">
      <div class="col col-12 text-center q-px-sm">
        <q-btn
          push
          stack
          icon="payments"
          label="Pay"
          @click="selectDialogToDisplay()"
          class="full-width text-white bg-primary"
          padding="6px 10px"
          :disable="noAmount"
        />
      </div>
    </div>

    <q-dialog v-model="productOfferDialog" persistent>
      <q-card>
        <q-card-section>
          <span class="text-h6"
            >Hey! Have you offered products to customer?</span
          >
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            push
            label="Yes"
            class="bg-white text-green text-bold q-py-sm q-mr-xl"
            @click="paymentOptionDialog = true"
            v-close-popup
          />
          <q-btn
            push
            label="No"
            class="bg-white text-red text-bold q-py-sm"
            @click="paymentOptionDialog = true"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="paymentOptionDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders">
              {{
                restaurantMode == "TAKEAWAY"
                  ? "Takeaway"
                  : activeTableId && activeTableId != null
                  ? activeTableId.name
                  : "Table No"
              }}
            </span>
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
        <!-- <q-card-section v-if=" containsInternalProduct[activeTableId.name] > 0">
          <span class="text-h6">You cannot sell internal products!</span>
        </q-card-section> -->
        <q-card-section class="row items-center">
          <PaymentOptions
            :paymentOptionDialog.sync="paymentOptionDialog"
            mode="PURCHASE"
            :onOrderCompleteCallback="onOrderCompletion"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PaymentOptions from "../payment/PaymentOptions.vue";
import notifications from "src/boot/notifications";

export default {
  data() {
    return {
      paymentOptionKey: 0,
      discountCouponDialog: false,
      isDiscountApplied: false,
      paymentOptionDialog: false,
      productOfferDialog: false,
      pairGatewayDialog: false,
      containsInternalProductDialog: false,
      orderDiscountToApply: null,
      orderSurchargeAmountToAppy: null,
      isSurchargeAmountApplied: false,
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("orders", [
      "totalAmount",
      "orderDiscount",
      "orderSurchargeAmount",
    ]),
    ...mapState("settings", [
      "showProductOfferPopup",
      "gatewaySettings",
      "gateway",
      "restaurantMode",
    ]),
    discountRule() {
      return [(v) => v <= 100 || "Enter less than or equal to 100"];
    },
    cashInputRules() {
      return [
        (v) =>
          /^(?!0+(?:\.0+)?)\d*(?:\.\d+)?$/.test(v) ||
          "Enter positive numbers only",
      ];
    },
    tableId() {
      return this.restaurantMode == "TAKEAWAY"
        ? "Takeaway"
        : !this.activeTableId || this.activeTableId == {}
        ? null
        : this.activeTableId.name;
    },
    noAmount() {
      return (
        !this.totalAmount[this.tableId] || this.totalAmount[this.tableId] == 0
      );
    },
  },
  methods: {
    selectDialogToDisplay() {
      if (!this.gatewaySettings || this.gatewaySettings.length == 0) {
        notifications.warningNotify(
          "Setup Payment gateway from settings and then proceed!"
        );
      } else {
        this.showProductOfferPopup
          ? (this.productOfferDialog = true)
          : (this.paymentOptionDialog = true);
      }
    },
    applyOrderDiscount() {
      if (this.orderDiscountToApply) {
        this.isDiscountApplied = true;
        this.$store.commit(
          "orders/SET_ORDER_DISCOUNT",
          {
            activeTableId: this.tableId,
            orderDiscount: this.orderDiscountToApply,
          },
          { root: true }
        );
      }
    },
    removeOrderDiscount() {
      this.isDiscountApplied = false;
      this.orderDiscountToApply = null;

      this.$store.commit(
        "orders/REMOVE_ORDER_DISCOUNT",
        {
          activeTableId: this.tableId,
        },
        { root: true }
      );
    },
    applySurchargeAmount() {
      if (this.orderSurchargeAmountToAppy) {
        this.isSurchargeAmountApplied = true;
        this.$store.commit(
          "orders/SET_ORDER_SURCHARGE_AMOUNT",
          {
            activeTableId: this.tableId,
            orderSurchargeAmount: this.orderSurchargeAmountToAppy,
          },
          { root: true }
        );
      }
    },
    removeSurchargeAmount() {
      this.isSurchargeAmountApplied = false;
      this.orderSurchargeAmountToAppy = null;

      this.$store.commit(
        "orders/REMOVE_ORDER_SURCHARGE_AMOUNT",
        {
          activeTableId: this.tableId,
        },
        { root: true }
      );
    },
    onOrderCompletion() {
      this.isSurchargeAmountApplied = false;
      this.orderSurchargeAmountToAppy = "";
      this.isDiscountApplied = false;
      this.orderDiscountToApply = "";
    },
  },
  created() {
    this.orderDiscountToApply = this.orderDiscount[this.tableId];
    if (this.orderDiscountToApply) {
      this.isDiscountApplied = true;
    }
    this.orderSurchargeAmountToAppy = this.orderSurchargeAmount[this.tableId];
    if (this.orderSurchargeAmountToAppy) {
      this.isSurchargeAmountApplied = true;
    }
  },
  components: { PaymentOptions },
};
</script>
