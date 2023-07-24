<template>
  <div class="q-pt-none">
    <div class="q-pt-none">
      <q-list
        class="q-pt-md bg-grey-3 q-px-sm row"
        :class="
          getSubMenu.length >= 12
            ? 'big-width'
            : getSubMenu.length >= 6
            ? 'mid-width'
            : 'small-width'
        "
        v-if="getSubMenu.length !== 0"
      >
        <div
          v-for="(item, ind) in getSubMenu"
          :key="ind"
          class="col q-px-md"
          :class="
            getSubMenu.length >= 12
              ? ['col-4', 'col-lg-3', 'q-m-sm']
              : getSubMenu.length >= 6
              ? ['col-6', 'col-lg-4', 'q-m-sm']
              : ['col-12', 'col-lg-6']
          "
        >
          <q-item
            clickable
            @click="openModifierDialog(item)"
            class="bg-white text-primary q-mb-md shadow-24 inset-shadow-down"
            style="border-radius: 10px; height: 90px"
          >
            <q-item-section thumbnail>
              <q-avatar size="90px" text-color="white">
                <q-img :src="getImg(item)" alt="" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="2">{{ itemName(item) }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label class="text-h6"
                >${{ itemPrice(item) }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </div>
      </q-list>

      <div class="text-h6 text-center" v-else>No items are available!</div>
    </div>
<!-- my code -->
    <q-dialog v-model="modifierDialog" persistent>
      <q-card style="min-width: 1100px; max-width: 1000px; width: 1000px">
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
import { mapActions, mapGetters, mapState } from "vuex";
import modifiers from "./modifiers.vue";
export default {
  components: { modifiers },
  props: ["category"],
  data() {
    return {
      serviceList: [],
      modifierDialog: false,
      productDetails: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("orders", [
      "orderList",
      "containsCoffee",
      "containsInternalProduct",
      "staffTableLink",
    ]),
    ...mapState("services", ["services", "categoryCoffee"]),
    ...mapState("settings", ["restaurantMode"]),
    ...mapState("common", ["attachments"]),
    ...mapState("products", [
      "restaurantProducts",
      "restaurantProductModifiers",
    ]),
    getSubMenu() {
      let temp = [];
      let tempServices = [];
      tempServices = [...this.serviceList];
      if ((this.services || this.restaurantProducts) && tempServices) {
        temp = tempServices
          .map((v) => {
            if (v.status == 1) {
              return v;
            }
          })
          .filter(Boolean);
      }
      return temp;
    },
  },
  created() {
    if (this.restaurantProducts && this.restaurantProducts.length !== 0) {
      this.serviceList = this.restaurantProducts
        .map((v) => {
          if (v.products.category_id == this.category.id) {
            if (v.status == 1) {
              return v;
            }
          }
        })
        .filter(Boolean);
    } else {
      this.serviceList = this.services
        .map((v) => {
          if (v.category_id == this.category.id) {
            if (v.status == 1) {
              return v;
            }
          }
        })
        .filter(Boolean);
    }
  },
  methods: {
    ...mapActions("common", ["getAttachments"]),
    ...mapActions("products", ["getRestaurantProductModifiers"]),
    updatedPrice(data) {
      this.modifierDialog = false;
      this.acceptSelectedItem(data.item, data.price, data.selectedModifiers);
    },
    openModifierDialog(item) {
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
          this.acceptSelectedItem(item, price);
        }
      });
    },
    getImg(prod) {
      let item = null;
      if (this.attachments && this.attachments.length != 0) {
        if (this.restaurantProducts && this.restaurantProducts.length !== 0) {
          item = this.attachments.find(
            (x) =>
              parseInt(x.module_type) == 2 && x.module_id == prod.product_id
          );
        } else {
          item = this.attachments.find(
            (x) => parseInt(x.module_type) == 2 && x.module_id == prod.id
          );
        }
      }
      return item ? item.upload_path : null;
    },
    itemName(item) {
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        return item.products.name;
      } else if (this.services && this.services.length != 0) {
        return item.name;
      } else {
        return null;
      }
    },
    itemPrice(item) {
      if (this.restaurantProducts && this.restaurantProducts.length != 0) {
        return item.price && item.price != ""
          ? item.price
          : item.products.price;
      } else if (this.services && this.services.length != 0) {
        return item.price;
      } else {
        return null;
      }
    },
    acceptSelectedItem(item, price, modifiers = []) {
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
          modifiers,
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
          modifiers,
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
    },
  },
};
</script>

<style scoped>
.big-width {
  width: 95vw !important;
}
.mid-width {
  width: 70vw !important;
}
.small-width {
  width: 50vw !important;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10000;
  background-color: white;
}
</style>
