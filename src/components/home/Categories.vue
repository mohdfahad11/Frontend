<template>
  <div class="q-mt-sm border-container" style="height: 85vh">
    <q-scroll-area style="width: 100%; height: 100%">
      <div class="row">
        <div
          class="col col-4 col-md-3 col-lg-2"
          v-for="(cat, i) in categoryList"
          :key="i"
        >
          <q-card
            class="cat-card text-center q-ma-sm clickable cursor-pointer inset-shadow-down"
            @click="openSubMenu(cat)"
          >
            <q-avatar size="90px" text-color="white">
              <q-img :src="getImg(cat)" alt="" />
            </q-avatar>
            <q-card-section
              class="cat-name q-pa-xs text-black"
              style="
                white-space: nowrap;
                text-overflow: ellipsis;
                width: calc(100%);
                overflow: hidden;
              "
            >
              {{ cat.category }}
              <!-- <q-icon color="primary" name="content_cut" size="sm" /> -->
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
    <q-dialog v-model="subMenuDialog" persistent>
      <q-card
        style="
          min-width: max-content;
          max-width: max-content;
          width: max-content;
        "
      >
        <q-card-actions
          class="bg-primary row items-center q-mx-none sticky-header"
          style=""
        >
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm q-py-sm rounded-borders"
              >{{ category ? category.category : null }}
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
          <!-- <q-scroll-area style="width: 100%; height: 100%;"> -->
          <SubMenu :category="category" />
          <!-- </q-scroll-area> -->
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import SubMenu from "../services-component/SubMenu.vue";
import notifications from "src/boot/notifications";
export default {
  data() {
    return {
      subMenuDialog: false,
      category: null,
      serviceList: [],
      tableId: null,
    };
  },
  computed: {
    ...mapGetters("services", ["categories"]),
    ...mapState("settings", ["clientInformation", "restaurantMode"]),
    ...mapState("storeUser", [
      "loggedInStoreUsers",
      "activeTableId",
      "envVariable",
    ]),
    ...mapState("orders", ["orderList", "staffTableLink"]),
    ...mapState("common", ["attachments"]),
    ...mapState("products", ["restaurantProducts"]),
    categoryList() {
      let temp = [];
      if (this.restaurantProducts && this.restaurantProducts.length !== 0) {
        temp = this.categories
          .map((v) => {
            if (v.products && v.products.length != 0) {
              for (let i in v.products) {
                if (
                  v.products[i].restaurant_products &&
                  v.products[i].restaurant_products.length != 0
                ) {
                  return v;
                }
              }
            }
          })
          .filter(Boolean);
      } else {
        temp = this.categories
          .map((v) => {
            if (v.products && v.products.length != 0) {
              return v;
            }
          })
          .filter(Boolean);
      }

      return temp;
    },
  },
  created() {
    setTimeout(() => {
      !this.categories || this.categories.length == 0
        ? this.getCategories({
            per_page: 9999,
            restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          })
        : null;
      !this.services || this.services.length == 0
        ? this.getEntities({
            per_page: 9999,
          })
        : null;
      this.getAttachments();
      this.getRestaurantProducts({
        restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
        per_page: 9999,
      });
    }, 2500);
  },
  methods: {
    ...mapActions("services", ["getCategories"]),
    ...mapActions("common", [
      "getEntities",
      "getAttachments",
      "getRestaurantProducts",
    ]),

    getImg(cat) {
      let item = null;
      if (this.attachments && this.attachments.length != 0) {
        item = this.attachments.find(
          (x) => parseInt(x.module_type) == 1 && x.module_id == cat.id
        );
      }
      return item ? item.upload_path : null;
    },
    openSubMenu(cat) {
      if (this.restaurantMode == "DINEINN" && !this.activeTableId) {
        notifications.warningNotify(
          "Please select table and assign attendant to it first!"
        );
      } else {
        this.tableId =
          this.restaurantMode == "TAKEAWAY"
            ? "Takeaway"
            : this.activeTableId.name;
      }
      if (Object.keys(this.loggedInStoreUsers).length == 0) {
        notifications.warningNotify("Please sign in to Continue with the app!");
      } else if (
        this.restaurantMode == "DINEINN" &&
        !this.staffTableLink.hasOwnProperty(this.tableId)
      ) {
        notifications.warningNotify(
          "Please select table and assign attendant to it first!"
        );
      } else {
        this.category = JSON.parse(JSON.stringify(cat));
        this.subMenuDialog = true;
      }
    },
  },
  components: { SubMenu },
};
</script>

<style scoped>
.cat-card {
  background: rgb(255, 255, 255);
  font-size: 18px;
  height: 130px;
  position: relative;
}
.cat-name {
  width: 100%;
  position: absolute;
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%,-50%); */
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.service-section {
  height: 500px !important;
  overflow-y: scroll;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10000;
  background-color: white;
}
</style>
