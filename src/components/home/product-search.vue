<template>
  <div class="q-mt-none">
    <div class="row items-center q-pt-xs">
      <!-- <div class="col col-4 ">

      </div> -->
      <div
        class="col col-12 col-lg-10"
        id="product-search"
        v-if="prodOption === 2"
      >
        <q-select
          name="model"
          behavior="menu"
          input-debounce="0"
          ref="prodSearch"
          v-model="product"
          label="Product Name"
          class="full-width"
          use-input
          hide-selected
          :key="entityKey"
          hide-dropdown-icon
          @filter="filterFn"
          @input="openModifierDialog()"
          :options="filterEntityOptions.value"
          :option-label="(item) => itemName(item)"
          :option-value="(item) => item.id"
          autofocus
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No products are available!
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:prepend>
            <q-btn-toggle
              v-model="prodOption"
              toggle-color="primary"
              :options="[
                { value: 1, slot: 'barcode' },
                { value: 2, slot: 'name' },
              ]"
            >
              <template v-slot:barcode>
                <q-icon name="mdi-barcode" class="q-py-xs" size="md" />
              </template>

              <template v-slot:name>
                <q-icon name="mdi-package-variant" class="q-py-xs" size="sm" />
              </template>
            </q-btn-toggle>
          </template>
        </q-select>
      </div>

      <div class="col col-12 col-lg-10" id="product-search" v-else>
        <q-input
          v-model="prodBarcode"
          type="text"
          label="Barcode"
          class="full-width"
          autofocus
          @keyup.enter="addItemToOrderList"
        >
          <template v-slot:prepend>
            <q-btn-toggle
              v-model="prodOption"
              toggle-color="primary"
              :options="[
                { value: 1, slot: 'barcode' },
                { value: 2, slot: 'name' },
              ]"
            >
              <template v-slot:barcode>
                <q-icon name="mdi-barcode" class="q-py-xs" size="md" />
              </template>

              <template v-slot:name>
                <q-icon name="mdi-package-variant" class="q-py-xs" size="sm" />
              </template>
            </q-btn-toggle>
          </template>
        </q-input>
      </div>
      <div class="col col-2 text-right q-px-sm gt-md">
        <q-btn color="primary" to="setting" class="text-capitalize">
          <q-icon name="settings" class="q-py-sm" size="sm" />
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="showNoInternalProduct" persistent>
      <q-card>
        <q-card-actions align="right">
          <div class="col col-12 text-right">
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
          You cannot add internal product if service is added!
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modifierDialog" persistent>
      <q-card
        style="min-width: 100%; max-width: max-content; width: max-content"
      >
        <q-card-actions
          class="bg-primary row items-center q-mx-none sticky-header"
          style=""
        >
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm q-py-sm rounded-borders"
              >{{ productDetails ? productDetails.products.name : null }}
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
        <q-card-actions>
          <modifiers
            :productDetails="productDetails"
            @updatePrice="updatedPrice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import notifications from "src/boot/notifications";
