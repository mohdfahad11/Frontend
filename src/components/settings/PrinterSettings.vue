<template>
  <div>
    <div class="row">
      <div class="col col-6 q-pa-sm">
        Select Bill Printer:
        <q-select
          outlined
          v-model="selectedPrinter"
          :options="printerList"
          :option-label="(item) => item.displayName"
          :option-value="(item) => item.name"
        />
      </div>

      <div class="col col-6 q-pa-sm">
        Select Coffee/Kitchen Printer:
        <q-select
          outlined
          v-model="selectedCoffeePrinter"
          :options="printerList"
          :option-label="(item) => item.displayName"
          :option-value="(item) => item.name"
        />
      </div>
    </div>

    <div class="row q-pt-xl q-pl-sm" v-if="categories && categories.length!=0">
      <div class="col col-12">
        Select Coffee Categories:
      </div>
      <div class="col col-12 q-pa-sm">
        <q-list bordered class="row">
          <q-item tag="label" v-ripple v-for="item in categories" :key="item.id" class="col col-6 col-sm-4 col-md-3 col-lg-2">
            <q-item-section avatar>
              <q-checkbox v-model="selectedCategories" :val="item.id" color="primary" :key="checkboxKey" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.category }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col col-12 q-pa-sm text-center">
        <q-btn color="primary" label="Save" @click="saveCoffeeCategories()" />
      </div>

    </div>
  </div>
</template>

<script>
import notifications from 'src/boot/notifications';
import { mapState, mapGetters, mapActions } from "vuex";
// const { remote } = require('electron')

export default {
  data() {
    return {
      printerOptions: [],
      selectedCategories: [],
      checkboxKey:0
    }
  },
  computed: {
    ...mapState("settings", ["defaultPrinter", "defaultCoffeePrinter"]),
    ...mapGetters('services', ['categories']),
    selectedPrinter: {
      get() {
        return this.defaultPrinter ? this.defaultPrinter : null;
      },
      set(val) {
        this.$store.commit("settings/SET_DEFAULT_PRINTER", val);
      },
    },
    selectedCoffeePrinter: {
      get() {
        return this.defaultCoffeePrinter ? this.defaultCoffeePrinter : null;
      },
      set(val) {
        this.$store.commit("settings/SET_DEFAULT_COFFEE_PRINTER", val);
      },
    },
    printerList() {
      let list = []
      list = this.printerOptions ? this.printerOptions : []
      return list
    },
    categoryOptions() {
      let temp = []
      if(this.categories && this.categories.length !==0){
        temp = this.categories.map((v) => {
          return {label: v.category, value: v.id}
        })
      }
      return temp
    }
  },
  methods: {
    ...mapActions('services', ['getCategories']),
    async getPrinterOptions() {
      if(window) {
        this.printerOptions = await window.cashDrawer.printerOptions()
      }
    },
    saveCoffeeCategories() {
      this.$store.commit('services/SET_COFFEE_CATEGORIES', this.selectedCategories, {root: true})
      notifications.successNotify("Coffee categories are set!")
    }
  },
  created() {
    this.getPrinterOptions()
    let coffeeCategories = JSON.parse(localStorage.getItem('CategoryCoffeeLocalStorage'))
    this.selectedCategories =  coffeeCategories? [...coffeeCategories] : []
    this.checkboxKey++
  }
};
</script>
