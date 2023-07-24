<template>
  <div>
    <!-- <div class="row q-mt-none q-pt-none q-mb-md">
      <div class="col col-12 text-h6 text-center bg-primary text-white">
        {{title}}
      </div>
    </div> -->
    <div class="text-center">
      <form @submit.prevent="onSubmit" style="width: 350px">
        <q-input
          outlined
          label="Username*"
          ref="userNameRef"
          v-model="username"
          :rules="[(val) => !!val || 'Username is required.']"
          class="q-mb-sm q-mx-xs"
          :disable="mode == 'authActiveUser'"
          :autofocus="mode !== 'authActiveUser'"
        ></q-input>
        <q-input
          outlined
          label="Password*"
          ref="pwdRef"
          v-model="user.password"
          :rules="[(val) => !!val || 'Password is required.']"
          class="q-mb-sm q-mx-xs"
          :type="showPwd ? 'text' : 'password'"
        >
          <template v-slot:append>
            <q-icon
              :name="!showPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn
          :label="task == 'writeOff' ? 'Write off' : 'Sign In'"
          type="submit"
          push
          class="full-width bg-white text-primary text-bold q-py-sm"
        />
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";
import notifications from "src/boot/notifications";
export default {
  props: ["mode", "task", "lineItemIndex"],
  data() {
    return {
      user: {
        username: null,
        password: null,
      },
      showPwd: false,
    };
  },
  computed: {
    ...mapState("orders", [
      "totalAmount",
      "orderList",
      "paidByCash",
      "paidByCard",
      "paymentMethods",
      "orderTotalAmount",
    ]),
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("settings", ["clientInformation"]),
    ...mapState("customers", ["currentCustomer", "guestCustomer"]),
    title() {
      return this.mode == "authActiveUser"
        ? "Authenticate Active User!"
        : this.mode == "witnessUser"
        ? "Authenticate Witness User!"
        : this.mode == "authAdmin"
        ? "Admin Authorization is Required!"
        : this.mode == "authSuperAdmin"
        ? "Store Admin Authorization is Required!"
        : "Login Details!";
    },
    username: {
      get() {
        return this.mode == "authActiveUser"
          ? this.activeTableId
          : this.user.username;
      },
      set(val) {
        this.user.username = val;
      },
    },
  },
  methods: {
    ...mapActions("storeUser", ["login", "authenticateUser"]),
    onSubmit() {
      this.user.username =
        this.mode == "authActiveUser"
          ? this.activeTableId.user.username
          : this.user.username;
      if (
        this.mode == "authActiveUser" ||
        this.mode == "authAdmin" ||
        this.mode == "witnessUser" ||
        this.mode == "authSuperAdmin"
      ) {
        if (
          this.mode == "witnessUser" &&
          this.activeTableId.user.username == this.user.username
        ) {
          notifications.failureNotify("Active user cannot be the witness!");
        } else {
          this.authenticateUser(this.user)
            .then((response) => {
              if (response.isAuthenticated) {
                if (this.mode == "authActiveUser") {
                  if (this.task == "cashUp" || this.task == "advanceCash") {
                    this.$emit("change", {
                      authDialog: false,
                      showFormDialog: true,
                    });
                  }
                } else if (this.mode == "authAdmin") {
                  //response.data.user_type_id !== 2
                  if (response.data.user.role_id !== 1) {
                    notifications.warningNotify("User is not Admin!");
                  } else {
                    if (this.task == "refundMoney") {
                      this.$emit("change", {
                        openPaymentOptionDailog: true,
                        signInDialog: false,
                      });
                    } else if (this.task == "operateSettings") {
                      this.$emit("change", {
                        adminAuth: true,
                        signInDialog: false,
                      });
                    }
                  }
                } else if (this.mode == "authSuperAdmin") {
                  //response.data.user_type_id !== 4
                  if (response.data.user.role_id !== 1) {
                    notifications.warningNotify("User is not Admin!");
                  } else if (this.task == "operateSettings") {
                    // this.$store.commit('storeUser/GET_STORE_ADMIN_TOKEN', response.data.access_token, {root: true})
                    this.$emit("change", {
                      adminAuth: true,
                      signInDialog: false,
                    });
                  }
                } else {
                  if (this.task == "cashUp" || this.task == "advanceCash") {
                    this.$emit("change", {
                      authDialog: false,
                      witnessUserDetails: response.data,
                    });
                  }
                }
              } else {
                notifications.failureNotify("Invalid credentials!");
              }
            })
            .catch((error) => {
              console.log(error);
              // notifications.failureNotify('Something went wrong! Please try again!')
            });
        }
      } else {
        this.login(this.user).then(() => {
          this.$emit("update:signInDialog", false);
        });
      }
    },
  },
  created() {},
};
</script>
