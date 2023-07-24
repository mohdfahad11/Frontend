<template>
  <div class="row main-row-class">
    <div class="col col-8 q-pa-xs">
      <!-- <VariousOptions /> -->
      <more-options />

      <servicesCategory />
      <!-- <LoggedinUser class="logged-in-users-class" /> -->
    </div>
    <div class="col col-4 q-pa-xs">
      <ProductSearch />
      <OrderDetails class="q-mt-sm" />

      <PaymentProcess />
      <!-- <Test id="orderTable" /> -->
      <StoreUserLoginLogout class="loginout-class" />
    </div>

    <q-dialog v-model="goToSettingsDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <span class="q-ml-sm text-h6">
            Before starting please configure the application for smooth
            experience!
          </span>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn
            push
            label="Go To Settings"
            to="setting"
            class="bg-white text-primary q-py-sm"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="signInDialogButton" persistent>
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <span class="q-ml-sm text-h6">
            Login to start with the application!
          </span>
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn
            push
            label="Sign In"
            @click="signInDialog = true"
            class="bg-white text-primary q-py-sm"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="signInDialog" persistent>
      <q-card>
        <q-card-actions class="q-py-sm bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Login Details </span>
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
        <q-card-actions class="q-pt-md">
          <LoginFormVue
            :mode="'signIn'"
            :task="'signIn'"
            :signInDialog.sync="signInDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { colors } from "quasar";
