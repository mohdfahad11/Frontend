<template>
  <div>
    <div class="row q-mb-md">
      <div class="col col-12 text-h5 text-center" v-if="mode == 'PURCHASE'">
        Amount to pay:
        <span class="text-primary">
          ${{
            parseFloat(totalAmount[tableId] ? totalAmount[tableId] : 0).toFixed(
              2
            )
          }}</span
        >
      </div>
      <div class="col col-12 text-h5 text-center" v-else>
        Refund Amount:
        <span class="text-primary">
          ${{ parseFloat(refundAmount ? refundAmount : 0).toFixed(2) }}
        </span>
      </div>
    </div>
    <div class="row" v-if="mode == 'REFUND'">
      <div class="col col-12">
        <q-input
          outlined
          v-model="refundReason"
          type="textarea"
          label="Refund Reason"
        />
      </div>
    </div>
    <div class="row" v-if="mode == 'PURCHASE'">
      <div class="col col-6">
        <q-input
          outlined
          label="Cash($)"
          ref="cashRef"
          v-model="cashReceived"
          :rules="cashInputRules"
          reactive-rules
          class="q-mx-xs"
          @focus="focusOn = 'onCash'"
          @blur="resetCashIfEmpty"
          autofocus
        ></q-input>
      </div>

      <div class="col col-6">
        <q-input
          outlined
          label="Card($)"
          ref="cardRef"
          v-model="cardAmount"
          :rules="cashInputRules"
          reactive-rules
          class="q-mx-xs"
          @focus="focusOn = 'onCard'"
          @blur="resetCardIfEmpty"
        ></q-input>
      </div>

      <div class="col col-6">
        <q-select
          v-model="waitingTime"
          label="Waiting Time"
          class="q-mx-xs"
          :options="waitingTimeOptions"
          outlined
          clearable
          :disable="disableWaitingTime"
        />
      </div>
      <div class="col col-6">
        <q-select
          v-model="deliverTime"
          label="Deliver Time"
          class="q-mx-xs"
          :options="deliverTimeOptions"
          outlined
          clearable
          :disable="disableDeliverTime"
        />
      </div>
      <div class="col col-12">
        <q-input
          outlined
          label="Note"
          v-model="note"
          class="q-mx-xs q-mt-xs"
        ></q-input>
      </div>
    </div>
    <div class="row" v-if="mode == 'PURCHASE'">
      <div class="col col-12 text-center q-pt-xs">
        {{ mode == "PURCHASE" ? "Outstanding" : "Maximum Refund Amount" }}:
        <q-btn
          push
          :class="outstandingAmount < 0 ? 'text-red' : 'text-primary'"
          stack
          @click="setValue"
          class="full-width bg-white text-bold q-py-sm"
          :disable="outstandingAmount <= 0"
        >
          {{ parseFloat(outstandingAmount ? outstandingAmount : 0).toFixed(2) }}
        </q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col col-6 q-pt-sm text-center" v-if="mode == 'PURCHASE'">
        <q-btn
          push
          stack
          label="Accept"
          @click="printKitchenRecConfirmation = true"
          class="full-width bg-primary text-white text-bold q-py-sm"
          :disable="!cashReceived && !cardAmount"
        />
      </div>
      <q-dialog v-model="printKitchenRecConfirmation" persistent>
        <q-card>
          <q-card-section>
            <span class="text-h6">Do you want to print Kitchen Reciept?</span>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              push
              label="Yes"
              class="bg-white text-green text-bold q-py-sm q-mr-xl"
              @click="printOrder()"
              v-close-popup
            />
            <q-btn
              push
              label="No"
              class="bg-white text-red text-bold q-py-sm"
              @click="printBillReciept()"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="printDialogConfirmation" persistent>
        <q-card>
          <q-card-section>
            <span class="text-h6">Do you really want to print the orders?</span>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              push
              label="Yes"
              class="bg-white text-green text-bold q-py-sm q-mr-xl"
              @click="printKitchenReciept()"
              v-close-popup
            />
            <q-btn
              push
              label="No"
              class="bg-white text-red text-bold q-py-sm"
              @click="printDialogConfirmation = false"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div
        class="col col-6 q-mt-sm q-pl-sm text-center"
        v-if="mode == 'PURCHASE'"
      >
        <q-btn
          push
          stack
          label="Print"
          @click="printDialogConfirmation = true"
          class="full-width bg-white text-green text-bold q-py-sm"
        />
      </div>

      <div class="col col-12 q-pt-sm text-center" v-else>
        <q-btn
          push
          stack
          label="View Transaction"
          @click="transactionDialog = true"
          class="q-mx-xs bg-white text-primary text-bold q-py-sm"
        />
        <!-- <q-btn
          push
          stack
          label="Refund"
          @click="refundMoney"
          class="q-mx-xs bg-white text-red text-bold q-py-sm"
        /> -->
        <q-btn
          push
          stack
          label="Card"
          @click="onClickType('CARD')"
          class="q-mx-xs bg-white text-primary text-bold q-py-sm"
          :disable="!refundAmount"
        />
        <q-btn
          push
          stack
          label="Cash"
          @click="onClickType('CASH')"
          class="q-mx-xs bg-white text-primary text-bold q-py-sm"
          :disable="!refundAmount"
        />
      </div>
    </div>

    <q-dialog v-model="smartConnectDialog" persistent>
      <q-card style="min-width: max-content">
        <q-card-actions align="right">
          <q-btn
            icon="close"
            color="red"
            @click="closeAllDialog"
            class="q-py-sm"
          />
        </q-card-actions>

        <q-card-section>
          <div class="row">
            <div class="col col-2 text-center">
              <q-icon :name="msgIcon" :color="iconColor" size="lg" />
            </div>
            <div class="col col-10 q-pl-xs">
              <span class="text-h6">{{ smartConnectMsg }}</span>
              <q-spinner-dots
                color="white"
                size="2em"
                v-if="showLoading"
                class="q-pl-xs"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="transactionDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders">
              Order Id: {{ refundOrderId ? refundOrderId : null }}
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
        <q-card-section class="text-h6">
          <OrderLineItems
            :orderLineItemList="orderLineItemList"
            @change="setValuesForRefund"
            :surchargeAmount="surchargeAmount"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  createTransaction,
  pollForOutcome,
  TransactionOutcome,
} from "src/boot/smartconnect";
import { mapActions, mapState } from "vuex";
import notifications from "src/boot/notifications";
import moment from "moment";
import OrderLineItems from "../orders/OrderLineItems.vue";

