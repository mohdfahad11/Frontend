<template>
  <div>
    <div class="row items-center full-width">
      <div class="col col-10">
        <div class="row">
          <!-- <div class="col col-4">
            <q-input
              outlined
              label="Customer Name"
              ref="receiptRef"
              v-model="orderLocal.customer_name"
              class="q-mb-sm q-mx-xs"
              clearable
              @keyup.enter="searchOrders"
            />
          </div> -->
          <!-- <div class="col col-3">
            <q-input
              outlined
              label="Last Name"
              ref="receiptRef"
              v-model="orderLocal.last_name"
              class="q-mb-sm q-mx-xs"
              clearable
              @keyup.enter="searchOrders"
            />
          </div> -->
          <div class="col col-6">
            <q-input
              outlined
              v-model="createdAtFrom"
              mask="date"
              label="From Date"
              class="q-mb-sm q-mx-xs"
              :key="fromDateKey"
              clearable
              @keyup.enter="searchOrders"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qFromDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="createdAtFrom"
                      @input="fromDateFunction"
                      :options="(date) => date <= currDate"
                    >
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col col-6">
            <q-input
              outlined
              v-model="createdAtTo"
              mask="date"
              label="To Date"
              class="q-mb-sm q-mx-xs"
              :key="toDateKey"
              clearable
              @keyup.enter="searchOrders"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qToDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="createdAtTo"
                      @input="toDateFunction"
                      :options="(date) => date <= currDate"
                    >
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <div class="col col-2 text-right q-mb-sm">
        <q-btn color="primary" @click="searchOrders">
          <q-icon name="search" class="q-py-sm" />
        </q-btn>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col col-12 q-pa-xs">
        <FilteredOrderTable
          @callSearch="callSearchForMoreData"
          @getOrderDetails="getOrderDetails"
        />
      </div>
    </div>
    <div class="row">
      <div class="col col-6 q-pa-xs">
        <q-btn
          push
          label="Print"
          @click="printRec"
          class="full-width text-bold bg-white text-primary q-py-sm"
          :disable="!orderDetails"
        />
      </div>
      <div class="col col-6 q-pa-xs">
        <q-btn
          push
          label="Refund"
          @click="refund"
          class="full-width text-bold bg-white text-red q-py-sm"
          :disable="!orderDetails || this.orderDetails.discount !== null"
        />
      </div>
    </div>

    <q-dialog v-model="signInDialog" persistent>
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
            @change="adminIsAuthenticated"
            :mode="'authAdmin'"
            :task="'refundMoney'"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="paymentOptionDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders">
              Order Id: {{ orderDetails ? orderDetails.id : null }}
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
        <q-card-section class="row items-center">
          <PaymentOptionsVue
            @change="closeAllDialogs"
            :mode="'REFUND'"
            :orderLineItemList="
              orderDetails ? [...orderDetails.order_line_items] : null
            "
            :surchargeAmount="
              orderDetails ? orderDetails.surcharge_amount : null
            "
            :refundOrderId="orderDetails ? orderDetails.id : null"
            :paymentOptionDialog.sync="paymentOptionDialog"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import loginForm from "../sign-in-out/LoginForm.vue";
import PaymentOptionsVue from "../payment/PaymentOptions.vue";
import FilteredOrderTable from "./FilteredOrdersTable.vue";
import notifications from "src/boot/notifications";
import moment from "moment";

