<template>
  <div>
    <div class="row">
      <div class="col col-12">
        <q-btn unelevated class="text-primary q-py-sm" icon="arrow_back" @click="goToHome" />
      </div>
    </div>

    <div class="row">
      <div class="col col-12">
        <q-splitter
          v-model="splitterModel"
          style="height: 94vh"
          separator-class="bg-grey-3"
        >
          <template v-slot:before>
            <q-tabs
              v-model="tab"
              vertical
              class="bg-primary text-white bigger-font"
              active-color="primary"
              active-bg-color="grey-3"
              indicator-color="grey-3"
              @input="checkForAdminAuth"
            >
              <q-tab name="General" icon="settings" label="General" />
              <q-tab name="Printer" icon="print" label="Printer" />
              <q-tab name="Theme" icon="color_lens" label="Theme" />
              <q-tab name="Pair Gateway" icon="compare_arrows" label="Pair Gateway" />
              <q-tab name="Entities" icon="mdi-database" label="Entities" />
              <q-tab name="Tables" icon="mdi-table-chair" label="Tables" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="rotate"
              transition-next="rotate"
            >
              <q-tab-panel name="General">
                <!-- <AdminAuthorisedSettings /> -->
                <AdminAuthorisedSettings v-if="adminAuth" />
                <div class="text-h6" v-else>
                  Only store admin can access this!
                </div>
              </q-tab-panel>

              <q-tab-panel name="Printer">
                <PrinterSettings />
              </q-tab-panel>

              <q-tab-panel name="Theme">
                <Themes />
              </q-tab-panel>

              <q-tab-panel name="Pair Gateway">
                <PairGateway />
              </q-tab-panel>

              <q-tab-panel name="Entities">
                <Entities v-if="adminAuth" />
                <div class="text-h6" v-else>
                  Only store admin can access this!
                </div>
              </q-tab-panel>

              <q-tab-panel name="Tables">
                <table-settings />
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>
      </div>
    </div>

    <q-dialog v-model="signInDialog" persistent>
      <q-card>
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Authenticate Admin </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>
        <q-card-section class="row items-center">
          <loginFormVue @change="adminIsAuthenticated" :mode="'authSuperAdmin'" :task="'operateSettings'" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import PrinterSettings from 'src/components/settings/PrinterSettings.vue';
import loginFormVue from 'src/components/sign-in-out/LoginForm.vue';
import Themes from 'src/components/settings/ColorThemes.vue';
import AdminAuthorisedSettings from 'src/components/settings/AdminAuthorisedSettings.vue';
import { mapActions } from 'vuex';
import PairGateway from 'src/components/payment/pairGateway.vue';
import Entities from 'src/components/settings/entities.vue';
import TableSettings from 'src/components/settings/TableSettings.vue';
export default {
  data() {
      return {
          tab: "Printer",
          splitterModel: 20,
          signInDialog: false,
          adminAuth : false
      };
  },
  computed: {
    metaTitle() {
      let title
      title = process.env.PRODUCT_NAME + " v" + process.env.PRODUCT_VERSION_NUMBER + " - " +  process.env.SITE_REFERNCE;
      return title
    },
  },
  components: { PrinterSettings, loginFormVue, Themes, AdminAuthorisedSettings, PairGateway, Entities, TableSettings },
  methods: {
    ...mapActions('storeUser', ['logoutStoreAdmin']),
    adminIsAuthenticated(data) {
      this.adminAuth = data.adminAuth
      this.signInDialog = data.signInDialog
    },
    checkForAdminAuth() {
      this.adminAuth = false
      if(this.tab == 'General' || this.tab == 'Entities') {
        this.signInDialog = true
      } else {
        this.signInDialog = false
      }
    },
    goToHome() {
      // let temp = JSON.parse(localStorage.getItem('AdminTokenLocalStorage'))
      // if(temp != null) {
      //   this.logoutStoreAdmin()
      //   this.$store.commit('storeUser/GET_STORE_ADMIN_TOKEN', null)
      // }
      this.$router.push({ name: 'home' })
    }

  },
  created() {
    this.checkForAdminAuth()
  },
  meta() {
    return {
      title: this.metaTitle,
    };
  },

}
</script>