export default {
  props: [
    "mode",
    "orderLineItemList",
    "surchargeAmount",
    "refundOrderId",
    "onOrderCompleteCallback",
  ],
  data() {
    return {
      disableWaitingTime: false,
      disableDeliverTime: false,
      printDialogConfirmation: false,
      printKitchenRecConfirmation: false,
      focusOn: null,
      transactionNo: "",
      cashReceived: null,
      cardAmount: null,
      surchargeSelected: true,
      smartConnectDialog: false,
      tyroPurchaseResponseResult: null,
      transactionType: {},
      smartConnectMsg: "Processing the payment",
      showLoading: true,
      msgIcon: "access_time_filled",
      iconColor: "yellow",
      optionsToPrintFunc: {},
      optionsToPrintCoffeeFunc: {},
      cashReceipt: null,
      orderListLength: 0,
      billList: null,
      printRec: false,
      transactionDialog: false,
      orderLineItemId: null,
      totalPayment: 0,
      totalCoffeePayment: 0,
      surchargeAmountFromTyro: "0",
      tyroCustomerReceipt: null,
      smartPayCustomerReceipt: null,
      orderLineItem: null,
      refundAmount: null,
      refundReason: null,
      gst: 0,
      gstCoffee: 0,
      tableId: null,
      billListCoffee: null,
      waitingTime: null,
      waitingTimeOptions: [
        { value: 10, label: "10 mins" },
        { value: 20, label: "20 mins" },
        { value: 30, label: "30 mins" },
        { value: 60, label: "1 hour" },
      ],
      deliverTime: null,
      deliverTimeOptions: [
        { value: 10, label: "10 mins" },
        { value: 20, label: "20 mins" },
        { value: 30, label: "30 mins" },
        { value: 60, label: "1 hour" },
      ],
      note: null,
    };
  },
  computed: {
    ...mapState("services", ["categoryCoffee"]),
    ...mapState("storeUser", ["activeTableId", "envVariable"]),
    ...mapState("orders", [
      "orderList",
      "totalAmount",
      "paidByCard",
      "paidByCash",
      "paymentMethods",
      "orderPayments",
      "orderTotalAmount",
      "staffTableLink",
      "containsCoffee",
      "orderTypes",
      "orderDiscount",
      "orderDiscountReason",
      "orderSurchargeAmount",
      "orderDiscountType",
      "orderSurchargeType",
      "openedSavedOrderId",
    ]),
    ...mapState("settings", [
      "gateway",
      "tyroIntegratedReceipt",
      "tyroIntegratedSurcharge",
      "tyroPosProductInfo",
      "defaultPrinter",
      "defaultCoffeePrinter",
      "clientInformation",
      "otherPaymentDetails",
      "restaurantMode",
    ]),
    ...mapState("customers", ["currentCustomer", "guestCustomer"]),
    cashInputRules() {
      return [
        (v) =>
          /^(?!0+(?:\.0+)?)\d*(?:\.\d+)?$/.test(v) ||
          "Enter positive numbers only",
      ];
    },
    apiKey() {
      return process.env.API_KEY;
    },
    posProductInfo() {
      return {
        posProductVendor: this.tyroPosProductInfo.vendor
          ? this.tyroPosProductInfo.vendor
          : process.env.PRODUCT_VENDOR_NAME,
        posProductName: this.tyroPosProductInfo.productName
          ? this.tyroPosProductInfo.productName
          : process.env.PRODUCT_NAME,
        posProductVersion: this.tyroPosProductInfo.version
          ? this.tyroPosProductInfo.version
          : process.env.PRODUCT_VERSION_NUMBER,
        siteReference: this.tyroPosProductInfo.siteReference
          ? this.tyroPosProductInfo.siteReference
          : process.env.SITE_REFERNCE,
      };
    },
    outstandingAmount() {
      return this.mode == "PURCHASE"
        ? parseFloat(
            this.totalAmount[this.tableId] -
              (this.cardAmount ? this.cardAmount : 0) -
              (this.cashReceived ? this.cashReceived : 0)
          ).toFixed(2)
        : 0;
    },
    receiptByPos() {
      let showSurcharge = "";
      let localTotalAmount = this.totalPayment;
      let localCardAmount = this.paidByCard[this.tableId] * 1;
      let localCashAmount = this.paidByCash[this.tableId] * 1;
      let appliedSurchargeAmountHTML = "";
      let discountHTML = "";
      const discountType = this.orderDiscountType[this.tableId];
      const surchargeType = this.orderSurchargeType[this.tableId];
      const appliedSurchargeAmount = this.orderSurchargeAmount[this.tableId];
      const appliedDiscount = this.orderDiscount[this.tableId];

      let staff =
        this.restaurantMode == "DINEINN" && this.staffTableLink
          ? this.staffTableLink[this.tableId].name
          : "TakeAway";
      if (this.tyroIntegratedSurcharge) {
        showSurcharge =
          "\n<div style='width:100%; display:flex; justify-content: space-between;font-weight: bold;'><span style='text-align:left;font-weight: bold;'>Surcharge Amount</span><span>$" +
          this.surchargeAmountFromTyro +
          "</span></div>";
        localTotalAmount = localTotalAmount + this.surchargeAmountFromTyro * 1;
        localCardAmount = localCardAmount + this.surchargeAmountFromTyro * 1;
      }

      if (appliedSurchargeAmount) {
        appliedSurchargeAmountHTML =
          "\n<div style='width:100%; display:flex; justify-content: space-between;font-weight: bold;'><span style='text-align:left;font-weight: bold;'>Applied Surcharge Amount</span><span>" +
          (surchargeType == 2
            ? appliedSurchargeAmount + "%"
            : "$" + appliedSurchargeAmount) +
          "</span></div>";
      }

      if (appliedDiscount) {
        discountHTML =
          "\n<div style='width:100%; display:flex; justify-content: space-between;font-weight: bold;'><span style='text-align:left;font-weight: bold;'>Discount</span><span>" +
          (discountType == 2 ? appliedDiscount + "%" : "$" + appliedDiscount) +
          "</span></div>";
      }

      const receiptContent =
        "<div style='margin-left: 10px; width:220px; font-size: 13px;font-weight: bold;'><div style='text-align:center;font-weight: bold;'><span>" +
        this.posProductInfo.siteReference +
        "\nTax Invoice \nABN: " +
        process.env.RESTAURANT_ABN_NUMBER +
        " \n" +
        this.tyroPosProductInfo.addressLine1 +
        " \n" +
        this.tyroPosProductInfo.addressLine2 + 
        "\n Phone No.: 03 9309 3323 \n" +
        "\n</span></div><div style='width:100%; display:flex; justify-content: space-between;font-weight: bold; border-bottom: 1px dashed black; padding-bottom: 5px; margin-bottom: 5px;'><span style='text-align:left'>Item Name</span><span>Price</span></div>" +
        this.billList +
        showSurcharge +
        appliedSurchargeAmountHTML +
        discountHTML +
        "\n<div style='width:100%; display:flex; justify-content: space-between;font-weight: bold; font-weight: bold'><span style='text-align:left'>TOTAL</span><span>$" +
        localTotalAmount.toFixed(2) +
        "</span></div>\n<div style='width:100%; display:flex; justify-content: space-between;font-weight: bold;'><span style='text-align:left'>Card</span><span>$" +
        localCardAmount +
        "</span></div><div style='width:100%; display:flex; justify-content: space-between;font-weight: bold;'><span style='text-align:left'>Cash</span><span>$" +
        localCashAmount +
        "</span></div>" + " \n<div>Note:" + this.note + "</div>" + " \nOperator:" +
        // (this.gst
        //   ? "<div style='text-align:left;font-weight: bold;'>\n" +
        //     this.gst +
        //     " GST included in Total</div>"
        //   : "") +
        staff +
        "\nLine Items: " +
        this.orderListLength +
        " \nDate: " +
        moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

      return receiptContent;
    },
    coffeeReceiptByPos() {
      let staff =
        this.restaurantMode == "DINEINN" && this.staffTableLink
          ? this.staffTableLink[this.tableId].name
          : "TakeAway";
      let printContent; 
      const currentCustomer = this.currentCustomer[this.tableId];
      if (staff == "TakeAway" && currentCustomer) {
        printContent =
        " \n<div style='text-align:left;font-weight: bold;'>" + " \nCustomer: " + currentCustomer.name
      } else {
        printContent =
        " \n<div style='text-align:left;font-weight: bold;'>" + " \nTable Id: " + this.tableId
      }
      return (
        "<div style='margin-left: 14px; width: 220px;font-weight: bold;font-size: 13px;'><div style='text-align:center'><p>Coffee/Kitchen Print</p><span>" +
        this.posProductInfo.siteReference +
        " \nTable No.:" +
        this.tableId +
        "\n</span></div><div style='width:100%; display:flex;font-weight: bold; justify-content: space-between;margin-top: 5px;'><span style='text-align:left'>Item Name</span><span>Price</span></div><div>----------------------------</div>" +
        this.billListCoffee +
        " \n<div style='text-align:left;font-weight: bold;margin-top: 5px;'>" + " \nOperator: " +
        staff +
        "\nLine Items: " +
        this.orderListLength + printContent +
        " \nDATE: " +
        moment(new Date()).format("YYYY-MM-DD HH:mm:ss") +
        "</div></div>"
      );
    },
    refundReceipt() {
      let showSurcharge = "";
      if (this.surchargeAmount > 0) {
        showSurcharge =
          "\n<div style='width:100%; display:flex; justify-content: space-between'><span style='text-align:left'>Surcharge Amount</span><span>$" +
          this.surchargeAmount +
          "</span></div>";
      }
      let amount = this.cashReceived ? this.cashReceived : this.cardAmount;
      let amount_label = this.cashReceived ? "Cash" : "Card";
      let totalAmount =
        amount * 1 + (this.surchargeAmount ? this.surchargeAmount * 1 : 0);

      const orderLineItemBill =
        "<div style='width:100%; max-width: 100%; font-weight: bold; margin-top: 10px; margin-bottom: 10px;'><div style='width: 70%; max-width: 70%; float: left; white-space: normal;'>" +
          this.orderLineItem.quantity +
          " X " +
          this.orderLineItem.products.name +
          "</div><div style='width: 30%; text-align: right; float: right;'> $" +
          parseFloat(
            this.orderLineItem.line_item_total
          ).toFixed(2) +
        "</div></div>"

      return (
        "<div style='style='margin-left: 14px; width: 220px;font-weight: bold;font-size: 13px;'><div style='text-align:center'><span>" +
        this.posProductInfo.siteReference +
        " \nRefund Invoice \nABN: " +
        process.env.RESTAURANT_ABN_NUMBER +
        " \n" +
        this.tyroPosProductInfo.addressLine1 +
        " \n" +
        this.tyroPosProductInfo.addressLine2 + " \n" +
        " \n</span></div>" +
        orderLineItemBill + " \n" +
        showSurcharge +
        "\n<div style='width:100%; display:flex;font-weight: bold; justify-content: space-between; font-weight: bold'><span style='text-align:left'>" +
        amount_label +
        "</span><span>$" +
        amount +
        "</span></div>\n<div style='width:100%;font-weight: bold; display:flex; justify-content: space-between; font-weight: bold'><span style='text-align:left'>TOTAL</span><span>$" +
        totalAmount + " \n" +
        "</span></div>\n<div><span style='text-align:left'>Transaction Id: </span><span>" +
        this.refundOrderId + " \n" +
        "</span></div>"
      );
    },
  },
  methods: {
    ...mapActions("orders", ["createOrder", "refundOrder"]),
    ...mapActions("cashdrawer", ["openCashDrawerAPI"]),
    onClickType(type) {
      if (type == "CARD") {
        this.cardAmount = this.refundAmount;
      } else {
        this.cashReceived = this.refundAmount;
      }
      this.refundMoney();
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
    resetCardIfEmpty() {
      if (!this.cardAmount) {
        this.$refs.cardRef.resetValidation();
      }
    },
    resetCashIfEmpty() {
      if (!this.cashReceived) {
        this.$refs.cashRef.resetValidation();
      }
    },
    setValuesForRefund(data) {
      // if (
      //   data.orderLineItemId == this.paymentMethods["Card"].payment_method_id
      // ) {
      //   this.cardAmount = data.amount;
      // } else {
      //   this.cashReceived = data.amount;
      // }
      this.orderLineItemId = data.orderLineItemId;
      this.orderLineItem = data.orderLineItem;
      this.refundAmount = data.amount;
    },
    async printReceiptFun(printContent) {
      if (window) {
        const orderType =
          this.restaurantMode == "DINEINN" && this.staffTableLink
            ? this.staffTableLink[this.tableId].name
            : "TakeAway";
        const currentCustomer = this.currentCustomer[this.tableId];

        if (orderType == "TakeAway" && currentCustomer) {
          printContent =
          "<div style='margin-left: 10px; margin-right: 2px; width:220px; font-size: 13px;font-weight: bold;'><div style='text-align:left;font-weight: bold;'>" +
            printContent +
            `
            <div style='margin-left: 10px; margin-right: 2px; width: 220px; font-weight: bold;'>
              Customer: ${currentCustomer.name}
            </div>` +
            "<div style='font-weight: bold;padding-top: 10px; text-align:center;'>Thank you for your order!" +
              "</div></div>";
        }

        if (this.restaurantMode == "DINEINN" && this.staffTableLink) {
          printContent =
          "<div style='margin-left: 10px; width:220px; font-size: 13px;font-weight: bold;'><div style='text-align:left;font-weight: bold;'>" +
            printContent +
            `
            <div style='margin-left: 10px; width: 220px; font-weight: bold;'>
              Table: ${this.tableId}
            </div>` +
            "<div style='font-weight: bold;padding-top: 10px; text-align:center;'>Thank you for your order!" +
              "</div></div>";
        }

        await window.cashDrawer.printReceiptFun(
          this.optionsToPrintFunc,
          printContent
        );
      }
    },
    async printCoffeeReceiptFun(printContent) {
      if (window) {
        await window.cashDrawer.printReceiptFun(
          this.optionsToPrintCoffeeFunc,
          printContent
        );
      }
    },
    transactionCompleteCallbackImpl(response) {
      this.surchargeAmountFromTyro = response.surchargeAmount;
      if (this.mode == "PURCHASE" && response.result == "APPROVED") {
        let cardAmountTemp =
          parseFloat(this.paidByCard[this.tableId]) +
          parseFloat(this.cardAmount);
        this.$store.commit("orders/DEDUCT_PAID_AMOUNT", {
          activeTableId: this.tableId,
          amount: this.cardAmount,
        });
        this.$store.commit("orders/CALC_PAID_BY_CARD", {
          activeTableId: this.tableId,
          paidByCard: cardAmountTemp.toFixed(2),
        });
        this.$store.commit(
          "orders/SET_ORDER_PAYMENTS",
          {
            activeTableId: this.tableId,
            rec: {
              payment_method_id: this.paymentMethods["Card"].id,
              amount_paid: this.cardAmount * 1,
              status: this.paymentMethods["Card"].status,
            },
          },
          { root: true }
        );
        if (this.totalAmount[this.tableId] == 0) {
          if (response.customerReceipt && this.tyroIntegratedReceipt) {
            this.tyroCustomerReceipt = response.customerReceipt;
          }
          this.postOrder();
        } else {
          if (response.customerReceipt && this.tyroIntegratedReceipt) {
            this.printReceiptFun("<pre>" + response.customerReceipt + "</pre>");
          }
        }
      } else if (this.mode == "REFUND" && response.result == "APPROVED") {
        this.refundOrder({
          order_line_item_id: this.orderLineItemId * 1,
          type: 2,
          refund_reason: this.refundReason,
        }).then(() => {
          if (response.customerReceipt && this.tyroIntegratedReceipt) {
            this.printReceiptFun(
              "<pre>" +
                this.refundReceipt + 
                "\n-----------------------\n" +
                response.customerReceipt +
                "</pre>"
            );
          } else {
            this.printReceiptFun("<pre>" + this.refundReceipt + "</pre>");
          }
        });
      } else if (this.mode == "PURCHASE" && response.result != "APPROVED") {
        if (response.customerReceipt && this.tyroIntegratedReceipt) {
          this.printReceiptFun("<pre>" + response.customerReceipt + "</pre>");
        }
      } else if (this.mode == "REFUND" && response.result != "APPROVED") {
        if (response.customerReceipt && this.tyroIntegratedReceipt) {
          this.printReceiptFun("<pre>" + response.customerReceipt + "</pre>");
        }
      }
    },
    receiptCallbackImpl(receipt) {
      if (this.tyroIntegratedReceipt) {
        this.printReceiptFun(
          "<pre>" +
            "<span style='font-weight:bold;'>" +
            receipt.merchantReceipt +
            "</span>" +
            "</pre>"
        );
      }
    },

    tyroPayment() {
      let amount;
      let params = {
        integratedReceipt: this.tyroIntegratedReceipt,
      };
      this.tyroIntegratedSurcharge
        ? (params["enableSurcharge"] = this.tyroIntegratedSurcharge)
        : null;
      let iclient = new TYRO.IClientWithUI(this.apiKey, this.posProductInfo);
      if (this.mode == "PURCHASE") {
        amount = parseInt(parseFloat(this.cardAmount * 100).toFixed(2));
        params["amount"] = amount.toString();
        params["cashout"] = "0";
        iclient.initiatePurchase(params, {
          receiptCallback: this.receiptCallbackImpl,
          transactionCompleteCallback: this.transactionCompleteCallbackImpl,
        });
      } else {
        let SA = this.surchargeAmount ? this.surchargeAmount : 0;
        amount = this.cardAmount * 1 + SA * 1;
        amount = parseInt(parseFloat(amount * 100).toFixed(2));
        params["amount"] = amount.toString();
        iclient.initiateRefund(params, {
          receiptCallback: this.receiptCallbackImpl,
          transactionCompleteCallback: this.transactionCompleteCallbackImpl,
        });

        this.$emit("change", {
          openPaymentOptionDailog: false,
          itemReceiptSearch: false,
        });
      }
    },
    refundMoney() {
      if (this.cardAmount) {
        if (this.gateway.payment_gateway_id == 1) {
          this.tyroPayment();
        } else {
          this.smartConnectPayment();
        }
      } else if (this.cashReceived) {
        this.openCashDrawer();
        this.refundOrder({
          order_line_item_id: this.orderLineItemId * 1,
          type: 1,
          refund_reason: this.refundReason,
        }).then(() => {
          this.printReceiptFun("<pre>" + this.refundReceipt + "</pre>");
        });
        this.$emit("change", {
          openPaymentOptionDailog: false,
          itemReceiptSearch: false,
        });
      } else {
        notifications.warningNotify(
          "Specify amount to refund! View transactions!"
        );
      }
    },
    setValue() {
      if (this.focusOn == "onCash" && !this.cashReceived) {
        this.cashReceived = this.outstandingAmount;
      } else if (this.focusOn == "onCard" && !this.cardAmount) {
        this.cardAmount = this.outstandingAmount;
      } else {
        if (this.cashReceived) {
          this.cardAmount = this.outstandingAmount;
        } else if (this.cardAmount) {
          this.cashReceived = this.outstandingAmount;
        } else {
          this.cashReceived = this.outstandingAmount;
        }
      }
    },
    acceptPayment() {
      if (this.outstandingAmount < 0) {
        notifications.failureNotify(
          "Amount cannot be greater than outstanding amount!"
        );
      } else {
        this.printKitchenRecConfirmation = true
        if (this.cashReceived) {
          let cashAmount =
            parseFloat(this.paidByCash[this.tableId]) +
            parseFloat(this.cashReceived);
          this.openCashDrawer();
          this.$store.commit("orders/DEDUCT_PAID_AMOUNT", {
            activeTableId: this.tableId,
            amount: this.cashReceived,
          });
          this.$store.commit("orders/CALC_PAID_BY_CASH", {
            activeTableId: this.tableId,
            paidByCash: cashAmount.toFixed(2),
          });
          this.$store.commit(
            "orders/SET_ORDER_PAYMENTS",
            {
              activeTableId: this.tableId,
              rec: {
                payment_method_id: this.paymentMethods["Cash"].id,
                amount_paid: this.cashReceived * 1,
                status: this.paymentMethods["Card"].status,
              },
            },
            { root: true }
          );
          if (!this.cardAmount) {
            this.$emit("update:paymentOptionDialog", false);
          }
          this.cashReceived = "";
          this.$refs.cashRef.resetValidation();
        }
        if (this.cardAmount) {
          if (this.gateway.payment_gateway_id == 1) {
            this.tyroPayment();
            this.$emit("update:paymentOptionDialog", false);
          } else {
            this.smartConnectPayment();
          }
        }
        this.$store.commit("orders/DELETE_SAVED_ORDER",{ orderIdToDelete: this.openedSavedOrderId })

        if (this.totalAmount[this.tableId] == 0) {
          this.postOrder();
        }
      }
    },
    smartConnectPayment() {
      let amount;
      amount = parseInt(parseFloat(this.cardAmount * 100).toFixed(2));
      if (this.mode == "PURCHASE") {
        this.transactionType = {
          value: "Card.Purchase",
          label: "Card.Purchase",
        };
      } else {
        this.transactionType = {
          value: "Card.Refund",
          label: "Card.Refund",
        };
      }
      let transactionType = this.transactionType.value;
      this.smartConnectDialog = true;
      let delayedShown = false;

      let delayed = function () {
        if (!delayedShown) {
          delayedShown = true;
          this.showLoading = true;
          this.smartConnectMsg =
            "Transaction delayed! Check if the device is powered on and online";
          this.msgIcon = "power_off";
          this.iconColor = "grey";
        }
      };

      createTransaction(amount, transactionType)
        .then((pollingUrl) => {
          this.showLoading = true;
          this.smartConnectMsg = "Transaction is in process! Please wait";
          this.msgIcon = "access_time_filled";
          this.iconColor = "yellow";
          return pollForOutcome(pollingUrl, delayed);
        })
        .then((response) => {
          if (response.res && response.res.data.data.Receipt) {
            this.smartPayCustomerReceipt = response.res.data.data.Receipt;
          }
          if (response.transactionOutcome == TransactionOutcome.Accepted) {
            this.smartConnectMsg =
              this.mode == "PURCHASE"
                ? "Transaction Accepted!"
                : "Refund Successful!";
            this.msgIcon = "check_circle";
            this.iconColor = "green";
            if (this.mode == "PURCHASE") {
              let cardAmountTemp =
                parseFloat(this.paidByCard[this.tableId]) +
                parseFloat(this.cardAmount);
              this.$store.commit("orders/DEDUCT_PAID_AMOUNT", {
                activeTableId: this.tableId,
                amount: this.cardAmount,
              });
              this.$store.commit("orders/CALC_PAID_BY_CARD", {
                activeTableId: this.tableId,
                paidByCard: cardAmountTemp.toFixed(2),
              });
              this.$store.commit(
                "orders/SET_ORDER_PAYMENTS",
                {
                  activeTableId: this.tableId,
                  rec: {
                    payment_method_id: this.paymentMethods["Card"].id,
                    amount_paid: this.cardAmount * 1,
                    status: this.paymentMethods["Card"].status,
                  },
                },
                { root: true }
              );
              if (this.totalAmount[this.tableId] == 0) {
                this.postOrder();
              }
              this.$emit("update:paymentOptionDialog", false);
            } else {
              //refund process
              this.refundOrder({
                order_line_item_id: this.orderLineItemId * 1,
                type: 2,
                refund_reason: this.refundReason,
              }).then(() => {
                if (this.smartPayCustomerReceipt) {
                  this.printReceiptFun(
                    "<pre>" +
                      this.refundReceipt +
                      "\n-------------------------\n" +
                      this.smartPayCustomerReceipt +
                      "</pre>"
                  );
                } else {
                  this.printReceiptFun("<pre>" + this.refundReceipt + "</pre>");
                }
                this.$emit("update:paymentOptionDialog", false);
              });
            }
          } else if (
            response.transactionOutcome == TransactionOutcome.Declined
          ) {
            this.smartConnectMsg = "Transaction Declined!";
            this.msgIcon = "credit_card_off";
            this.iconColor = "orange";
          } else if (
            response.transactionOutcome == TransactionOutcome.Cancelled
          ) {
            this.smartConnectMsg = "Transaction Cancelled!";
            this.msgIcon = "cancel";
            this.iconColor = "primary";
          } else if (
            response.transactionOutcome == TransactionOutcome.DeviceOffline
          ) {
            this.smartConnectMsg =
              "Transaction Cancelled! Please check if the device is powered on and online.";
            this.msgIcon = "power_off";
            this.iconColor = "grey";
          } else {
            this.smartConnectMsg = "Transaction Failed!";
            this.msgIcon = "error";
            this.iconColor = "red";
          }
          setTimeout(() => {
            this.smartConnectDialog = false;
          }, 3000);
        })
        .catch((errorMessage) => {
          this.smartConnectMsg = "Error! Message: " + errorMessage;
          this.msgIcon = "error";
          this.iconColor = "red";
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    closeAllDialog() {
      this.smartConnectDialog = false;
      if (this.msgIcon != "error") {
        this.$emit("update:paymentOptionDialog", false);
      }
    },
    printKitchenReciept() {
      if (!this.printRec) {
        this.printRec = true;
        if (
          this.gateway.payment_gateway_id == 1 &&
          this.tyroCustomerReceipt &&
          this.tyroIntegratedReceipt
        ) {
          this.printCoffeeReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.tyroCustomerReceipt +
              "</span>" +
              "</pre>"
          );
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        } else if (
          this.gateway.payment_gateway_id == 2 &&
          this.smartPayCustomerReceipt
        ) {
          this.printCoffeeReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.smartPayCustomerReceipt +
              "</span>" +
              "</pre>"
          );
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        } else {
          this.printCoffeeReceiptFun("<pre>" + this.receiptByPos + "</pre>");
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        }
      }
    },
    printBillReciept() {
      this.acceptPayment();
      if (!this.printRec) {
        this.printRec = true;
        if (
          this.gateway.payment_gateway_id == 1 &&
          this.tyroCustomerReceipt &&
          this.tyroIntegratedReceipt
        ) {
          this.printReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.tyroCustomerReceipt +
              "</span>" +
              "</pre>"
          );
        } else if (
          this.gateway.payment_gateway_id == 2 &&
          this.smartPayCustomerReceipt
        ) {
          this.printReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.smartPayCustomerReceipt +
              "</span>" +
              "</pre>"
          );
        } else {
          this.printReceiptFun("<pre>" + this.receiptByPos + "</pre>");
        }
      }
    },
    printOrder() {
      this.acceptPayment();
      if (!this.printRec) {
        this.printRec = true;
        if (
          this.gateway.payment_gateway_id == 1 &&
          this.tyroCustomerReceipt &&
          this.tyroIntegratedReceipt
        ) {
          this.printReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.tyroCustomerReceipt +
              "</span>" +
              "</pre>"
          );
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        } else if (
          this.gateway.payment_gateway_id == 2 &&
          this.smartPayCustomerReceipt
        ) {
          this.printReceiptFun(
            "<pre>" +
              this.receiptByPos +
              "\n--------------------------------------\n" +
              "<span style='font-weight:bold;'>" +
              this.smartPayCustomerReceipt +
              "</span>" +
              "</pre>"
          );
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        } else {
          this.printReceiptFun("<pre>" + this.receiptByPos + "</pre>");
          this.billListCoffee != null
            ? this.printCoffeeReceiptFun(
                "<pre>" + this.coffeeReceiptByPos + "</pre>"
              )
            : null;
        }
      }
    },
    postOrder() {
      let localOrderList = [...this.orderList[this.tableId]];
      const discountType = this.orderDiscountType[this.tableId];

      for (let item in localOrderList) {
        localOrderList[item]["total_amount"] =
          this.orderTotalAmount[this.tableId];

        // Apply discount
        // In case the discount type is percentage then calculate the line_item_total price.
        if (discountType == 2) {
          localOrderList[item]["line_item_total"] =
            localOrderList[item]["line_item_total"] *
            (1 -
              parseFloat(
                this.orderDiscount[this.tableId]
                  ? this.orderDiscount[this.tableId]
                  : 0
              ) /
                100);
        }

        localOrderList[item].order_modifiers = localOrderList[
          item
        ].modifiers.map((modifier) => ({
          restaurant_product_modifier_id: parseFloat(modifier.id),
          price: parseFloat(modifier.price),
        }));

        delete localOrderList[item].name;
        delete localOrderList[item].category_id;
        delete localOrderList[item].modifiers;
      }

      let data = {
        restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
        total_amount: this.orderTotalAmount[this.tableId],
        status: 1,
        order_type:
          this.restaurantMode == "TAKEAWAY"
            ? this.orderTypes["takeaway"].id
            : this.restaurantMode == "DINEINN"
            ? this.orderTypes["dine in"].id
            : this.orderTypes["delivery"].id,
        order_line_items: [...localOrderList],
        order_payment_methods: [...this.orderPayments[this.tableId]],
        surcharge_amount: parseFloat(this.orderSurchargeAmount[this.tableId]),
        discount: parseFloat(this.orderDiscount[this.tableId]),
        discount_reason: this.orderDiscountReason[this.tableId],
        discount_type: this.orderDiscountType[this.tableId]
          ? parseInt(this.orderDiscountType[this.tableId])
          : undefined, // Percentage for now
        surcharge_type: this.orderSurchargeType[this.tableId]
          ? parseInt(this.orderSurchargeType[this.tableId])
          : undefined, // Percentage for now
        note: this.note,
        delivery_time: this.deliverTime ? this.deliverTime.value : undefined,
        waiting_time: this.waitingTime ? this.waitingTime.value : undefined,
        ordered_by: this.currentCustomer[this.tableId]
          ? this.currentCustomer[this.tableId].id
          : undefined,
        // surcharge_amount: this.tyroIntegratedSurcharge
        //   ? this.surchargeAmountFromTyro
        //   : 0.0,
        // by_card: this.paidByCard[this.tableId],
        // by_cash: this.paidByCash[this.tableId],
      };
      this.createOrder(data)
        .then((response) => {
          // this.transactionNo = response.data.data.order.order_uniqueid;
          //this.printOrder();

          this.$store.commit("orders/DELETE_PAID_ORDER", {
            activeTableId: this.tableId,
          });

          this.$store.commit(
            "orders/CHECK_IF_CONTAINS_COFFEE",
            { activeTableId: this.tableId, val: 0 },
            { root: true }
          );
          this.$store.commit(
            "orders/CHECK_IF_CONTAINS_INTERNAL_PRODUCT",
            { activeTableId: this.tableId, val: 0 },
            { root: true }
          );
          this.$store.commit(
            "customers/SET_CURRENT_CUSTOMER",
            {
              activeTableId: this.tableId,
              customer_rec: this.guestCustomer,
            },
            { root: true }
          );
          this.$store.commit(
            "orders/DELETE_PAID_BY_CASH_INSTANCE",
            this.tableId
          );
          this.$store.commit(
            "orders/DELETE_PAID_BY_CARD_INSTANCE",
            this.tableId
          );
          this.$store.commit("orders/REMOVE_ASSIGNED_STAFF_TO_TABLE", {
            activeTableId: this.tableId,
          });
        })
        .finally(() => {
          this.onOrderCompleteCallback();
        });
    },
  },
  watch: {
    deliverTime: function (newVal, oldVal) {
      if (newVal && newVal.value) {
        this.disableWaitingTime = true;
      } else {
        this.disableWaitingTime = false;
      }
    },
    waitingTime: function (newVal, oldVal) {
      if (newVal && newVal.value) {
        this.disableDeliverTime = true;
      } else {
        this.disableDeliverTime = false;
      }
    },
  },
  created() {
    this.tableId =
      this.restaurantMode == "TAKEAWAY" ? "Takeaway" : this.activeTableId.name;
    this.totalPayment = this.orderTotalAmount[this.tableId];
    this.optionsToPrintFunc = {
      preview: false,
      silent: true,
      printerName: this.defaultPrinter.name,
      timeOutPerLine: 40000,
    };
    this.optionsToPrintCoffeeFunc = {
      preview: false,
      silent: true,
      printerName: this.defaultCoffeePrinter.name,
      timeOutPerLine: 40000,
    };
    let bill = [];
    let billCoffee = [];
    let i = 0;
    let cntCf = 0;

    for (this.orderListLength in this.orderList[this.tableId]) {
      if (
        this.categoryCoffee.some(
          (obj) =>
            obj ==
            this.orderList[this.tableId][this.orderListLength].category_id
        )
      ) {
        cntCf++;
        billCoffee.push(
          "<div style='width:100%; max-width: 100%; font-weight: bold; margin-top: 10px; margin-bottom: 5px;'><div style='width: 70%; max-width: 70%; float: left; white-space: normal;'>" +
            this.orderList[this.tableId][this.orderListLength].quantity +
          " X " +
          this.orderList[this.tableId][this.orderListLength].name +
          "</div><div style='width: 30%; text-align: right; float: right;'> $" +
          parseFloat(
            this.orderList[this.tableId][this.orderListLength].line_item_total
          ).toFixed(2) +
          "</div></div>"
        );
        for (let modifier of this.orderList[this.tableId][this.orderListLength]
          .modifiers) {
            billCoffee.push(
            "<div style='width:100%; display:flex; justify-content: space-between; padding: 0px 5px;'><span style='flex-grow: 0; flex-shrink: 0'>" +
              modifier.modifiers.modifier +
              "</span><span style='flex-grow: 0; flex-shrink: 0; padding-right: 5px;'> $" +
              parseFloat(modifier.price).toFixed(2) +
              "</span></div>"
          );
        }
      }
      bill.push(
        "<div style='width:100%; max-width: 100%; font-weight: bold; margin-top: 10px; margin-bottom: 5px;'><div style='width: 70%; max-width: 70%; float: left; white-space: normal;'>" +
          this.orderList[this.tableId][this.orderListLength].quantity +
          " X " +
          this.orderList[this.tableId][this.orderListLength].name +
          "</div><div style='width: 30%; text-align: right; float: right;'> $" +
          parseFloat(
            this.orderList[this.tableId][this.orderListLength].line_item_total
          ).toFixed(2) +
          "</div></div>"
      );
      for (let modifier of this.orderList[this.tableId][this.orderListLength]
        .modifiers) {
        bill.push(
          "<div style='width:100%; display:flex; justify-content: space-between; padding: 0px 5px;'><span style='flex-grow: 0; flex-shrink: 0'>" +
            modifier.modifiers.modifier +
            "</span><span style='flex-grow: 0; flex-shrink: 0; padding-right: 5px;'> $" +
            parseFloat(modifier.price).toFixed(2) +
            "</span></div>"
        );
      }

      i++;
    }
    this.billList = bill.join("");
    this.billListCoffee = cntCf != 0 ? billCoffee.join("") : null;
    this.orderListLength = i;
    this.gst =
      this.otherPaymentDetails.gstRatio == 0
        ? 0
        : parseFloat(
            this.totalPayment / this.otherPaymentDetails.gstRatio
          ).toFixed(2);
  },
  components: { OrderLineItems },
};
</script>
