<template>
  <div>
    <div class="row q-pa-sm">
      No. of tables to be added:
      <div class="col col-12">
        <q-input
          v-model="model"
          type="text"
          outlined
        />
      </div>
    </div>
    <div v-if="model && model!==null">
      <div v-for="i in parseInt(model)" :key="i">
        <div class="row" v-if="tableData[i-1] !== undefined" >
          <div class="col col-4 q-pa-xs">
            <q-input
              :value="tableData[i-1].name"
              outlined
              type="text"
              label="Name"
              debounce="1000"
              :key="nameKey"
              @input="storeNameData(i-1,$event)"
              :rules="[val => !!val || 'Data is required.']"
            />
          </div>
          <div class="col col-6 q-pa-xs text-center">
            <q-input
              :value="tableData[i-1].description"
              type="text"
              label="Description"
              :key="descKey"
              outlined
              debounce="1000"
              @input="storeDescriptionData(i-1,$event)"
            />
          </div>
          <div class="col col-2 q-pa-xs text-right">
            <q-toggle
              :value="tableData[i-1].status"
              color="primary"
              :key="statusKey"
              @input="storeStatusData(i-1,$event)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="model">
      <div class="col col-12 text-center">
        <q-btn color="primary" label="Save" @click="saveInformation()" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import notifications from 'src/boot/notifications';
export default {
  data() {
    return {
      model: null,
      nameKey: 0,
      descKey:100,
      statusKey:500,
    }
  },
  computed: {
    ...mapState('storeUser', ['envVariable']),
    tableData() {
      let temp = []
      for(let i=0; i<this.model; i++) {
        temp.push({
          name: null,
          description: null,
          status: true
        })
      }
      return temp
    },
  },
  methods: {
    ...mapActions('settings', ['getRestaurantTables', 'saveRestaurantTableList']),
    saveInformation() {
      for(let i in this.tableData) {
        this.tableData[i]['status'] = +this.tableData[i]['status']
        this.tableData[i]['restaurant_id'] = parseInt(this.envVariable.restaurant_settings.restaurant_id)
      }
      this.saveRestaurantTableList({restaurant_tables: this.tableData})
        .then(() => {
          notifications.successNotify("Table list is created successfully!")
          this.$emit('update:addTables', false)
        })
    },
    storeNameData(i,val) {
      this.nameKey++
      Vue.set(this.tableData[i], 'name',val)
    },
    storeDescriptionData(i,val) {
      this.descKey++
      Vue.set(this.tableData[i], 'description',val)
    },
    storeStatusData(i,val) {
      this.statusKey++
      Vue.set(this.tableData[i], 'status',val)
    }
  }
}
</script>
