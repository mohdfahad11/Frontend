<template>
  <div>
    <div class="row q-mt-sm q-px-md">
      <div class="col col-6 q-px-sm">
        <q-btn
          push
          stack
          icon="login"
          label="Sign In"
          @click="signIn"
          class="full-width text-primary bg-white"
          padding="6px 10px"
        />
      </div>
      <div class="col col-6 q-pl-sm">
        <q-btn
          push
          stack
          icon="logout"
          label="Sign Out"
          @click="showStaffList=true"
          class="full-width text-primary bg-white"
          padding="6px 10px"
          :disable="Object.keys(loggedInStoreUsers).length == 0"
        />
      </div>
    </div>
    <q-dialog v-model="signInDialog" persistent>
      <q-card>
        <q-card-actions align="right" class="q-py-sm bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class=" q-pa-sm rounded-borders"> Login Details </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>

        <q-card-actions class="q-pt-md">
          <LoginForm :mode="'signIn'" :task="'signIn'" :signInDialog.sync="signInDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showStaffList" persistent>
      <q-card style="min-width:600px">
        <q-card-actions align="right" class="bg-primary q-mb-md">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> LoggedIn Users </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>
        <q-card-actions class="q-pt-none">
          <staff-details />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LoginForm from '../sign-in-out/LoginForm.vue'
import notifications from 'src/boot/notifications'
import StaffDetails from './StaffDetails.vue'
export default {
    data() {
      return {
        user: {},
        signInDialog: false,
        confirmSignOut: false,
        showStaffList: false
      };
    },
    computed: {
      ...mapState('storeUser', ['loggedInStoreUsers']),
      ...mapState('orders', ['orderList']),
    },
    methods: {
      ...mapActions('storeUser', ['logout']),
        signIn() {
            this.signInDialog = true;
        }
    },
    components: { LoginForm, StaffDetails }
}
</script>
