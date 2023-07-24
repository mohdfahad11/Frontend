<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { Notify, Loading, QSpinnerRadio } from "quasar";
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      isOnLine: navigator.onLine,
      dismiss: () => void 0,
    };
  },
  computed: {
    ...mapState("storeUser", ["envVariable"]),
    ...mapState("settings", ["intervalTime"]),
    ...mapState("orders", ["pendingOrderList"]),
    interval() {
      return this.intervalTime.value * 60000;
    },
  },
  methods: {
    ...mapActions("storeUser", ["getEnvVariable"]),
    ...mapActions("common", [
      "getEntities",
      "getAttachments",
      "getRestaurantProducts",
    ]),
    ...mapActions("services", ["getCategories"]),
    ...mapActions("orders", ["createOrder"]),
    fetchData() {
      this.getEnvVariable({
        unique_id: process.env.RESTAURANT_UNIQUE_ID,
      }).then(() => {
        console.log(this.envVariable.restaurant_settings.restaurant_id);
        this.getEntities({
          per_page: 9999,
        });
        this.getAttachments();
        this.getRestaurantProducts({
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          per_page: 9999,
        });
        this.getCategories({
          per_page: 9999,
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
        });
      });
      // setTimeout(this.fetchData, this.interval);
    },
    createOrderForPendingOrders() {
      if (this.pendingOrderList != {}) {
        for (let i in this.pendingOrderList) {
          this.createOrder(this.pendingOrderList[i]).then((res) => {
            this.$store.commit(
              "orders/REMOVE_ORDER_FROM_PENDING_ORDER_LIST",
              this.pendingOrderList[i],
              { root: true }
            );
          });
        }
      }
    },
  },
  created() {
    this.fetchData();
    // setInterval(this.fetchData, 60000); // Refresh the listing in every 60 seconds

    Notify.setDefaults({
      badgeStyle: "opacity: 0",
      classes: "text-h6",
    });
  },
  mounted() {
    window.addEventListener("online", () => {
      this.isOnLine = true;
    });
    window.addEventListener("offline", () => {
      this.isOnLine = false;
    });
  },
  // watch: {
  //   isOnLine: function(newval, oldVal) {
  //     if(!newval) {
  //       Loading.show({
  //         spinner: QSpinnerRadio,
  //         spinnerSize: 100,
  //         message: "<span class='text-white bg-red text-h6'>Internet connection is lost! Wait for internet connection...</span>",
  //         html: true
  //       })
  //     }
  //     if(newval) {
  //       Loading.hide()
  //       this.createOrderForPendingOrders()
  //     }
  //   }
  // }
};
</script>