import OrderDetails from "src/components/home/OrderDetails.vue";
import servicesCategory from "src/components/home/Categories.vue";
import ProductSearch from "src/components/home/product-search.vue";
import PaymentProcess from "src/components/home/PaymentProcess.vue";
import StoreUserLoginLogout from "src/components/home/LoginLogout.vue";
import { mapActions, mapState } from "vuex";
import MoreOptions from "src/components/home/MoreOptions.vue";
import LoginFormVue from "src/components/sign-in-out/LoginForm.vue";
export default {
  name: "IndexPage",
  data() {
    return {
      goToSettingsDialog: false,
      printerSettings: true,
      coffeeSettings: true,
      paymentGatewaySettings: true,
      generalSettings: true,
      signInDialogButton: false,
      signInDialog: false,
    };
  },
  components: {
    OrderDetails,
    servicesCategory,
    PaymentProcess,
    StoreUserLoginLogout,
    MoreOptions,
    LoginFormVue,
    ProductSearch,
  },
  computed: {
    ...mapState("storeUser", ["loggedInStoreUsers", "envVariable"]),
    ...mapState("customers", ["currentCustomer", "guestCustomer"]),
    ...mapState("settings", [
      "tyroPosProductInfo",
      "settingsMode",
      "restaurantTableList",
      "gatewaySettings",
      "posSettings",
    ]),
    ...mapState("orders", ["orderList", "containsCoffee"]),
    metaTitle() {
      let title;
      title =
        process.env.PRODUCT_NAME +
        " v" +
        process.env.PRODUCT_VERSION_NUMBER +
        " - " +
        process.env.SITE_REFERNCE;
      return title;
    },
  },
  created() {
    this.initApplication();
    this.checkIfSettingsConfigured();
  },
  methods: {
    ...mapActions("orders", ["getOrderTypes", "getPaymentMethods"]),
    ...mapActions("settings", [
      "getRestaurantSettings",
      "getGatewaySettings",
      "getRestaurantTables",
    ]),
    checkIfSettingsConfigured() {
      setTimeout(() => {
        if (
          !this.printerSettings ||
          !this.coffeeSettings ||
          this.restaurantTableList.length == 0 ||
          this.gatewaySettings.length == 0 ||
          !this.posSettings
        ) {
          this.goToSettingsDialog = true;
        }
        if (
          !this.loggedInStoreUsers ||
          Object.keys(this.loggedInStoreUsers).length == 0
        ) {
          this.signInDialogButton = true;
        }
      }, 3500);
    },
    initApplication() {
      const cashDrawerAPIPort = JSON.parse(
        localStorage.getItem("CashdrawerAPIPortLocalStorage")
      );

      let orderListLocal = JSON.parse(
        localStorage.getItem("OrderListLocalStorage")
      );
      let orderTypesLocal = JSON.parse(
        localStorage.getItem("OrderTypesLocalStorage")
      );
      let paymentMethodsLocal = JSON.parse(
        localStorage.getItem("PaymentMethodsLocalStorage")
      );
      let allSettings = JSON.parse(localStorage.getItem("SettingLocalStorage"));
      let gatewaySettings = JSON.parse(
        localStorage.getItem("GatewaySettingsLocalStorage")
      );
      let theme = JSON.parse(localStorage.getItem("ThemeLocalStorage"));
      let printerDetails = JSON.parse(
        localStorage.getItem("PrinterLocalStorage")
      );
      let activeTableIdLocal = JSON.parse(
        localStorage.getItem("ActiveTableIdLocalStorage")
      );
      let coffeeCategoryLocal = JSON.parse(
        localStorage.getItem("CategoryCoffeeLocalStorage")
      );
      let appliedOrderDiscountLocal = JSON.parse(
        localStorage.getItem("AppliedOrderDiscountLocalStorage")
      );
      let appliedOrderDiscountType = JSON.parse(
        localStorage.getItem("AppliedOrderDiscountTypeLocalStorage")
      );
      let appliedOrderSurchargeAmount = JSON.parse(
        localStorage.getItem("AppliedSurchargeAmountLocalStorage")
      );
      let appliedOrderSurchargeAmountType = JSON.parse(
        localStorage.getItem("AppliedSurchargeAmountTypeLocalStorage")
      );
      const savedOrders = JSON.parse(
        localStorage.getItem("SavedOrdersLocalStorage")
      );

      if (savedOrders) {
        this.$store.commit(
          "orders/SAVE_ALL_ORDERS_FROM_LOCALSTORAGE",
          {
            orders: savedOrders,
          },
          { root: true }
        );
      }

      if (appliedOrderDiscountType) {
        this.$store.commit(
          "orders/SET_ORDER_DISCOUNT_TYPES",
          appliedOrderDiscountType
        );
      }

      if (appliedOrderDiscountLocal) {
        this.$store.commit(
          "orders/SET_ORDER_DISCOUNTS",
          appliedOrderDiscountLocal
        );
      }

      if (appliedOrderSurchargeAmount) {
        this.$store.commit(
          "orders/SET_ORDER_SURCHARGE_AMOUNTS",
          appliedOrderSurchargeAmount
        );
      }

      if (appliedOrderSurchargeAmountType) {
        this.$store.commit(
          "orders/SET_ORDER_SURCHARGE_AMOUNT_TYPES",
          appliedOrderSurchargeAmountType
        );
      }

      printerDetails && printerDetails !== null && printerDetails !== {}
        ? this.$store.commit("settings/SET_DEFAULT_PRINTER", printerDetails)
        : (this.printerSettings = false);
      coffeeCategoryLocal && coffeeCategoryLocal !== null
        ? this.$store.commit(
            "services/SET_COFFEE_CATEGORIES",
            coffeeCategoryLocal
          )
        : (this.coffeeSettings = false);
      setTimeout(() => {
        this.getRestaurantTables({
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
        });
        orderListLocal
          ? this.$store.commit("orders/SET_ORDER_LIST", orderListLocal, {
              root: null,
            })
          : null;

        this.$store.commit(
          "settings/SET_CASHDRAWER_API_PORT",
          cashDrawerAPIPort ? cashDrawerAPIPort : 8080,
          {
            root: null,
          }
        );

        activeTableIdLocal
          ? this.$store.commit(
              "storeUser/SET_ACTIVE_TABLE_ID",
              activeTableIdLocal
            )
          : null;
        orderTypesLocal == null ? this.getOrderTypes() : null;
        paymentMethodsLocal == null ? this.getPaymentMethods() : null;
        allSettings == null
          ? this.getRestaurantSettings({
              restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
            }).catch((err) => {
              if (err && err.status == 404) {
                // this.goToSettingsDialog = true;
                this.$store.commit("settings/SET_SETTING_MODE", "CONFIG", {
                  root: true,
                });
              }
            })
          : null;
        gatewaySettings == null || gatewaySettings.length == 0
          ? this.getGatewaySettings({
              restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
            })
          : null;

        for (const key in this.restaurantTableList) {
          if (
            this.orderList.hasOwnProperty(this.restaurantTableList[key]["name"])
          ) {
            this.$store.commit(
              "orders/CHECK_IF_CONTAINS_COFFEE",
              {
                activeTableId: this.restaurantTableList[key]["name"],
                val: this.containsCoffee[this.restaurantTableList[key]["name"]],
              },
              { root: true }
            );
          } else {
            this.$store.commit(
              "orders/CHECK_IF_CONTAINS_COFFEE",
              { activeTableId: this.restaurantTableList[key]["name"], val: 0 },
              { root: true }
            );
          }
        }
      }, 3000);
      if (theme) {
        colors.setBrand("primary", theme.hex);
      } else {
        let colorTheme = {
          id: 3,
          label: "Button Blue (Default)",
          value: "blue-6",
          hex: "#2196F3",
        };
        this.$store.commit("settings/SET_THEME_COLOR", colorTheme);
      }
    },
  },
  meta() {
    return {
      title: this.metaTitle,
    };
  },
};
</script>

<style>
.q-layout {
  background: rgb(238, 238, 238);
}
.logged-in-users-class {
  position: absolute;
  bottom: 10px;
  width: 66%;
}
.loginout-class {
  position: absolute;
  bottom: 10px;
  width: 32%;
}
</style>