export default {
  components: { loginForm, PaymentOptionsVue, FilteredOrderTable },
  data() {
    return {
      searchOrderInput: null,
      signInDialog: false,
      paymentOptionDialog: false,
      orderLocal: {},
      fromDateKey: 0,
      toDateKey: 0,
      orderDetails: null,
      billList: [],
      createdAtFrom: null,
      createdAtTo: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["loggedInStoreUsers"]),
    ...mapState("orders", ["orders", "totalOrders"]),
    ...mapState("settings", [
      "tyroIntegratedReceipt",
      "tyroIntegratedSurcharge",
      "tyroPosProductInfo",
      "defaultCoffeePrinter",
      "clientInformation",
    ]),
    ...mapState("customers", ["currentCustomer", "guestCustomer"]),
    olderReceiptPaidByCash() {
      let sum = 0;
      if (this.orderDetails) {
        for (let i in this.orderDetails.order_payment_methods) {
          if (
            this.orderDetails.order_payment_methods[i].payment_methods.method ==
            "Cash"
          ) {
            sum += parseFloat(this.orderDetails.order_payment_methods[i].amount_paid);
          }
        }
      }
      return sum;
    },
    olderReceiptPaidByCard() {
      let sum = 0;
      if (this.orderDetails) {
        for (let i in this.orderDetails.order_payment_methods) {
          if (
            this.orderDetails.order_payment_methods[i].payment_methods.method ==
            "Card"
          ) {
            sum += parseFloat(this.orderDetails.order_payment_methods[i].amount_paid);
          }
        }
      }
      return sum;
    },

    currDate() {
      return moment(new Date()).format("YYYY/MM/DD");
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
    receiptByPos() {
      let totalAmount = this.orderDetails ? this.orderDetails.total_amount : 0;
      // let createdBy = this.orderDetails
      //   ? this.orderDetails.created_by.store_user_fname +
      //     " " +
      //     this.orderDetails.created_by.store_user_lname
      //   : "";
      let lineItems = this.orderDetails
        ? this.orderDetails.order_line_items.length
        : 0;
      let today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let ordedrId = this.orderDetails ? this.orderDetails.id : null;
      return (
        "<div style='margin-left: 14px;font-weight: bold; width:200px;font-size: 13px;'><div style='text-align:center'><span>" +
        this.posProductInfo.siteReference +
        " \nTax Invoice \nABN: " +
        process.env.RESTAURANT_ABN_NUMBER +
        " \n" +
        this.tyroPosProductInfo.addressLine1 +
        " \n" +
        this.tyroPosProductInfo.addressLine2 +
        "\n Phone No.: 03 9309 3323 \n" +
        " \n</span></div><div style='width:100%;font-weight: bold; border-bottom: dashed 1px; display:flex; justify-content: space-between'><span style='text-align:left'>Item Name</span><span>Price</span></div>" +
        this.billList +
        "\n<div style='width:100%; display:flex;font-weight: bold; justify-content: space-between;><span style='text-align:left'>TOTAL</span><span>$" +
        totalAmount +
        "</span></div>\n<div style='width:100%;font-weight: bold; display:flex; justify-content: space-between'><span style='text-align:left'>Card</span><span>$" +
        this.olderReceiptPaidByCard +
        "</span></div><div style='width:100%;font-weight: bold; display:flex; justify-content: space-between'><span style='text-align:left'>Cash</span><span>$" +
        this.olderReceiptPaidByCash +
        "</span></div>" +
        " \nLine Item: " +
        lineItems +
        "\nTransaction Id: " +
        ordedrId +
        " \nDATE: " +
        today +
        "<div style='font-weight: bold; text-align:center; maring-top:5px;margin-bottom:7px;'>\nThank you for your order!\n" +
        "</div></div>"
      );
    },
  },
  methods: {
    ...mapActions("orders", ["getPreviousOrders"]),
    getOrderDetails(data) {
      this.orderDetails = data.order;
      this.billList = data.billList;
    },
    printRec() {
      this.printReceiptFun("<pre>" + this.receiptByPos + "</pre>");
    },
    async printReceiptFun(printContent) {
      if (window) {
        await window.cashDrawer.printReceiptFun(
          this.optionsToPrintFunc,
          printContent
        );
      }
    },
    adminIsAuthenticated(data) {
      this.paymentOptionDialog = data.openPaymentOptionDailog;
      this.signInDialog = data.signInDialog;
    },
    closeAllDialogs(data) {
      this.paymentOptionDialog = data.openPaymentOptionDailog;
      this.$emit("update:itemReceiptSearch", data.itemReceiptSearch);
    },
    searchOrders() {
      this.orderLocal.per_page = 10;
      this.orderLocal.page = 1;
      this.orderLocal.created_at_from = this.createdAtFrom
        ? moment(this.createdAtFrom).format("MM-DD-YYYY")
        : null;
      this.orderLocal.created_at_to = this.createdAtTo
        ? moment(this.createdAtTo).format("MM-DD-YYYY")
        : null;
      this.$store.commit("orders/GET_ORDERS", [], { root: true });
      this.getPreviousOrders(this.orderLocal);
    },
    fromDateFunction() {
      this.$refs.qFromDateProxy.hide();
      this.fromDateKey++;
    },
    toDateFunction() {
      this.$refs.qToDateProxy.hide();
      this.toDateKey++;
    },
    callSearchForMoreData(data) {
      this.orderLocal.created_at_from = this.createdAtFrom
        ? moment(this.createdAtFrom).format("MM-DD-YYYY")
        : null;
      this.orderLocal.created_at_to = this.createdAtTo
        ? moment(this.createdAtTo).format("MM-DD-YYYY")
        : null;
      this.orderLocal.page += 1;
      if (this.orders.length < this.totalOrders) {
        this.getPreviousOrders(this.orderLocal);
      }
    },
    refund() {
      this.signInDialog = true;
    },
  },
  created() {
    this.orderLocal.per_page = 10;

    this.optionsToPrintFunc = {
      preview: false,
      silent: true,
      printerName: this.defaultCoffeePrinter.name,
      timeOutPerLine: 40000,
    };
  },
};
</script>
