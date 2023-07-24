<template>
  <div>
    <!-- <ValidationObserver v-slot="{handleSubmit}"> -->
    <form @submit.prevent="onSubmit" style="width: 500px">
      <div class="row q-pt-md">
        <div class="col col-12">
          <!-- <ValidationProvider
                name="First Name"
                rules="required"
                v-slot="v"
            > -->
          <q-input
            outlined
            label="Name*"
            ref="fnameRef"
            v-model="customer.name"
            :rules="[
              (val) => !!val || 'Name is required.',
              (val) => /^[a-zA-Z\s]+$/.test(val) || 'Name not valid',
              (val) =>
                (val && val.length <= 30) ||
                'Name must be less than 30 characters',
            ]"
            class="q-mb-sm q-mx-xs"
            :disable="mode === 'VIEW'"
            :autofocus="!mode === 'VIEW'"
          ></q-input>
          <!-- </ValidationProvider> -->
        </div>

        <div class="col col-6">
          <!-- <ValidationProvider
                name="phone No."
                rules="required|max:10"
                v-slot="v"
            > -->
          <q-input
            outlined
            label="Phone No.*"
            ref="phoneNoRef"
            v-model="customer.phone_no"
            :rules="[
              (v) => !!v || 'Phone no. is required',
              (v) => /^\d{10}$/.test(v) || 'Phone no. is not valid',
              (v) => (v && v.length == 10) || 'Phone no. must be of 10 digits',
            ]"
            class="q-mb-sm q-mx-xs"
            :disable="mode === 'VIEW'"
          ></q-input>
          <!-- </ValidationProvider> -->
        </div>

        <div class="col col-6">
          <!-- <ValidationProvider
                name="Email"
                rules="required|email"
                v-slot="v"
            > -->
          <q-input
            outlined
            label="Email"
            ref="emailRef"
            v-model="customer.email"
            :rules="[
              (v) => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]"
            class="q-mb-sm q-mx-xs"
            :disable="mode !== 'ADD'"
          ></q-input>
          <!-- </ValidationProvider> -->
        </div>
        <div class="col col-6">
          <q-input
            outlined
            v-model="customer.dob"
            mask="date"
            label="Birth Date"
            class="q-mx-xs"
            :disable="mode === 'VIEW'"
            placeholder="YYYY/MM/DD"
            :key="dateShowKey"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="customer.dob"
                    :disable="mode == 'VIEW'"
                    @input="dateFunction"
                    :options="(date) => date <= currDate"
                  >
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col col-6">
          <!-- <ValidationProvider
                name="Postcode"
                rules="required|max:4|number"
                v-slot="v"
            > -->
          <q-input
            outlined
            label="Postcode"
            ref="postcodeRef"
            v-model="customer.postcode"
            class="q-mb-xs q-mx-xs"
            :disable="mode === 'VIEW'"
          ></q-input>
          <!-- </ValidationProvider> -->
        </div>
        <div class="col col-12 flex no-wrap items-center q-mb-sm q-mx-xs">
          <span class="q-mr-sm">Gender:</span>
          <q-option-group
            v-model="customer.gender"
            :options="genderOptions"
            color="primary"
            inline
            left-label
            :disable="mode == 'VIEW'"
          />
        </div>
        <div class="col col-12 q-mb-sm q-ml-xs q-mr-md">
          <q-input
            v-model="customer.note"
            label="Note"
            filled
            type="textarea"
            :disable="mode === 'VIEW'"
          />
        </div>
        <div class="col col-12">
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
            class="full-width"
          />
        </div>
      </div>
    </form>
    <!-- </ValidationObserver> -->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import moment from "moment";
import notifications from "src/boot/notifications";

export default {
  props: ["mode"],
  data: () => {
    return {
      date: null,
      customer: {},
      dateShowKey: 0,
      defaultGender: null,
      genderOptions: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
      ],
      defaultPostcode: null,
    };
  },
  created() {
    console.log({ customerDetails: this.customerDetails });
    this.defaultGender =
      this.customer && this.customer.gender ? this.customer.gender : null;
    this.customer = this.mode == "ADD" ? {} : this.customerDetails;
    this.defaultPostcode =
      this.mode == "ADD" ? null : this.customerDetails.postcode;
  },
  computed: {
    ...mapState("storeUser", ["activeTableId"]),
    ...mapState("settings", ["clientInformation"]),
    ...mapGetters("customers", ["customerDetails"]),
    currDate() {
      return moment(new Date()).format("YYYY/MM/DD");
    },
    gender: {
      get() {
        return this.defaultGender;
      },
      set(val) {
        this.defaultGender = val;
      },
    },
    postcode: {
      get() {
        return this.defaultPostcode;
      },
      set(val) {
        this.defaultPostcode = val;
      },
    },
    isInvalidForm() {
      return (
        this.$refs.fnameRef.hasError ||
        this.$refs.phoneNoRef.hasError ||
        this.$refs.emailRef.hasError ||
        this.$refs.postcodeRef.hasError
      );
    },
  },
  methods: {
    ...mapActions("customers", ["registerCustomer", "updateCustomer"]),
    validateForm() {
      this.$refs.fnameRef.validate();
      this.$refs.phoneNoRef.validate();
      this.$refs.emailRef.validate();
      this.$refs.postcodeRef.validate();
    },
    onSubmit() {
      this.customer.customer_notes === null
        ? delete this.customerDetails.customer_notes
        : null;
      this.validateForm();

      if (!this.isInvalidForm) {
        this.customer.dob = this.customer.dob
          ? moment(this.customer.dob).format("YYYY-MM-DD")
          : undefined;

        this.mode == "ADD"
          ? this.registerCustomer({
              ...this.customer,
              password: "customer",
              role_id: 3,
            }).then((response) => {
              this.customer = {};
              this.$emit("update:customerDialog", false);
            })
          : this.updateCustomer({
              id: this.customer.id,
              body: {
                name: this.customer.name,
                phone_no: this.customer.phone_no,
                dob: this.customer.dob,
                gender: this.customer.gender,
                note: this.customer.note,
                postcode: this.customer.postcode,
              },
            }).then((response) => {
              this.customer = {};
              this.$emit("update:customerDialog", false);
            });
      } else {
        notifications.warningNotify("Invalid data!");
      }
    },
    padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    },

    formatDate(date) {
      return [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join("-");
    },
    formatTime(date) {
      return [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(":");
    },
    dateFunction() {
      this.$refs.qDateProxy.hide();
      this.dateShowKey++;
    },
  },
};
</script>