import modifiers from "../services-component/modifiers.vue";
export default {
  data() {
    return {
      product: "",
      prodOption: 1,
      code: "",
      dialog: false,
      cameraStatus: 0,
      filterEntityOptions: [],
      entityKey: 0,
      perPage: 9999,
      prodBarcode: null,
      barcodeProductItem: null,
      showNoInternalProduct: false,
      modifierDialog: false,
      productDetails: null,
    };
  },
  components: { modifiers },
  created() {
    this.getRestaurantProducts({
      restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
      per_page: 9999,
    });
    setTimeout(() => {
      if (this.restaurantProducts && this.restaurantProducts.length == 0) {
        this.getEntities({
          per_page: 9999,
        });
      }
    }, 2500);
  },
  computed: {
    ...mapState("orders", [
      "orderList",
      "containsCoffee",
      "containsInternalProduct",
      "staffTableLink",
    ]),
    ...mapState("services", ["services", "categoryCoffee"]),
    ...mapState("common", ["attachments"]),
    ...mapState("products", [
      "restaurantProducts",
      "restaurantProductModifiers",
    ]),
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers","envVariable"]),
    ...mapState("settings", ["clientInformation", "restaurantMode"]),
    products() {
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        return this.restaurantProducts;
      } else {
        return this.services;
      }
    },
  },
  methods: {
    ...mapActions("common", ["getEntities", "getRestaurantProducts"]),
    ...mapActions("products", ["getRestaurantProductModifiers"]),
    itemName(item) {
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        return item && item.products
          ? item.products.name +
              " ($" +
              (item.price ? item.price : item.products.price) +
              ")"
          : null;
      } else {
        return item.name + " ($" + item.price + ")";
      }
    },
    updatedPrice(data) {
      this.modifierDialog = false;
      this.acceptSelectedProduct(data.item, data.price);
    },
    openModifierDialog() {
      let item = this.prodOption == 1 ? this.barcodeProductItem : this.product;
      let price;
      this.getRestaurantProductModifiers({
        restaurant_product_id: parseInt(item.id),
        per_page: 99999,
        status: 1,
      }).then(() => {
        if (this.restaurantProductModifiers.length != 0) {
          this.modifierDialog = true;
          this.productDetails = Object.assign({}, item);
        } else {
          if (this.restaurantProducts && this.restaurantProducts.length != 0) {
            price =
              item.price && item.price != ""
                ? item.price * 1
                : item.products.price * 1;
          } else {
            price = item.price * 1;
          }
          this.acceptSelectedProduct(item, price);
        }
      });
    },
    addItemToOrderList() {
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        for (let i in this.restaurantProducts) {
          if (this.restaurantProducts[i].products.barcode == this.prodBarcode) {
            this.barcodeProductItem = this.restaurantProducts[i];
          }
        }
      } else {
        for (let i in this.services) {
          if (this.services[i].barcode == this.prodBarcode) {
            this.barcodeProductItem = this.services[i];
          }
        }
      }
      this.barcodeProductItem
        ? this.openModifierDialog()
        : notifications.warningNotify("Product is not available!");
    },

    acceptSelectedProduct(item, price) {
      let tempLineItem;
      let tableId =
        this.restaurantMode == "TAKEAWAY"
          ? "Takeaway"
          : this.activeTableId.name;
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        tempLineItem = {
          product_id: item.product_id,
          name: item.products.name,
          quantity: 1,
          price: price,
          line_item_total: 0,
          category_id: item.products.category_id,
          table_id:
            this.restaurantMode == "TAKEAWAY" ? null : this.activeTableId.id,
        };
      } else {
        tempLineItem = {
          product_id: item.id,
          name: item.name,
          quantity: 1,
          price: price,
          line_item_total: 0,
          category_id: item.category_id,
          table_id:
            this.restaurantMode == "TAKEAWAY" ? null : this.activeTableId.id,
        };
      }
      let i;
      this.$store.commit("orders/CHECK_IF_CONTAINS_COFFEE", {
        activeTableId: tableId,
        val: this.categoryCoffee.some((obj) => obj == tempLineItem.category_id)
          ? 1
          : this.containsCoffee[tableId],
      });
      // if(this.orderList[tableId] && this.orderList[tableId].length > 0) {
      //   for(i=0;i<this.orderList[tableId].length;i++) {
      //     if(this.orderList[tableId][i].product_id === tempLineItem.product_id) {
      //       let lineItemQuantity = this.orderList[tableId][i].quantity + 1
      //       this.$store.commit('orders/SET_QUANTITY',{activeTableId: tableId, index:i, quantity: lineItemQuantity})
      //       break;
      //     }
      //   }
      //   if(i === this.orderList[tableId].length) {
      //     this.$store.commit('orders/ADD_NEW_LINE_ITEM',{activeTableId: tableId, index: i, record: tempLineItem })
      //   }
      // }
      // else {
      //   this.$store.commit('orders/ADD_NEW_LINE_ITEM',{activeTableId: tableId, index: 0, record: tempLineItem })
      // }
      i = this.orderList[tableId] ? this.orderList[tableId].length : 0;
      this.$store.commit("orders/ADD_NEW_LINE_ITEM", {
        activeTableId: tableId,
        index: i,
        record: tempLineItem,
      });
      this.product = null;
      this.prodBarcode = null;
      this.barcodeProductItem = null;
    },
    filterFn(val, update) {
      this.product = null;
      this.filterEntityOptions = [...this.products];
      if (val === "") {
        update(() => {
          this.filterEntityOptions.value = this.products;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        if (this.restaurantProducts && this.restaurantProducts.length != 0) {
          this.filterEntityOptions.value = this.products.filter(
            (v) => v.products.name.toLowerCase().indexOf(needle) === 0
          );
        } else {
          this.filterEntityOptions.value = this.products.filter(
            (v) => v.name.toLowerCase().indexOf(needle) === 0
          );
        }
      });
    },
  },
};
</script>
