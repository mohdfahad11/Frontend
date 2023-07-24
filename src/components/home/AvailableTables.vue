<template>
  <div class="row">
    <div class="col col-8">
      <div class="row" v-if="restaurantTables.length != 0">
        <q-item
          clickable
          v-ripple
          class="col col-3 q-pa-xs non-toggled-button"
          :class="
            orderList.hasOwnProperty(i.name)
              ? ['text-red', 'non-toggled-occupied-button']
              : ['text-primary', 'non-toggled-button']
          "
          v-for="i in restaurantTables"
          :key="i.id"
          :active="
            activeTableId &&
            activeTableId != 'Takeaway' &&
            activeTableId.id == i.id
          "
          @click="selectTable(i)"
          :active-class="
            orderList.hasOwnProperty(i.name)
              ? 'toggled-occupied-class'
              : 'toggled-button'
          "
          :exact-active-class="
            orderList.hasOwnProperty(i.name)
              ? 'toggled-occupied-class'
              : 'toggled-button'
          "
        >
          <q-item-section class="user-login text-center">
            {{ i.name }} <br />
            {{
              staffTableLink && staffTableLink[i]
                ? staffTableLink[i.name]
                : null
            }}
          </q-item-section>
        </q-item>
      </div>

      <div class="row" v-else>
        <div class="col col-12 text-center">
          <span class="text-h6">
            Create table list from the settings page!</span
          >
        </div>
        <div class="col col-12 text-center q-pt-sm">
          <q-btn
            color="primary"
            icon="settings"
            label="Settings"
            to="/setting"
            padding="15px"
            class="text-capitalize full-height"
          />
        </div>
      </div>
    </div>

    <div class="col col-4">
      <q-list class="q-pt-none q-px-sm row">
        <div
          v-for="(item, ind) in empOptions"
          :key="ind"
          class="col-12 q-px-md"
        >
          <q-item
            clickable
            @click="assignStaffToActiveTable(item)"
            class="bg-white text-primary q-mb-md shadow-24 inset-shadow-down"
            style="border-radius: 10px; height: 55px"
          >
            <q-item-section>
              <q-item-label lines="2">{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import notifications from "src/boot/notifications";
export default {
  data() {
    return {
      activeButton: {},
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers"]),
    ...mapState("settings", ["restaurantTableList"]),
    ...mapState("orders", ["orderList", "staffTableLink"]),
    empOptions() {
      let temp = [];
      let obj = {};
      for (let i in this.loggedInStoreUsers) {
        obj = {
          ...this.loggedInStoreUsers[i].user,
          token: this.loggedInStoreUsers[i].token,
        };
        temp.push(obj);
      }
      return temp;
    },
    restaurantTables() {
      let temp = [];
      if (this.restaurantTableList.length !== 0) {
        temp = this.restaurantTableList
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
  methods: {
    selectTable(i) {
      this.$store.commit("storeUser/SET_ACTIVE_TABLE_ID", i);
    },
    assignStaffToActiveTable(item) {
      if (!this.activeTableId || this.activeTableId == "Takeaway") {
        notifications.warningNotify("Please select table first!");
      } else {
        this.$store.commit("orders/ASSIGN_WAITER", {
          activeTableId: this.activeTableId.name,
          staffDetails: item,
        });
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.user-login {
  border: 0.2px solid var(--q-color-primary);
  border-radius: 5px;
  padding: 12px;
  /* color: $primary; */
}
.non-toggled-button {
  color: var(--q-color-primary);
}
.non-toggled-occupied-button {
  color: rgb(227, 77, 77);
  .user-login {
    border-color: rgb(227, 77, 77);
  }
}
.toggled-button {
  background-color: var(--q-color-primary);
  border: 4px solid rgb(238, 238, 238);
  border-radius: 5px;
  color: white !important;
  padding: 0px;
  // padding: 0px !important;
}

.toggled-occupied-class {
  background-color: rgb(227, 77, 77);
  border: 4px solid white;
  border-radius: 5px;
  color: white !important;
  padding: 0px;
  .user-login {
    border-color: rgb(227, 77, 77);
  }
}
</style>
