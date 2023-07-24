<template>
  <div>
    <div class="row">
      <div class="col col-4 q-pa-xs">
        <q-input
          v-model="tableData.name"
          outlined
          type="text"
          label="Name"
          debounce="1000"
          :rules="[val => !!val || 'Data is required.']"
        />
      </div>
      <div class="col col-6 q-pa-xs text-center">
        <q-input
          v-model="tableData.description"
          type="text"
          label="Description"
          outlined
          debounce="1000"
        />
      </div>
      <div class="col col-2 q-pa-xs text-right">
        <q-toggle
          v-model="status"
          color="primary"
        />
      </div>
    </div>

    <div class="row">
      <div class="col col-12 text-center">
        <q-btn color="primary" label="Save" @click="editTable()" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vue from 'vue';
import notifications from 'src/boot/notifications';
export default {
  props: ['tableDetails'],
  data() {
    return {
    }
  },
  computed: {
    ...mapState('storeUser', ['envVariable']),
    tableData() {
      return this.tableDetails? this.tableDetails : {}
    },
    status: {
      get(){
        return this.tableData? Boolean(this.tableData.status): false
      },
      set(val) {
        this.tableData.status = +val
      }
    }
  },
  created() {

  },
  methods: {
    ...mapActions('settings', ['getRestaurantTables', 'editRestaurantTable']),
    editTable() {
      this.tableData.status = +this.tableData.status
      this.editRestaurantTable({
        restaurant_id: this.envVariable.restaurant_settings.restaurant_id,
        table_id: this.tableData.id,
        obj: this.tableData
      })
        .then(() => {
          notifications.successNotify("Table is updated successfully!")
          this.$emit('update:editTables', false)
        })
    },
  }
}
</script>
