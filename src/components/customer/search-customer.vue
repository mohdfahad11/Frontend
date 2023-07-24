<template>
  <div>
    <div class="row justify-center text-center">
      <q-select
        filled
        v-model="customerName"
        use-input
        input-debounce="0"
        label="Start typing here to search customer"
        :options="filterOptions"
        @filter="filterFn"
        class="full-width"
        :option-label="(item) => item.name + ' (' + item.phone_no + ')'"
        :option-value="(item) => item.name"
        style="min-width: 400px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row justify-between q-mt-xl text-center">
      <div class="col col-4 q-px-sm">
        <q-btn
          stack
          push
          class="full-width text-capitalize bg-white text-bold text-primary"
          @click="acceptCustomer"
          :disable="
            !customerName ||
            (currentCustomer &&
              currentCustomer[activeTableId] &&
              currentCustomer[activeTableId].id) == 0
          "
          v-close-popup
        >
          <q-icon name="check" />
          Accept
        </q-btn>
      </div>
      <div class="col col-4 q-px-sm">
        <q-btn
          stack
          push
          class="full-width text-capitalize bg-white text-bold text-primary"
          @click="viewOrEditCustomerDetails('EDIT')"
          :disable="
            !customerName ||
            (currentCustomer &&
              currentCustomer[activeTableId] &&
              currentCustomer[activeTableId].id) == 0
          "
        >
          <q-icon name="edit" />
          Edit
        </q-btn>
      </div>
      <div class="col col-4 q-px-sm">
        <q-btn
          stack
          push
          class="full-width text-capitalize bg-white text-bold text-primary"
          @click="addNewCustomer"
        >
          <q-icon name="person" />
          New
        </q-btn>
      </div>
      <!-- <div class="col col-3 q-px-sm">
        <q-btn
          stack
          push
          class="full-width text-capitalize bg-white text-bold text-primary"
          @click="viewOrEditCustomerDetails('VIEW')"
          :disable="!customerName || currentCustomer[activeTableId].id == 0"
        >
          <q-icon name="remove_red_eye" />
          Details
        </q-btn>
      </div> -->
    </div>

    <q-dialog v-model="customerDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders" v-if="mode === 'EDIT'">Edit Customer </span>
            <span class="q-px-sm rounded-borders" v-else>New Customer </span>
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
        <q-card-section class="row items-center q-pt-none">
          <CustomerRegistration
            :mode="mode"
            :customerDialog.sync="customerDialog"
            @update:customerDialog="fetchCustomerList()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import CustomerRegistration from "./customer-registration.vue";

export default {
  data() {
    return {
      customerName: {},
      mode: "ADD",
      customerDialog: false,
      customer: null,
      filterOptions: [],
    };
  },
  created() {
    this.fetchCustomerList();

    this.customerName =
      this.currentCustomer[this.activeTableId] == "Guest C"
        ? ""
        : this.currentCustomer[this.activeTableId];
  },
  computed: {
    ...mapState("settings", ["restaurantMode"]),
    ...mapGetters("customers", ["customers", "customerDetails"]),
    ...mapState("customers", ["currentCustomer"]),
    ...mapState("storeUser", ["activeTableId"]),
    tableId() {
      return this.restaurantMode == "TAKEAWAY"
        ? "Takeaway"
        : this.activeTableId.name;
    },
  },
  methods: {
    ...mapActions("customers", ["getCustomers", "getCustomerDetails"]),
    fetchCustomerList() {
      this.getCustomers({
        role: 3,
        per_page: 9999,
      });
    },
    filterFn(val, update) {
      this.filterOptions = [...this.customers];
      if (val === "") {
        update(() => {
          this.filterOptions = this.customers;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.filterOptions = this.customers.filter(
          (v) =>
            v.name.toLowerCase().indexOf(needle) == 0 ||
            v.phone_no.indexOf(needle) == 0
        );
      });
    },
    addNewCustomer() {
      this.mode = "ADD";
      this.customerDialog = true;
    },
    acceptCustomer() {
      this.$store.commit("customers/SET_CURRENT_CUSTOMER", {
        customer_rec: this.customerName,
        activeTableId: this.tableId,
      });
    },
    viewOrEditCustomerDetails(mode) {
      this.mode = mode;
      this.getCustomerDetails(this.customerName.id).then(() => {
        this.customerDialog = true;
      });
    },
  },
  components: { CustomerRegistration },
};
</script>
