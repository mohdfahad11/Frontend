<template>
  <div class="row full-width">
    <div class="col col-12" v-if="empOptions.length !=0">
      <q-list class="q-pt-none q-px-sm row">
        <div
          v-for="(item,ind) in empOptions"
          :key="ind"
          class="col-4 q-px-md"
        >
          <q-item
            clickable
            class="bg-white text-primary q-mb-md shadow-24"
            style="border-radius:10px; height: 80px;"
            @click="selectStaff(item)"
          >
            <q-item-section>
              <q-item-label lines="2">{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </div>
    <div class="col col-12 text-h6 text-center" v-else>
      No staff is logged in yet ! Login to continue.
    </div>


    <q-dialog v-model="confirmSignOut" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="orange" text-color="white" />
          <span class="q-ml-sm text-h6">Are you sure, you want to sign out?</span>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn push label="Cancel" class="bg-white text-green text-bold q-py-sm q-mr-xl" v-close-popup />
          <q-btn push label="Sign Out" class="bg-white text-red text-bold q-py-sm" v-close-popup @click="logout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import notifications from 'src/boot/notifications'
  export default {
    data() {
      return {
        activeButton: {},
        confirmSignOut: false,
      }
    },
    computed: {
      ...mapState('storeUser', [ 'loggedInStoreUsers']),
      ...mapState('orders', ['orderList', 'staffTableLink']),
      empOptions() {
        let temp = []
        for(let i in this.loggedInStoreUsers) {
          temp.push(this.loggedInStoreUsers[i].user)
        }
        return temp
      },
    },
    methods:{
      ...mapActions('storeUser', ['logout']),
      selectStaff(emp) {
        for(let i in this.staffTableLink) {
          if(this.staffTableLink[i]['id'] == emp.id) {
            notifications.warningNotify('Complete order before signing out!')
            return
          }
        }
        this.$store.commit('storeUser/SET_EMP_TO_LOGOUT', this.loggedInStoreUsers[emp.id])
        this.confirmSignOut = true
      }
    },
    created() {
    }
  }
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
  .user-login{
    border-color:rgb(227, 77, 77) ;
  }
}
.toggled-button {
  background-color: var(--q-color-primary);
  border: 4px solid rgb(238,238,238);
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
  .user-login{
    border-color: rgb(227, 77, 77);
  }
}
</style>
