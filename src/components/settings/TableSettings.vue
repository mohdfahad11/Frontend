<template>
  <div>
    <div class="row items-center justify-between">
      <div class="col col-6 " >
        Total Tables*:
        <q-input v-model="totalTables" type="text" outlined disable />
      </div>
      <div class="col col-6 text-right q-pr-sm">
        <q-btn fab color="primary" icon="add" @click="addTables=true" />
      </div>
    </div>

    <div class="row q-mt-lg">
      <div class="col col-12 ">
        Tables List:
        <div class="row" v-if="restaurantTableList.length != 0">
          <q-item
            clickable
            v-ripple
            class="col col-3 non-toggled-button"
            :class="i.status == 0? ['text-red','non-toggled-occupied-button'] : ['text-primary', 'non-toggled-button']"
            v-for="i in restaurantTableList"
            :key="i.id"
            @click="editTable(i)"
          >
            <q-item-section class="user-login text-center">
              {{ i.name }}
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>

    <q-dialog v-model="addTables" persistent>
      <q-card style="min-width: 300px">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Create Table List </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>
        <q-card-section>
          <add-tables :addTables.sync="addTables" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editTables" persistent>
      <q-card style="min-width: 300px">
        <q-card-actions class="bg-primary">
          <div class="col col-10 text-h6 text-white text-bold">
            <span class="q-px-sm rounded-borders"> Edit Table </span>
          </div>
          <div class="col col-2 text-right">
            <q-btn icon="close" color="red" class="q-py-sm" v-close-popup padding="" />
          </div>
        </q-card-actions>
        <q-card-section>
          <edit-table :editTables.sync="editTables" :tableDetails="tableDetails" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapState } from 'vuex';
import AddTables from '../restaurantTables/AddTables.vue';
import EditTable from '../restaurantTables/editTable.vue';

export default {
  components: { AddTables, EditTable },
  data() {
    return {
      addTables:false,
      editTables:false,
      tableList: [],
      tableDetails: {}
    }
  },
  computed: {
    ...mapState('storeUser', ['envVariable']),
    ...mapState('settings', [ 'restaurantTableList', 'tableCount' ]),
    totalTables: {
      get() {
        return this.tableCount
      }
    }
  },
  methods: {
    ...mapActions('settings', ['getRestaurantTables', 'saveRestaurantTableList']),
    editTable(table) {
      this.tableDetails = Object.assign({}, table)
      this.editTables = true
    }
  },
  created() {
    this.getRestaurantTables({restaurant_id: this.envVariable.restaurant_settings.restaurant_id})
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
