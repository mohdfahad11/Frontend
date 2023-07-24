<template>
  <div class="q-px-sm q-py-sm">
    <div class="shadow-20">
      <div class="flex justify-between row no-wrap bg-white q-pa-sm">
        <div class="row no-wrap items-center justify-start">
          <q-icon
            :name="
              restaurantMode == 'TAKEAWAY'
                ? 'shopping_basket'
                : 'mdi-table-chair'
            "
            size="sm"
          />
          <q-btn
            flat
            no-caps
            color="primary"
            class="text-h4"
            padding="0"
            @click="openTablesList"
          >
            {{
              restaurantMode == "TAKEAWAY"
                ? "Takeaway"
                : activeTableId && activeTableId != null
                ? activeTableId.name
                : "Table No"
            }}
          </q-btn>
        </div>
        <q-btn
          flat
          no-caps
          color="primary"
          class="text-primary"
          @click="showTables = true"
          v-if="restaurantMode == 'DINEINN'"
        >
          {{
            staffTableLink &&
            activeTableId &&
            staffTableLink[activeTableId.name]
              ? staffTableLink[activeTableId.name].name
              : "Assign attendant"
          }}
        </q-btn>
        <div>
          <q-btn
            flat
            no-caps
            color="primary"
            class="text-primary"
            @click="openCustomerDialog"
          >
            {{
              Object.keys(currentCustomer).length
                ? currentCustomer[orderReference]
                  ? currentCustomer[orderReference].name
                  : "Guest"
                : "Guest"
            }}
          </q-btn>
        </div>
      </div>
      <q-markup-table dense style="height: 37vh" class="bg-white">
        <tbody
          class="text-black"
          v-if="orderList && orderReference && orderList[orderReference]"
        >
          <tr
            v-for="(lineItem, ind) in orderList[orderReference]"
            :key="ind"
            class="cursor-pointer q-pa-md"
            @click="lineItemActions(ind)"
          >
            <td class="text-left">
              <span class="text-bold">{{ lineItem.name }} </span> <br />
              (${{ parseFloat(lineItem.price).toFixed(2) }})

              <div v-for="(modifier, index) in lineItem.modifiers" :key="index">
                <template
                  v-if="
                    modifier &&
                    modifier.modifiers &&
                    modifier.modifiers.modifier
                  "
                >
                  {{ modifier.modifiers.modifier }} (${{ modifier.price }})
                </template>
              </div>
            </td>
            <td class="text-right">
              <span class="bg-grey-11 q-pa-md"> {{ lineItem.quantity }} </span>
            </td>
            <td class="text-right">
              ${{ parseFloat(lineItem.line_item_total).toFixed(2) }}
            </td>
            <td class="text-right">
              <q-btn
                round
                color="red"
                icon="delete"
                size="xs"
                :flat="true"
                @click.stop="confirmItemDeletion(lineItem, ind)"
              />
            </td>
          </tr>

          <tr v-if="orderDiscount[orderReference]">
            <td class="text-left col-10">Discount applied:</td>
            <td></td>
            <td
              class="text-right"
              v-if="orderDiscountType[orderReference] == 1"
            >
              ${{ orderDiscount[orderReference] }}
            </td>
            <td
              class="text-right"
              v-if="orderDiscountType[orderReference] == 2"
            >
              {{ orderDiscount[orderReference] }}%
            </td>
            <td class="text-right">
              <q-btn
                round
                color="red"
                icon="close"
                :dense="true"
                size="sm"
                @click="removeOrderDiscount"
                :flat="true"
              />
            </td>
          </tr>
          <tr v-if="orderSurchargeAmount[orderReference]">
            <td class="text-left">Surcharge Amount:</td>
            <td></td>
            <td
              class="text-right"
              v-if="orderSurchargeType[orderReference] == 1"
            >
              ${{ orderSurchargeAmount[orderReference] }}
            </td>
            <td
              class="text-right"
              v-if="orderSurchargeType[orderReference] == 2"
            >
              {{ orderSurchargeAmount[orderReference] }}%
            </td>
            <td class="text-right">
              <q-btn
                round
                color="red"
                icon="close"
                :dense="true"
                @click="removeSurchargeAmount"
                size="sm"
                :flat="true"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="row q-my-sm">
        <div class="col-4 q-px-sm">
          <q-btn
            label="Discount"
            color="primary"
            class="full-width"
            @click="openDiscountModal"
          />
        </div>
        <div class="col-5 q-px-sm">
          <q-btn
            label="Surcharge"
            color="primary"
            class="full-width"
            size="sm"
            @click="surchargeAmountDialog = true"
            :disable="noAmount"
          />
        </div>
        <div class="col-3 q-px-sm">
          <q-btn
            label="Save"
            color="primary"
            class="full-width"
            size="sm"
            @click="saveCurrentOrder"
            :disable="noAmount || restaurantMode == 'DINEINN'"
          />
        </div>
      </div>

      <div class="bg-primary text-center text-white q-py-sm">
        <span class="text-h6">Total: </span>
        <span class="text-h6 text-right"
          >${{
            parseFloat(
              orderReference && totalAmount[orderReference]
                ? totalAmount[orderReference]
                : 0
            ).toFixed(2)
          }}</span
        >
      </div>
    </div>

    <q-dialog v-model="discountCouponDialog" persistent :key="discountModalKey">
      <q-card>
        <q-card-section class="items-center q-pb-none">
          <div class="row">
            <h6 class="col-12 text-primary q-my-none q-px-sm">
              Select Discount Coupon
            </h6>
            <div
              class="col col-4 q-pa-sm"
              v-for="item in availableDiscountArray"
              :key="item.index"
            >
              <q-btn
                class="full-width"
                :outline="
                  orderDiscountToApply != item.value || discountType != 1
                "
                color="primary"
                @click="applyOrderDiscount(item, 1)"
              >
                ${{ item.value }}
              </q-btn>
            </div>
            <div class="col-12 q-pa-sm">
              <hr />
            </div>
            <div
              class="col col-4 q-pa-sm"
              v-for="item in availableDiscountArray"
              :key="item.index"
            >
              <q-btn
                class="full-width"
                :outline="
                  orderDiscountToApply != item.value || discountType != 2
                "
                color="primary"
                @click="applyOrderDiscount(item, 2)"
              >
                {{ item.value }}%
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="items-center q-pb-none q-px-lg">
          <q-input
            v-model="discountReason"
            label="Discount Reason"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Save"
            color="primary"
            v-close-popup
            @click="saveOrderDiscount()"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="surchargeAmountDialog" persistent>
      <q-card>
        <q-card-section class="items-center q-pb-none">
          <div class="row">
            <h6 class="col-12 text-primary q-my-none q-px-sm">
              Select Surcharge
            </h6>
            <div
              class="col col-4 q-pa-sm"
              v-for="item in availableSurchargeArray"
              :key="item.id"
            >
              <q-btn
                class="full-width"
                color="primary"
                @click="applySurchargeAmount(item, 1)"
                :outline="
                  orderSurchargeAmountToAppy != item.value || surchargeType != 1
                "
              >
                ${{ item.value }}
              </q-btn>
            </div>

            <div class="col-12">
              <hr />
            </div>

            <div
              class="col col-4 q-pa-sm"
              v-for="item in availableSurchargeArray"
              :key="item.id"
            >
              <q-btn
                class="full-width"
                color="primary"
                @click="applySurchargeAmount(item, 2)"
                :outline="
                  orderSurchargeAmountToAppy != item.value || surchargeType != 2
                "
              >
                {{ item.value }}%
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="displayConfirmLineItemDeletionDialog"
      persistent
      v-if="lineItemToDelete"
    >
      <q-card>
        <q-card-section>
          <span class="text-h6"
            >Are you sure you want to delete the item
            <strong>{{ lineItemToDelete.name }}</strong
            >?</span
          >
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            push
            label="Yes"
            class="bg-white text-green text-bold q-py-sm q-mr-xl"
            @click="deleteLineItem"
            v-close-popup
          />
          <q-btn
            push
            label="No"
            class="bg-white text-red text-bold q-py-sm"
            @click="displayConfirmLineItemDeletionDialog = false"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTables" persistent>
      <q-card style="min-width: 700px">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Table List </span>
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
        <q-card-section>
          <available-tables />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showSavedOrders"
      persistent
      v-if="Object.keys(savedOrders).length"
    >
      <q-card style="min-width: 700px">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Saved Orders </span>
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
        <q-card-section>
          <saved-orders @close-dialog="closeDialog"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="customerDialog" persistent>
      <q-card> 
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Customer </span>
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
          <SearchCustomer />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="actionsDialog" persistent>
      <q-card style="max-width: 380px" class="q-pa-none">
        <q-card-actions class="q-py-sm bg-primary">
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
        <q-card-actions class="q-pt-none">
          <LineItemActions
            :index="changeEmployeeItemIndex"
            :actionsDialog.sync="actionsDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SearchCustomer from "../customer/search-customer.vue";
