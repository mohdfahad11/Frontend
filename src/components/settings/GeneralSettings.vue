<template>
  <div>
    <div class="row items-center">
      <div class="col col-12 text-h5 text-center">General Information</div>
      <!-- <div class="col col-3 q-pa-sm" :key="inputKey">
        Product Vendor Name*:
        <q-input
          v-model="tyroPosProductInfoClone.vendor"
          ref="vendorRef"
          type="text"
          @change="inputKey++"
          outlined
          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-3 q-pa-sm" :key="inputNameKey">
        Product Name*:
        <q-input
          v-model="tyroPosProductInfoClone.productName"
          ref="nameRef"
          type="text"
          @change="inputNameKey++"
          outlined
          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-3 q-pa-sm" :key="inputVersionKey">
        Version Number*:
        <q-input
          v-model="tyroPosProductInfoClone.version"
          ref="versionRef"
          type="text"
          @change="inputVersionKey++"
          outlined
          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-3 q-pa-sm" :key="inputSiteKey">
        Site Reference*:
        <q-input
          v-model="tyroPosProductInfoClone.siteReference"
          ref="siteRef"
          type="text"
          @change="inputSiteKey++"
          outlined
          :rules="[val => !!val || 'Data is required.']"
        />
      </div> -->
      <div class="col col-4 q-pa-sm" :key="inputAdd1Key">
        Address Line 1*:
        <q-input
          v-model="tyroPosProductInfoClone.addressLine1"
          ref="addLine1Ref"
          type="text"
          @change="inputAdd1Key++"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-4 q-pa-sm" :key="inputAdd2Key">
        Address Line 2*:
        <q-input
          v-model="tyroPosProductInfoClone.addressLine2"
          ref="addLine2Ref"
          type="text"
          @change="inputAdd2Key++"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-4 q-pa-sm text-right">
        <q-toggle
          v-model="offerPopup"
          label="Show Product Offer Popup"
          left-label
        />
      </div>
      <div class="col col-4 q-pa-sm" key="cash_drawer_port_api">
        Cash Drawer API Port:
        <q-input
          v-model="cashDrawerAPIPortLocal"
          type="number"
          outlined
          :rules="[(val) => !!val || 'Data is required.']"
        />
      </div>
    </div>

    <div class="row items-center">
      <div class="col col-12 text-center q-pt-md">
        <q-btn
          push
          label="UPDATE"
          @click="editInformation()"
          class="bg-white text-primary text-bold q-mr-md q-py-sm"
          v-if="settingsMode == 'EDIT'"
        />
        <q-btn
          push
          label="Save and Next"
          @click="saveInformation()"
          class="bg-white text-primary text-bold q-mr-md q-py-sm"
          v-if="settingsMode == 'CONFIG'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import _ from "lodash";
import notifications from "src/boot/notifications";

export default {
  data() {
    return {
      // inputKey:0,
      // inputNameKey:100,
      // inputVersionKey: 200,
      // inputSiteKey: 300,
      inputAdd1Key: 900,
      inputAdd2Key: 1000,
      offerPopup: null,
      tyroPosProductInfoClone: {},
      cashDrawerAPIPortLocal: null,
    };
  },
  computed: {
    ...mapState("storeUser", ["envVariable"]),
    ...mapState("settings", [
      "showProductOfferPopup",
      "settingsMode",
      "tyroPosProductInfo",
      "cashDrawerAPIPort",
    ]),
    showProductOfferPopupModel: {
      get() {
        return this.offerPopup;
      },
      set(val) {
        this.offerPopup = val;
      },
    },
    isInValidated() {
      return this.$refs.addLine1Ref.hasError || this.$refs.addLine2Ref.hasError;
    },
  },
  created() {
    this.cashDrawerAPIPortLocal = this.cashDrawerAPIPort;
    this.offerPopup = this.showProductOfferPopup;
    this.tyroPosProductInfoClone = JSON.parse(
      JSON.stringify(this.tyroPosProductInfo)
    );
  },
  methods: {
    ...mapActions("settings", ["editPosGeneralSettings"]),
    validateForm() {
      // this.$refs.vendorRef.validate()
      // this.$refs.versionRef.validate()
      // this.$refs.nameRef.validate()
      // this.$refs.siteRef.validate()
      this.$refs.addLine1Ref.validate();
      this.$refs.addLine2Ref.validate();
    },
    saveInformation() {
      this.validateForm();
      if (!this.isInValidated) {
        this.$store.commit(
          "settings/SET_POS_PRODUCT_INFO",
          this.tyroPosProductInfoClone
        );
        this.$store.commit(
          "settings/SET_SHOW_PRODUCT_OFFER_POPUP",
          this.offerPopup
        );
        this.$store.commit(
          "settings/SET_CASHDRAWER_API_PORT",
          this.cashDrawerAPIPortLocal
        );
        notifications.successNotify("Information is stored successfully.");
        setTimeout(() => {
          this.nextTab();
        }, 1500);
      } else {
        notifications.warningNotify("Fill every details!");
      }
    },
    nextTab() {
      this.$emit("update:tab", "Payment");
    },
    editInformation() {
      for (let item in this.tyroPosProductInfoClone) {
        if (this.tyroPosProductInfoClone[item] == "") {
          this.tyroPosProductInfoClone[item] = null;
        }
      }
      if (
        _.isEqual(this.tyroPosProductInfo, this.tyroPosProductInfoClone) &&
        this.offerPopup == this.showProductOfferPopup &&
        this.cashDrawerAPIPortLocal == this.cashDrawerAPIPort
      ) {
        notifications.warningNotify("You did not change anything.");
      } else {
        this.$store.commit(
          "settings/SET_CASHDRAWER_API_PORT",
          this.cashDrawerAPIPortLocal
        );

        let obj = {
          product_vendor_name:
            this.tyroPosProductInfo.vendor !=
            this.tyroPosProductInfoClone.vendor
              ? this.tyroPosProductInfoClone.vendor
              : null,
          product_name:
            this.tyroPosProductInfo.productName !=
            this.tyroPosProductInfoClone.productName
              ? this.tyroPosProductInfoClone.productName
              : null,
          product_version:
            this.tyroPosProductInfo.version !=
            this.tyroPosProductInfoClone.version
              ? this.tyroPosProductInfoClone.version
              : null,
          site_reference:
            this.tyroPosProductInfo.siteReference !=
            this.tyroPosProductInfoClone.siteReference
              ? this.tyroPosProductInfoClone.siteReference
              : null,
          address_line_1:
            this.tyroPosProductInfo.addressLine1 !=
            this.tyroPosProductInfoClone.addressLine1
              ? this.tyroPosProductInfoClone.addressLine1
              : null,
          address_line_2:
            this.tyroPosProductInfo.addressLine2 !=
            this.tyroPosProductInfoClone.addressLine2
              ? this.tyroPosProductInfoClone.addressLine2
              : null,
          show_product_offer_popup:
            this.offerPopup != this.showProductOfferPopup
              ? this.offerPopup * 1
              : null,
        };
        for (let prop in obj) {
          if (obj[prop] == null) {
            delete obj[prop];
          }
        }
        this.editPosGeneralSettings({
          restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
          body: obj,
        }).then(() => {
          notifications.successNotify("Data is updated successfully!");
          this.$store.commit(
            "settings/SET_POS_PRODUCT_INFO",
            this.tyroPosProductInfoClone
          );
          this.$store.commit(
            "settings/SET_SHOW_PRODUCT_OFFER_POPUP",
            this.offerPopup
          );
        });
        //api hit
        //commit both on success
      }
    },
  },
};
</script>