import LineItemActions from "../orders/LineItemActions.vue";
import notifications from "src/boot/notifications";
import AvailableTables from "./AvailableTables.vue";
import SavedOrders from "./SavedOrders.vue";

export default {
  data() {
    return {
      lineItemToDelete: null,
      lineItemIndexToDelete: null,
      displayConfirmLineItemDeletionDialog: false,
      customerDialog: false,
      actionsDialog: false,
      changeEmployeeItemIndex: null,
      showSavedOrders: false,
      showTables: false,
      discountCouponDialog: false,
      surchargeAmountDialog: false,
      discountModalKey: false,
      orderSurchargeAmountToAppy: null,
      orderDiscountToApply: null,
      discountType: null,
      surchargeType: null,
      discountReason: null,
    };
  },
  components: { SearchCustomer, LineItemActions, AvailableTables, SavedOrders },
  computed: {
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers"]),
    ...mapState("orders", [
      "orderList",
      "totalAmount",
      "staffTableLink",
      "orderDiscount",
      "orderDiscountType",
      "orderDiscountReason",
      "orderSurchargeAmount",
      "orderSurchargeType",
      "savedOrders",
    ]),
    ...mapState("customers", ["currentCustomer"]),
    ...mapState("settings", ["restaurantMode"]),
    orderReference() {
      return this.restaurantMode == "TAKEAWAY"
        ? "Takeaway"
        : !this.activeTableId || this.activeTableId == {}
        ? null
        : this.activeTableId.name;
    },
    noAmount() {
      return (
        !this.totalAmount[this.orderReference] ||
        this.totalAmount[this.orderReference] == 0
      );
    },
    availableDiscountArray() {
      return [
        { id: 1, value: "5" },
        { id: 2, value: "10" },
        { id: 3, value: "15" },
        { id: 4, value: "25" },
        { id: 4, value: "40" },
        { id: 5, value: "50" },
      ];
    },
    availableSurchargeArray() {
      return [
        { id: 1, value: "5" },
        { id: 2, value: "10" },
        { id: 3, value: "20" },
        { id: 4, value: "30" },
        { id: 5, value: "40" },
      ];
    },
  },
  methods: {
    lineItemActions(ind) {
      this.changeEmployeeItemIndex = ind;
      this.actionsDialog = true;
    },
    openTablesList() {
      if (Object.keys(this.loggedInStoreUsers).length == 0) {
        notifications.warningNotify("Please sign in to Continue with the app!");
      } else {
        if (this.restaurantMode == "DINEINN") {
          this.showTables = true;
        } else if (this.restaurantMode == "TAKEAWAY") {
          this.showSavedOrders = true;
        }
      }
    },
    closeDialog(value) {
      this.showSavedOrders = value;
    },
    confirmItemDeletion(lineItemToDelete, lineItemIndex) {
      this.lineItemToDelete = lineItemToDelete;
      this.lineItemIndexToDelete = lineItemIndex;
      this.displayConfirmLineItemDeletionDialog = true;
    },
    deleteLineItem() {
      this.$store.commit("orders/REMOVE_ADDED_LINE_ITEM", {
        activeTableId: this.orderReference,
        record: this.lineItemToDelete,
        index: this.lineItemIndexToDelete,
      });

      this.lineItemToDelete = null;
      this.lineItemIndexToDelete = null;
      this.displayConfirmLineItemDeletionDialog = false;
    },
    applyOrderDiscount(item, orderType) {
      if (item) {
        this.orderDiscountToApply = item.value;
        this.discountType = orderType;
      }
    },
    saveOrderDiscount() {
      this.discountCouponDialog = false;
      console.log({ checkDisc: this.orderDiscountToApply });
      this.$store.commit(
        "orders/SET_ORDER_DISCOUNT",
        {
          activeTableId: this.orderReference,
          orderDiscount: this.orderDiscountToApply,
          orderDiscountType: this.discountType,
          discountReason: this.discountReason,
        },
        { root: true }
      );
      this.discountModalKey = this.discountModalKey + 1;
    },
    applySurchargeAmount(item, surchargeType) {
      if (item) {
        this.surchargeAmountDialog = false;
        this.orderSurchargeAmountToAppy = item.value;
        this.surchargeType = surchargeType;
        this.$store.commit(
          "orders/SET_ORDER_SURCHARGE_AMOUNT",
          {
            activeTableId: this.orderReference,
            orderSurchargeAmount: this.orderSurchargeAmountToAppy,
            orderSurchargeType: surchargeType,
          },
          { root: true }
        );
      }
    },
    removeOrderDiscount() {
      this.orderDiscountToApply = null;

      this.$store.commit(
        "orders/REMOVE_ORDER_DISCOUNT",
        {
          activeTableId: this.orderReference,
        },
        { root: true }
      );
    },
    removeSurchargeAmount() {
      this.orderSurchargeAmountToAppy = null;

      this.$store.commit(
        "orders/REMOVE_ORDER_SURCHARGE_AMOUNT",
        {
          activeTableId: this.orderReference,
        },
        { root: true }
      );
    },
    openCustomerDialog() {
      if (Object.keys(this.loggedInStoreUsers).length == 0) {
        notifications.warningNotify("Please sign in to Continue with the app!");
      } else {
        this.customerDialog = true;
      }
    },
    openDiscountModal() {
      this.discountCouponDialog = true;

      this.discountType = this.orderDiscountType[this.orderReference];
      this.surchargeType = this.orderSurchargeType[this.orderReference];
      this.discountReason = this.orderDiscountReason[this.orderReference];
      this.orderDiscountToApply = this.orderDiscount[this.orderReference];
    },
    saveCurrentOrder() {
      if (!Object.keys(this.currentCustomer).length) {
        return notifications.warningNotify(
          "Please select a customer to save the order"
        );
      }
      this.$store.commit(
        "orders/SAVE_CURRENT_ORDER",
        {
          activeTableId: this.orderReference,
        },
        { root: true }
      );
      this.$store.commit("orders/DELETE_PAID_ORDER", {
        activeTableId: this.orderReference,
      });
      notifications.successNotify("Order saved");
    },
  },
};
</script>

<style scoped>
.order-table-employee .q-field--dark {
  color: black !important;
}
.total-amount-class {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0px;
}
</style>
